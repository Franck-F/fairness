"""
ML training and prediction endpoints.
"""

import time
import uuid
import numpy as np
import pandas as pd

from fastapi import APIRouter, HTTPException
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

from config import logger, ML_RANDOM_STATE, ML_DEFAULT_TEST_SIZE, ML_MAX_ESTIMATORS
from schemas import TrainRequest, TrainResponse
from utils import datasets_store, models_store

try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

router = APIRouter(prefix="/api", tags=["ML Training"])


@router.post("/ml/train", response_model=TrainResponse)
async def train_model(request: TrainRequest):
    """Train a classification model on the uploaded dataset."""
    start_time = time.time()

    try:
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail="Dataset non trouve")

        df = datasets_store[request.dataset_id]["df"].copy()

        if request.target_column not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Colonne cible '{request.target_column}' non trouvee",
            )

        # Prepare features
        if request.feature_columns:
            feature_cols = [
                c for c in request.feature_columns
                if c in df.columns and c != request.target_column
            ]
        else:
            feature_cols = [c for c in df.columns if c != request.target_column]

        df = df.dropna(subset=[request.target_column])

        # Encode categorical features
        label_encoders = {}
        for col in feature_cols:
            if df[col].dtype == "object":
                le = LabelEncoder()
                df[col] = df[col].fillna("Unknown")
                df[col] = le.fit_transform(df[col].astype(str))
                label_encoders[col] = le
            else:
                df[col] = df[col].fillna(df[col].median())

        # Encode target if categorical
        y = df[request.target_column]
        if y.dtype == "object":
            le = LabelEncoder()
            y = le.fit_transform(y.astype(str))
            label_encoders["target"] = le
        else:
            y = y.values

        X = df[feature_cols].values

        scaler = StandardScaler()
        X = scaler.fit_transform(X)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=request.test_size, random_state=ML_RANDOM_STATE
        )

        # Train model
        feature_importance = None

        if request.algorithm == "xgboost" and XGBOOST_AVAILABLE:
            model = xgb.XGBClassifier(
                n_estimators=ML_MAX_ESTIMATORS,
                max_depth=5,
                learning_rate=0.1,
                random_state=ML_RANDOM_STATE,
                use_label_encoder=False,
                eval_metric="logloss",
            )
            model.fit(X_train, y_train)
            feature_importance = dict(zip(feature_cols, model.feature_importances_.tolist()))
        else:
            model = LogisticRegression(max_iter=1000, random_state=ML_RANDOM_STATE)
            model.fit(X_train, y_train)
            if hasattr(model, "coef_"):
                importance = (
                    np.abs(model.coef_[0]) if len(model.coef_.shape) > 1 else np.abs(model.coef_)
                )
                feature_importance = dict(zip(feature_cols, importance.tolist()))

        # Predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else None

        metrics = {
            "accuracy": float(accuracy_score(y_test, y_pred)),
            "precision": float(precision_score(y_test, y_pred, average="weighted", zero_division=0)),
            "recall": float(recall_score(y_test, y_pred, average="weighted", zero_division=0)),
            "f1_score": float(f1_score(y_test, y_pred, average="weighted", zero_division=0)),
        }

        if y_pred_proba is not None:
            try:
                metrics["auc_roc"] = float(roc_auc_score(y_test, y_pred_proba))
            except ValueError:
                pass

        model_id = str(uuid.uuid4())
        models_store[model_id] = {
            "model": model,
            "scaler": scaler,
            "label_encoders": label_encoders,
            "feature_columns": feature_cols,
            "target_column": request.target_column,
            "algorithm": request.algorithm,
            "metrics": metrics,
            "dataset_id": request.dataset_id,
        }

        training_time = time.time() - start_time
        logger.info(
            f"Model {model_id} trained ({request.algorithm}): accuracy={metrics['accuracy']:.3f}, time={training_time:.2f}s"
        )

        return TrainResponse(
            model_id=model_id,
            algorithm=request.algorithm if request.algorithm == "xgboost" and XGBOOST_AVAILABLE else "logistic_regression",
            metrics=metrics,
            feature_importance=feature_importance,
            training_time=training_time,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Training error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erreur d'entrainement: {str(e)}")
