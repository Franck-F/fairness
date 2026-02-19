from fastapi import FastAPI, HTTPException, UploadFile, File, Form, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
import json
import os
import io
import uuid
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()


# LLM Service import
from llm_service import LLMAnalyzer
from ds_engine import SeniorDataScientistEngine

# ... (existing imports)

# Initialize LLM Analyzer
try:
    llm_analyzer = LLMAnalyzer()
    print("✅ LLM Analyzer initialized with Gemini")
except Exception as e:
    print(f"⚠️ LLM Analyzer warning: {e}")
    llm_analyzer = None

# ... (existing imports)

def to_json_safe(obj):
    """Recursively convert NaN/Inf/-Inf to None for JSON compliance."""
    # Handle scalar NaN first for speed and to avoid recursion on simple floats
    try:
        if obj is None: return None
        if isinstance(obj, (float, np.floating)):
            if np.isnan(obj) or np.isinf(obj) or str(obj).lower() == 'nan':
                return None
            return float(obj)
            
        if isinstance(obj, dict):
            return {k: to_json_safe(v) for k, v in obj.items()}
        if isinstance(obj, (list, tuple, np.ndarray, pd.Index, pd.Series)):
            if hasattr(obj, "tolist"):
                return [to_json_safe(i) for i in obj.tolist()]
            return [to_json_safe(i) for i in obj]
        
        if isinstance(obj, (int, np.integer)):
            return int(obj)
            
        # Last resort for other NA types
        if pd.isna(obj): return None
    except:
        pass
    return obj




# ML imports
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

# PDF generation
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch


app = FastAPI(
    title="AuditIQ ML Backend",
    description="Backend API for ML training, fairness calculation, and report generation",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for models and datasets
models_store = {}
datasets_store = {}

# Pydantic models
class TrainRequest(BaseModel):
    dataset_id: str
    target_column: str
    algorithm: str = "logistic_regression"  # or "xgboost"
    test_size: float = 0.2
    feature_columns: Optional[List[str]] = None

class TrainResponse(BaseModel):
    model_id: str
    algorithm: str
    metrics: Dict[str, float]
    feature_importance: Optional[Dict[str, float]] = None
    training_time: float

class FairnessRequest(BaseModel):
    dataset_id: Any  # This is the pre-processing dataset
    dataset_id_post: Optional[Any] = None  # This is the post-processing dataset
    model_id: Optional[Any] = None
    target_column: str
    prediction_column: Optional[str] = None
    sensitive_attributes: List[str]
    favorable_outcome: Any = 1
    metrics: Optional[List[str]] = None
    model_type: Optional[str] = None
    ia_type: Optional[str] = None
    enable_llm: bool = True  # New flag to enable/disable LLM

class FairnessMetric(BaseModel):
    name: str
    value: float
    description: str
    threshold: float
    status: str  # "pass", "warning", "fail"

class FairnessResponse(BaseModel):
    audit_id: str
    overall_score: float
    risk_level: str
    bias_detected: bool
    metrics_by_attribute: Dict[str, List[FairnessMetric]]
    recommendations: List[str]
    comparison_results: Optional[Dict[str, Any]] = None

class ReportRequest(BaseModel):
    audit_id: str
    dataset_name: str
    fairness_results: Dict[str, Any]
    model_metrics: Optional[Dict[str, float]] = None
    format: str = "pdf"  # or "txt"

# New Data Science Models
class DSAnalyzeRequest(BaseModel):
    dataset_id: str
    target_column: Optional[str] = None

class DSEdaRequest(BaseModel):
    dataset_id: str
    project_id: Optional[str] = None
    target_column: Optional[str] = None
    n_components: int = 2

class DSAgentChatRequest(BaseModel):
    prompt: str
    dataset_id: str
    target_column: Optional[str] = None
    n_components: int = 2

class DSFeatureEngRequest(BaseModel):
    dataset_id: str
    project_id: Optional[str] = None
    target_column: Optional[str] = None
    date_column: Optional[str] = None
    lags: List[int] = [1, 3, 7]
    windows: List[int] = [3, 7]

class DSModelingRequest(BaseModel):
    dataset_id: str
    project_id: Optional[str] = None
    target_column: str
    algorithm: str = "logistic_regression"  # "logistic_regression", "xgboost", "random_forest"
    test_size: float = 0.2
    feature_columns: Optional[List[str]] = None

class DSIntelligenceRequest(BaseModel):
    dataset_id: str
    project_id: Optional[str] = None

class DSInterpretRequest(BaseModel):
    model_id: str
    dataset_id: str
    project_id: Optional[str] = None

class DataBiasRequest(BaseModel):
    dataset_id: Optional[str] = None
    target_column: Optional[str] = None
    sensitive_attributes: Any = []
    favorable_outcome: Any = 1

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Utility to ensure directory exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

# Helper to load dataset from store or disk
def load_dataset(dataset_id: Any):
    # Ensure ID is a string for dictionary lookup
    sid = str(dataset_id)
    
    # 1. Check if already in memory
    if sid in datasets_store:
        return datasets_store[sid]["df"].copy(), datasets_store[sid]["filename"]
    
    # 2. Try to reload from local disk (if it survived restart)
    possible_file = os.path.join(UPLOAD_DIR, f"{sid}.csv")
    if os.path.exists(possible_file):
        try:
            df = pd.read_csv(possible_file)
            filename = f"reloaded_{sid}.csv"
            # Restore to store for future use
            datasets_store[sid] = {
                "df": df,
                "filename": filename,
                "name": filename,
                "uploaded_at": datetime.now().isoformat(),
                "rows": len(df),
                "columns": len(df.columns)
            }
            print(f"✅ Restored dataset {sid} from disk.")
            return df.copy(), filename
        except Exception as e:
            print(f"❌ Failed to restore {sid} from disk: {str(e)}")
            
    # 3. Last fallback: search for ANY file starting with ID (e.g. .xlsx)
    import glob
    files = glob.glob(os.path.join(UPLOAD_DIR, f"{sid}.*"))
    if files:
        target = files[0]
        try:
            if target.endswith('.csv'): df = pd.read_csv(target)
            else: df = pd.read_excel(target)
            filename = os.path.basename(target)
            datasets_store[sid] = {"df": df, "filename": filename, "name": filename, "uploaded_at": datetime.now().isoformat(), "rows": len(df), "columns": len(df.columns)}
            return df.copy(), filename
        except: pass

    # 4. If nowhere to be found
    print(f"ERROR: Dataset ID {sid} not found in memory or disk. Keys: {list(datasets_store.keys())}")
    raise HTTPException(status_code=404, detail=f"Dataset {sid} non trouve - Veuillez re-uploader le fichier.")

@app.post("/api/datasets/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    dataset_name: str = Form(None),
    dataset_id: str = Form(None)
):
    print(f"📥 Received re-upload request for dataset_id: {dataset_id}")
    try:
        # Use provided ID or generate a new one
        active_id = dataset_id if dataset_id else str(uuid.uuid4())
        
        # Read file content
        content = await file.read()
        
        # Save to disk for persistence across reloads
        file_ext = ".csv" if file.filename.lower().endswith('.csv') else ".xlsx"
        save_path = os.path.join(UPLOAD_DIR, f"{active_id}{file_ext}")
        with open(save_path, "wb") as f:
            f.write(content)
        
        # Determine file type and parse
        filename = file.filename.lower()
        print(f"DEBUG: Parsing file {filename}")
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Format de fichier non supporte. Utilisez CSV ou Excel.")
        
        print(f"DEBUG: File parsed. Columns: {list(df.columns)}")
        # Detect column types
        columns_info = []
        for col in df.columns:
            dtype = df[col].dtype
            if pd.api.types.is_numeric_dtype(dtype):
                col_type = "numerical"
            elif pd.api.types.is_datetime64_any_dtype(dtype):
                col_type = "datetime"
            elif isinstance(dtype, pd.CategoricalDtype) or (not pd.api.types.is_numeric_dtype(dtype) and df[col].nunique() < 20):
                col_type = "categorical"
            else:
                col_type = "text"
            
            columns_info.append({
                "name": col,
                "type": col_type
            })
        
        # Calculate file size
        file_size_bytes = len(content)
        if file_size_bytes < 1024:
            size_str = f"{file_size_bytes} B"
        elif file_size_bytes < 1024 * 1024:
            size_str = f"{file_size_bytes / 1024:.2f} KB"
        else:
            size_str = f"{file_size_bytes / (1024 * 1024):.2f} MB"
        
        # Data Profiling (GIGO Principle)
        print("DEBUG: Calculating profiling stats")
        profiling = {
            "missing_values": df.isnull().sum().to_dict(),
            "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "summary_stats": df.describe(include=[np.number]).to_dict() if not df.select_dtypes(include=[np.number]).empty else {},
        }
        
        print("DEBUG: Profiling completed")
        # Add a "quality_alert" if too many missing values
        total_missing = sum(profiling["missing_values"].values())
        quality_score = max(0, 100 - (total_missing / (len(df) * len(df.columns)) * 100))
        print(f"DEBUG: Quality score: {quality_score}")
        
        # Add to store
        datasets_store[active_id] = {
            "df": df,
            "filename": filename,
            "name": dataset_name if dataset_name else filename,
            "uploaded_at": datetime.now().isoformat(),
            "rows": len(df),
            "columns": len(df.columns),
            "columns_info": columns_info,
            "profiling": profiling,
            "quality_score": round(quality_score, 2)
        }
        
        print(f"✅ Dataset {active_id} uploaded. Rows: {len(df)}, Quality Score: {quality_score}")
        
        return to_json_safe({
            "dataset_id": active_id,
            "filename": file.filename,
            "rows": len(df),
            "columns": len(df.columns),
            "columns_info": columns_info,
            "stats": {
                "rows": len(df),
                "cols": len(df.columns)
            },
            "profiling": profiling,
            "quality_score": round(quality_score, 2)
        })
    except Exception as e:
        import traceback
        print(f"❌ Upload Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# Get dataset info
@app.get("/api/datasets/{dataset_id}")
async def get_dataset(dataset_id: str):
    if dataset_id not in datasets_store:
        raise HTTPException(status_code=404, detail="Dataset non trouve")
    
    dataset = datasets_store[dataset_id]
    df = dataset["df"]
    
    return {
        "dataset_id": dataset_id,
        "filename": dataset["filename"],
        "name": dataset["name"],
        "rows": dataset["rows"],
        "columns": dataset["columns"],
        "column_names": dataset["column_names"],
        "dtypes": dataset["dtypes"],
        "missing_values": dataset["missing_values"],
        "preview": df.head(10).to_dict(orient="records"),
        "statistics": df.describe().to_dict()
    }

# ML Training endpoint
@app.post("/api/ml/train", response_model=TrainResponse)
async def train_model(request: TrainRequest):
    import time
    start_time = time.time()
    
    try:
        # Get dataset
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail="Dataset non trouve")
        
        df = datasets_store[request.dataset_id]["df"].copy()
        
        # Validate target column
        if request.target_column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Colonne cible '{request.target_column}' non trouvee")
        
        # Prepare features
        if request.feature_columns:
            feature_cols = [c for c in request.feature_columns if c in df.columns and c != request.target_column]
        else:
            feature_cols = [c for c in df.columns if c != request.target_column]
        
        # Handle missing values
        df = df.dropna(subset=[request.target_column])
        
        # Encode categorical features
        label_encoders = {}
        for col in feature_cols:
            if df[col].dtype == 'object':
                le = LabelEncoder()
                df[col] = df[col].fillna('Unknown')
                df[col] = le.fit_transform(df[col].astype(str))
                label_encoders[col] = le
            else:
                df[col] = df[col].fillna(df[col].median())
        
        # Encode target if categorical
        y = df[request.target_column]
        if y.dtype == 'object':
            le = LabelEncoder()
            y = le.fit_transform(y.astype(str))
            label_encoders['target'] = le
        else:
            y = y.values
        
        X = df[feature_cols].values
        
        # Scale features
        scaler = StandardScaler()
        X = scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=request.test_size, random_state=42
        )
        
        # Train model
        feature_importance = None
        
        if request.algorithm == "xgboost" and XGBOOST_AVAILABLE:
            model = xgb.XGBClassifier(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.1,
                random_state=42,
                use_label_encoder=False,
                eval_metric='logloss'
            )
            model.fit(X_train, y_train)
            feature_importance = dict(zip(feature_cols, model.feature_importances_.tolist()))
        else:
            model = LogisticRegression(max_iter=1000, random_state=42)
            model.fit(X_train, y_train)
            if hasattr(model, 'coef_'):
                importance = np.abs(model.coef_[0]) if len(model.coef_.shape) > 1 else np.abs(model.coef_)
                feature_importance = dict(zip(feature_cols, importance.tolist()))
        
        # Predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None
        
        # Calculate metrics
        metrics = {
            "accuracy": float(accuracy_score(y_test, y_pred)),
            "precision": float(precision_score(y_test, y_pred, average='weighted', zero_division=0)),
            "recall": float(recall_score(y_test, y_pred, average='weighted', zero_division=0)),
            "f1_score": float(f1_score(y_test, y_pred, average='weighted', zero_division=0))
        }
        
        if y_pred_proba is not None:
            try:
                metrics["auc_roc"] = float(roc_auc_score(y_test, y_pred_proba))
            except:
                pass
        
        # Store model
        model_id = str(uuid.uuid4())
        models_store[model_id] = {
            "model": model,
            "scaler": scaler,
            "label_encoders": label_encoders,
            "feature_columns": feature_cols,
            "target_column": request.target_column,
            "algorithm": request.algorithm,
            "metrics": metrics,
            "dataset_id": request.dataset_id
        }
        
        training_time = time.time() - start_time
        
        return TrainResponse(
            model_id=model_id,
            algorithm=request.algorithm if request.algorithm == "xgboost" and XGBOOST_AVAILABLE else "logistic_regression",
            metrics=metrics,
            feature_importance=feature_importance,
            training_time=training_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur d'entrainement: {str(e)}")

def _calculate_metrics_for_df(df, target_column, sensitive_attributes, favorable_outcome=1, predictions=None):
    """Helper to calculate fairness metrics for a dataframe."""
    import numpy as np
    
    if predictions is None:
        predictions = df[target_column]
    
    actual = df[target_column]
    metrics_by_attribute = {}
    all_scores = []
    
    for attr in sensitive_attributes:
        print(f"🧐 [Metrics] Checking attribute: {attr}")
        if attr not in df.columns:
            print(f"⚠️ [Metrics] Attribute {attr} not found in columns: {df.columns.tolist()}")
            continue
            
        attr_metrics = []
        groups = [g for g in df[attr].unique() if pd.notna(g)]
        print(f"🧐 [Metrics] Found groups for {attr}: {groups}")
        
        if len(groups) < 2:
            print(f"⚠️ [Metrics] Not enough groups for {attr} (needed 2+, found {len(groups)})")
            continue
        
        # Calculate metrics for each pair of groups
        group_stats = {}
        for group in groups:
            mask = df[attr] == group
            group_preds = predictions[mask].astype(str)
            group_actual = actual[mask].astype(str)
            fav_str = str(favorable_outcome)
            
            # Positive rate (predictions)
            matches = (group_preds == fav_str)
            positive_rate = matches.mean() if len(group_preds) > 0 else 0
            
            print(f"📊 [Metrics] Group {group}: {len(group_preds)} rows, {matches.sum()} positive matches, rate {positive_rate:.4f}")

            # True positive rate (actual positives correctly predicted)
            actual_positive_mask = (group_actual == fav_str)
            if actual_positive_mask.sum() > 0:
                tpr = ((group_preds == fav_str) & actual_positive_mask).sum() / actual_positive_mask.sum()
            else:
                tpr = 0
            
            # False positive rate
            actual_negative_mask = (group_actual != fav_str)
            if actual_negative_mask.sum() > 0:
                fpr = ((group_preds == fav_str) & actual_negative_mask).sum() / actual_negative_mask.sum()
            else:
                fpr = 0
            
            group_stats[group] = {
                "positive_rate": float(positive_rate),
                "tpr": float(tpr),
                "fpr": float(fpr),
                "count": int(mask.sum())
            }
        
        # Reference group (majority or first)
        ref_group = max(group_stats.keys(), key=lambda g: group_stats[g]["count"])
        ref_stats = group_stats[ref_group]
        
        for group, stats in group_stats.items():
            if group == ref_group:
                continue
            
            # 1. Statistical Parity Difference (Demographic Parity)
            spd = stats["positive_rate"] - ref_stats["positive_rate"]
            spd_status = "pass" if abs(spd) < 0.1 else ("warning" if abs(spd) < 0.2 else "fail")
            attr_metrics.append(FairnessMetric(
                name="Parite Statistique (SPD)",
                value=round(spd, 4),
                description=f"Difference de taux de selection entre {group} et {ref_group}",
                threshold=0.1,
                status=spd_status
            ))
            all_scores.append(1 - min(abs(spd), 1))
            
            # 2. Disparate Impact Ratio
            if ref_stats["positive_rate"] > 0:
                di = stats["positive_rate"] / ref_stats["positive_rate"]
            else:
                di = 1.0
            di_status = "pass" if 0.8 <= di <= 1.25 else ("warning" if 0.6 <= di <= 1.5 else "fail")
            attr_metrics.append(FairnessMetric(
                name="Impact Disparate (DI)",
                value=round(di, 4),
                description=f"Ratio de selection entre {group} et {ref_group}",
                threshold=0.8,
                status=di_status
            ))
            all_scores.append(min(di, 1/di) if di > 0 else 0)
            
            # 3. Equal Opportunity Difference
            eod = stats["tpr"] - ref_stats["tpr"]
            eod_status = "pass" if abs(eod) < 0.1 else ("warning" if abs(eod) < 0.2 else "fail")
            attr_metrics.append(FairnessMetric(
                name="Egalite des Chances (EOD)",
                value=round(eod, 4),
                description=f"Difference de taux de vrais positifs entre {group} et {ref_group}",
                threshold=0.1,
                status=eod_status
            ))
            all_scores.append(1 - min(abs(eod), 1))
            
            # 4. Equalized Odds Difference
            fpr_diff = stats["fpr"] - ref_stats["fpr"]
            avg_odds = (abs(eod) + abs(fpr_diff)) / 2
            eo_status = "pass" if avg_odds < 0.1 else ("warning" if avg_odds < 0.2 else "fail")
            attr_metrics.append(FairnessMetric(
                name="Odds Egalises (EO)",
                value=round(avg_odds, 4),
                description=f"Moyenne des differences TPR et FPR entre {group} et {ref_group}",
                threshold=0.1,
                status=eo_status
            ))
            all_scores.append(1 - min(avg_odds, 1))
            
        metrics_by_attribute[attr] = attr_metrics
        
    overall_score = np.mean(all_scores) * 100 if all_scores else 100
    
    # Determine risk level based on professional standards (Fairlearn/AIF360)
    # 90-100: Low Risk, 75-89: Medium Risk, < 75: High Risk
    if overall_score >= 90:
        risk_level = "faible"
    elif overall_score >= 75:
        risk_level = "moyen"
    else:
        risk_level = "eleve"
        
    return {
        "overall_score": round(overall_score, 2),
        "risk_level": risk_level,
        "metrics_by_attribute": metrics_by_attribute,
        "bias_detected": any(m.status=="fail" for attr in metrics_by_attribute.values() for m in attr)
    }

# Fairness calculation endpoint
@app.post("/api/fairness/calculate", response_model=FairnessResponse)
async def calculate_fairness(request: FairnessRequest):
    try:
        # 1. Process Pre-processing Dataset (Original)
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail="Dataset original non trouve")
        
        df_pre = datasets_store[request.dataset_id]["df"].copy()
        results_pre = _calculate_metrics_for_df(
            df_pre, request.target_column, request.sensitive_attributes, request.favorable_outcome
        )
        
        # 2. Process Post-processing Dataset (Mitigated)
        results_post = None
        if request.dataset_id_post and request.dataset_id_post in datasets_store:
            df_post = datasets_store[request.dataset_id_post]["df"].copy()
            results_post = _calculate_metrics_for_df(
                df_post, request.target_column, request.sensitive_attributes, request.favorable_outcome
            )
        
        # We focus on the post dataset if it exists, otherwise the pre dataset
        main_results = results_post if results_post else results_pre
        
        comparison_results = None
        if results_post:
            comparison_results = {
                "pre": results_pre["metrics_by_attribute"],
                "post": results_post["metrics_by_attribute"],
                "improvement": round(results_post["overall_score"] - results_pre["overall_score"], 2)
            }
        
        # Risk level and recommendations are now centralized or LLM-driven
        risk_level = main_results.get("risk_level", "eleve")
        overall_score = main_results["overall_score"]
            
        # Generate recommendations
        all_recommendations = []
        if main_results["bias_detected"]:
            for attr, metrics in main_results["metrics_by_attribute"].items():
                for m in metrics:
                    if m.status == "fail":
                        if "Parite" in m.name:
                            all_recommendations.append(f"Reequilibrer les taux de selection pour l'attribut '{attr}'")
                        if "Impact" in m.name:
                            all_recommendations.append(f"Appliquer une correction d'impact disparate pour '{attr}'")
        
        if not all_recommendations:
            if risk_level == "faible":
                all_recommendations = ["Continuer a surveiller les metriques de fairness regulierement"]
            else:
                all_recommendations = [
                    "Analyser les donnees d'entrainement pour detecter les desequilibres",
                    "Appliquer des contraintes de fairness lors de l'entrainement"
                ]
        
        return FairnessResponse(
            audit_id=str(uuid.uuid4()),
            overall_score=overall_score,
            risk_level="Low" if risk_level == "faible" else "Medium" if risk_level == "moyen" else "High",
            bias_detected=main_results["bias_detected"],
            metrics_by_attribute=main_results["metrics_by_attribute"],
            recommendations=list(set(all_recommendations))[:5],
            comparison_results=comparison_results
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de calcul de fairness: {str(e)}")

# Report generation endpoint
@app.post("/api/reports/generate")
async def generate_report(request: ReportRequest):
    try:
        if request.format == "pdf":
            # Generate PDF report
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4)
            styles = getSampleStyleSheet()
            elements = []
            
            # Title
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                textColor=colors.HexColor('#1a365d')
            )
            elements.append(Paragraph("Rapport d'Audit de Fairness - AuditIQ", title_style))
            elements.append(Spacer(1, 20))
            
            # Dataset info
            elements.append(Paragraph(f"<b>Dataset:</b> {request.dataset_name}", styles['Normal']))
            elements.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%d/%m/%Y %H:%M')}", styles['Normal']))
            elements.append(Paragraph(f"<b>ID Audit:</b> {request.audit_id}", styles['Normal']))
            elements.append(Spacer(1, 20))
            
            # Data Quality Section (GIGO Principle)
            elements.append(Paragraph("Diagnostic de Qualité des Données", styles['Heading2']))
            elements.append(Spacer(1, 10))
            
            quality_score = request.fairness_results.get('quality_score', 100)
            elements.append(Paragraph(f"Score de Qualité: <b>{quality_score}%</b>", styles['Normal']))
            
            profiling = request.fairness_results.get('profiling', {})
            if profiling and "missing_values" in profiling:
                elements.append(Paragraph("Valeurs manquantes détectées:", styles['Normal']))
                mv_data = [["Colonne", "Valeurs Manquantes"]]
                for col, count in list(profiling["missing_values"].items())[:10]: # Limit to top 10
                    if count > 0:
                        mv_data.append([col, str(count)])
                
                if len(mv_data) > 1:
                    mv_table = Table(mv_data, colWidths=[3*inch, 2*inch])
                    mv_table.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e2e8f0')),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
                    ]))
                    elements.append(mv_table)
                else:
                    elements.append(Paragraph("<i>Aucune valeur manquante majeure détectée.</i>", styles['Normal']))
            
            elements.append(Spacer(1, 20))
            
            # Overall score
            results = request.fairness_results
            score = results.get('overall_score', 0)
            risk = results.get('risk_level', 'N/A')
            
            score_style = ParagraphStyle(
                'Score',
                parent=styles['Heading2'],
                fontSize=18,
                textColor=colors.HexColor('#2d3748')
            )
            elements.append(Paragraph(f"Score Global: {score}%", score_style))
            elements.append(Paragraph(f"Niveau de Risque: {risk.upper()}", styles['Normal']))
            elements.append(Spacer(1, 20))
            
            # Metrics table
            elements.append(Paragraph("Metriques de Fairness par Attribut", styles['Heading2']))
            elements.append(Spacer(1, 10))
            
            metrics_by_attr = results.get('metrics_by_attribute', {})
            for attr, metrics in metrics_by_attr.items():
                elements.append(Paragraph(f"<b>Attribut: {attr}</b>", styles['Normal']))
                
                table_data = [["Metrique", "Valeur", "Seuil", "Statut"]]
                for m in metrics:
                    if isinstance(m, dict):
                        table_data.append([
                            m.get('name', 'N/A'),
                            str(m.get('value', 'N/A')),
                            str(m.get('threshold', 'N/A')),
                            m.get('status', 'N/A').upper()
                        ])
                
                if len(table_data) > 1:
                    table = Table(table_data, colWidths=[2*inch, 1*inch, 1*inch, 1*inch])
                    table.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4a5568')),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0, 0), (-1, -1), 10),
                        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f7fafc')),
                        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0'))
                    ]))
                    elements.append(table)
                    elements.append(Spacer(1, 15))
            
            # Recommendations
            recommendations = results.get('recommendations', [])
            if recommendations:
                elements.append(Paragraph("Recommandations", styles['Heading2']))
                for rec in recommendations:
                    elements.append(Paragraph(f"* {rec}", styles['Normal']))
                    
            # Methodology & Limitations
            elements.append(Spacer(1, 30))
            elements.append(Paragraph("Méthodologie & Limites", styles['Heading2']))
            elements.append(Paragraph(
                "Cet audit a été réalisé en utilisant le moteur AuditIQ, basé sur les standards Fairlearn 0.8.0. "
                "Les métriques calculées (Statistical Parity, Disparate Impact, Equalized Odds) mesurent les disparités "
                "algorithmiques mais ne constituent pas une preuve juridique de discrimination. "
                "La fiabilité des résultats dépend directement de la qualité du dataset fourni (principe GIGO).",
                styles['Normal']
            ))
            
            # Build PDF
            doc.build(elements)
            buffer.seek(0)
            
            return StreamingResponse(
                buffer,
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename=audit_report_{request.audit_id}.pdf"}
            )
        
        else:  # TXT format
            report_text = f"""================================================
RAPPORT D'AUDIT DE FAIRNESS - AUDITIQ
================================================

Dataset: {request.dataset_name}
Date: {datetime.now().strftime('%d/%m/%Y %H:%M')}
ID Audit: {request.audit_id}

------------------------------------------------
RESULTATS GLOBAUX
------------------------------------------------
Score Global: {request.fairness_results.get('overall_score', 0)}%
Niveau de Risque: {request.fairness_results.get('risk_level', 'N/A').upper()}
Biais Detecte: {'OUI' if request.fairness_results.get('bias_detected', False) else 'NON'}

------------------------------------------------
METRIQUES PAR ATTRIBUT
------------------------------------------------
"""
            
            for attr, metrics in request.fairness_results.get('metrics_by_attribute', {}).items():
                report_text += f"\nAttribut: {attr}\n"
                report_text += "-" * 40 + "\n"
                for m in metrics:
                    if isinstance(m, dict):
                        report_text += f"  {m.get('name', 'N/A')}: {m.get('value', 'N/A')} (Seuil: {m.get('threshold', 'N/A')}) [{m.get('status', 'N/A').upper()}]\n"
            
            report_text += "\n------------------------------------------------\nRECOMMANDATIONS\n------------------------------------------------\n"
            for rec in request.fairness_results.get('recommendations', []):
                report_text += f"* {rec}\n"
            
            report_text += "\n================================================\nGenere par AuditIQ - Plateforme d'Audit IA\n================================================"
            
            return StreamingResponse(
                io.BytesIO(report_text.encode('utf-8')),
                media_type="text/plain",
                headers={"Content-Disposition": f"attachment; filename=audit_report_{request.audit_id}.txt"}
            )
            
    except Exception as e:
        print(f"Error in report generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import Request

@app.post("/api/fairness/bias-analysis")
async def calculate_data_bias(raw_request: Request):
    """
    Analyzes the raw dataset for bias BEFORE model predictions.
    Computes distributions and correlations.
    """
    try:
        request_data = await raw_request.json()
    except Exception as e:
        print(f"DEBUG: Failed to parse JSON: {e}")
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    print(f"DEBUG: Data bias request received: {request_data}")
    
    try:
        # Extract data with safe defaults
        dataset_id = request_data.get('dataset_id')
        target_column = request_data.get('target_column')
        attrs = request_data.get('sensitive_attributes', [])
        favorable_outcome = request_data.get('favorable_outcome', 1)
        
        if not dataset_id:
            raise HTTPException(status_code=400, detail="dataset_id is required")
            
        # Robust parsing of sensitive_attributes (handles string, json or list)
        if isinstance(attrs, str):
            try:
                import json
                attrs = json.loads(attrs)
            except:
                attrs = [a.strip() for a in attrs.split(',') if a.strip()]
        
        if not isinstance(attrs, list):
            attrs = []
            
        # Ensure items are strings
        attrs = [str(a) for a in attrs]
        
        df, _ = load_dataset(dataset_id)
        
        results = {
            "demographics": {},
            "success_rates": {},
            "proxy_correlations": {}
        }
        
        # 1. Demographics & Success Rates
        for attr in attrs:
            if attr not in df.columns:
                continue
                
            # Counts
            counts = df[attr].value_counts().to_dict()
            total = len(df)
            results["demographics"][attr] = [
                {"name": str(k), "value": int(v), "percentage": round(v/total*100, 2)}
                for k, v in counts.items()
            ]
            
            # Favorable outcome rates
            if target_column and target_column in df.columns:
                fav_val = str(favorable_outcome)
                group_rates = []
                for group in counts.keys():
                    group_df = df[df[attr] == group]
                    if len(group_df) > 0:
                        successes = (group_df[target_column].astype(str) == fav_val).sum()
                        rate = successes / len(group_df)
                        group_rates.append({
                            "group": str(group),
                            "rate": round(float(rate), 4),
                            "count": int(len(group_df))
                        })
                results["success_rates"][attr] = group_rates

        # 2. Proxy Correlation Analysis
        numeric_df = df.select_dtypes(include=[np.number])
        if not numeric_df.empty:
            for attr in attrs:
                if attr not in df.columns: continue
                
                # Encode sensitive attribute if categorical
                target_series = df[attr]
                if target_series.dtype == 'object' or target_series.nunique() < 20:
                    from sklearn.preprocessing import LabelEncoder
                    le = LabelEncoder()
                    target_encoded = le.fit_transform(target_series.astype(str))
                else:
                    target_encoded = target_series
                
                corrs = []
                for col in numeric_df.columns:
                    if col == attr or col == target_column: continue
                    
                    # Correlation coefficient
                    col_data = numeric_df[col].fillna(numeric_df[col].median())
                    if col_data.std() == 0: continue
                    
                    correlation = np.corrcoef(target_encoded, col_data)[0, 1]
                    if abs(correlation) > 0.1: # Significant enough to show
                        corrs.append({
                            "feature": col,
                            "correlation": round(float(correlation), 4),
                            "abs_correlation": abs(float(correlation))
                        })
                
                # Sort by absolute correlation
                corrs.sort(key=lambda x: x["abs_correlation"], reverse=True)
                results["proxy_correlations"][attr] = corrs[:10] 

        return results

    except HTTPException as he:
        # Re-raise HTTP exceptions (like 404 from load_dataset)
        raise he
    except Exception as e:
        import traceback
        print(f"Error in data-bias calculation: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ds/analyze")
async def ds_analyze(request: DSAnalyzeRequest):
    try:
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail=f"Dataset '{request.dataset_id}' non trouve")
        
        df = datasets_store[request.dataset_id]["df"]
        
        # Log analysis start
        print(f"Analyzing dataset {request.dataset_id} for target {request.target_column}")
        
        detailed_stats = SeniorDataScientistEngine.get_detailed_stats(df)
        recommendations = SeniorDataScientistEngine.get_expert_recommendations(df, request.target_column)
        quality_score = SeniorDataScientistEngine.get_quality_score(df)
        
        return to_json_safe({
            "status": "success",
            "detailed_stats": detailed_stats,
            "recommendations": recommendations,
            "quality_score": quality_score
        })
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        print(f"DS Analyze Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ds/intelligence")
async def ds_intelligence(request: DSIntelligenceRequest):
    try:
        if request.dataset_id not in datasets_store:
            # Try reloading from disk if possible
            try:
                df, _ = load_dataset(request.dataset_id)
            except:
                raise HTTPException(status_code=404, detail="Dataset non trouve")
        else:
            df = datasets_store[request.dataset_id]["df"]
        
        if llm_analyzer is None:
            raise HTTPException(status_code=500, detail="LLM analyzer non disponible")
        
        # Prepare preview and columns info
        preview = df.head(5).to_dict(orient="records")
        columns_info = datasets_store[request.dataset_id].get("columns_info", [])
        
        if not columns_info:
            # Reconstruct if missing
            for col in df.columns:
                columns_info.append({"name": col, "type": str(df[col].dtype)})
        
        intelligence = await llm_analyzer.analyze_dataset_semantics(preview, columns_info)
        
        # Calculate stats and quality score early for Command Center
        detailed_stats = SeniorDataScientistEngine.get_detailed_stats(df)
        quality_score = SeniorDataScientistEngine.get_quality_score(df)

        # Persist to project if available
        if request.project_id:
            await update_ds_project(request.project_id, {
                "intelligence_suggestions": intelligence
            })
        
        return to_json_safe({
            "status": "success",
            "intelligence": intelligence,
            "preview": preview,
            "detailed_stats": detailed_stats,
            "quality_score": quality_score
        })
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        print(f"DS Intelligence Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

async def update_ds_project(project_id: str, update_data: Dict[str, Any]):
    """Helper to update a Data Science project in Supabase."""
    try:
        if not project_id or project_id == "undefined":
            return
        
        # Ensure it's a valid ID
        supabase.table("ds_projects").update(update_data).eq("id", project_id).execute()
        print(f"✅ Updated DS Project {project_id}")
    except Exception as e:
        print(f"⚠️ Failed to update DS Project {project_id}: {e}")

@app.post("/api/ds/eda")
async def ds_eda(request: DSEdaRequest):
    try:
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail=f"Dataset '{request.dataset_id}' non trouve")
        
        df = datasets_store[request.dataset_id]["df"]
        print(f"Running EDA for dataset {request.dataset_id}")
        
        target_dist = None
        if request.target_column:
            target_dist = SeniorDataScientistEngine.get_target_distributions(df, request.target_column)
        
        dim_reduction = SeniorDataScientistEngine.get_dimensionality_reduction(df, request.n_components)
        
        # Expert Exploration Additions
        correlations = SeniorDataScientistEngine.get_correlation_matrix(df)
        outliers = SeniorDataScientistEngine.get_outlier_analysis(df)
        
        detailed_stats = SeniorDataScientistEngine.get_detailed_stats(df)
        expert_insights = None
        if llm_analyzer:
            expert_insights = await llm_analyzer.generate_expert_eda_insights(
                detailed_stats, 
                request.target_column,
                {"filename": datasets_store[request.dataset_id].get("filename", "Inconnu")}
            )
            
        results = {
            "target_distributions": target_dist,
            "dimensionality_reduction": dim_reduction,
            "correlations": correlations,
            "outliers": outliers,
            "expert_insights": expert_insights
        }

        # Persist to project if available
        if request.project_id:
            await update_ds_project(request.project_id, {
                "eda_results": results,
                "target_column": request.target_column,
                "status": "eda_completed"
            })
        
        return to_json_safe({
            "status": "success",
            **results
        })
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        print(f"DS EDA Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ds/feature-engineering")
async def ds_feature_engineering(request: DSFeatureEngRequest):
    try:
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail=f"Dataset '{request.dataset_id}' non trouve")
        
        df = datasets_store[request.dataset_id]["df"].copy()
        
        new_features = []
        if request.date_column:
            df, ts_features = SeniorDataScientistEngine.engineer_time_series_features(
                df, request.date_column, request.target_column, request.lags, request.windows
            )
            new_features.extend(ts_features)
        
        # Update store with new features
        datasets_store[request.dataset_id]["df"] = df
        
        # We don't save the whole DF to ds_projects (too big), 
        # but we could save the list of engineered features
        if request.project_id:
            await update_ds_project(request.project_id, {
                "problem_type": "Time Series" if request.date_column else "General"
            })
        
        return to_json_safe({
            "status": "success",
            "new_features": new_features,
            "preview": df.head(10).to_dict(orient="records")
        })
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        print(f"DS FE Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ds/modeling")
async def ds_modeling(request: DSModelingRequest):
    try:
        # Use train_model logic
        train_req = TrainRequest(
            dataset_id=request.dataset_id,
            target_column=request.target_column,
            algorithm=request.algorithm,
            test_size=request.test_size,
            feature_columns=request.feature_columns
        )
        
        results = await train_model(train_req)
        
        # Persist to project if available
        if request.project_id:
            await update_ds_project(request.project_id, {
                "modeling_results": results.dict() if hasattr(results, "dict") else results,
                "status": "modeled"
            })
        
        # Convert model results to safe dict for response
        safe_results = results.dict() if hasattr(results, "dict") else results
        return to_json_safe(safe_results)
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        print(f"DS Modeling Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ds/interpret")
async def ds_interpret(request: DSInterpretRequest):
    try:
        if request.model_id not in models_store:
            raise HTTPException(status_code=404, detail="Modele non trouve")
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail="Dataset non trouve")
            
        model_data = models_store[request.model_id]
        df = datasets_store[request.dataset_id]["df"]
        
        # Prepare X (simple version for now)
        X = df.select_dtypes(include=[np.number])
        if model_data.get("feature_columns"):
             feature_cols = [c for c in model_data["feature_columns"] if c in X.columns]
             X = X[feature_cols]
        
        shap_results = SeniorDataScientistEngine.get_shap_interpretation(model_data["model"], X)
        
        # Persist to project if available
        if request.project_id:
            await update_ds_project(request.project_id, {
                "interpretability_results": shap_results,
                "status": "interpreted"
            })
        
        return to_json_safe({
            "status": "success",
            "shap": shap_results
        })
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        print(f"DS Interpret Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ds/agent/chat")
async def ds_agent_chat(request: DSAgentChatRequest):
    try:
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail="Dataset non trouve")
        
        df = datasets_store[request.dataset_id]["df"]
        filename = datasets_store[request.dataset_id].get("filename", "Inconnu")
        
        context = {
            "columns": list(df.columns),
            "target": request.target_column,
            "filename": filename
        }
        
        result = await llm_analyzer.chat_with_ds_agent(request.prompt, context)
        return to_json_safe({
            "status": "success",
            **result
        })
    except Exception as e:
        import traceback
        print(f"DS Agent Chat Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


class DSProjectCreateRequest(BaseModel):
    user_id: int
    dataset_id: Optional[int] = None
    project_name: str
    target_column: Optional[str] = None
    problem_type: Optional[str] = None

@app.post("/api/ds/projects")
async def create_ds_project(request: DSProjectCreateRequest):
    try:
        payload = {
            "user_id": request.user_id,
            "project_name": request.project_name,
            "target_column": request.target_column,
            "problem_type": request.problem_type,
            "status": "active"
        }
        
        if request.dataset_id:
            payload["dataset_id"] = request.dataset_id
        
        res = supabase.table("ds_projects").insert(payload).execute()
        if hasattr(res, 'data') and len(res.data) > 0:
            return {"status": "success", "project": res.data[0]}
        return {"status": "error", "message": "Failed to create project"}
    except Exception as e:
        print(f"Error creating DS project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# EDA endpoint
@app.get("/api/eda/{dataset_id}")
async def get_eda(dataset_id: str):
    if dataset_id not in datasets_store:
        raise HTTPException(status_code=404, detail="Dataset non trouve")
    
    df = datasets_store[dataset_id]["df"]
    
    # Basic statistics
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    
    stats = {
        "shape": {"rows": len(df), "columns": len(df.columns)},
        "missing_values": df.isnull().sum().to_dict(),
        "missing_percentage": (df.isnull().sum() / len(df) * 100).round(2).to_dict(),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "numeric_columns": numeric_cols,
        "categorical_columns": categorical_cols
    }
    
    # Numeric statistics
    if numeric_cols:
        stats["numeric_stats"] = df[numeric_cols].describe().to_dict()
        stats["correlations"] = df[numeric_cols].corr().round(3).to_dict()
    
    # Categorical statistics
    if categorical_cols:
        stats["categorical_stats"] = {}
        for col in categorical_cols[:10]:  # Limit to 10 columns
            value_counts = df[col].value_counts().head(20).to_dict()
            stats["categorical_stats"][col] = {
                "unique_values": int(df[col].nunique()),
                "top_values": value_counts
            }
    
    return to_json_safe(stats)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.post("/api/fairness/calculate-enhanced")
async def calculate_fairness_enhanced(request: FairnessRequest, background_tasks: BackgroundTasks):
    print(f"📥 Received enhanced fairness request for Dataset {request.dataset_id}")
    
    try:
        df, _ = load_dataset(request.dataset_id)
        
        # Check simple validity
        if request.target_column not in df.columns:
             raise HTTPException(status_code=400, detail=f"Target '{request.target_column}' not found")
        
        # We use model_id as audit_id passed from frontend
        audit_id = request.model_id
        if not audit_id:
            raise HTTPException(status_code=400, detail="audit_id (passed in model_id) is required for async processing")

        # Launch Background Task
        background_tasks.add_task(process_fairness_analysis_background, audit_id, request, df)
        
        return {"status": "processing", "message": "Optimized analysis started in background."}
    except Exception as e:
        print(f"Error in starting enhanced calculation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def calculate_metrics_internal(request: FairnessRequest):
    """Internal function to calculate metrics without HTTP wrapper"""
    # Logic extracted from existing /api/fairness/calculate
    # For now, we'll just call the existing logic or refactor
    # (In a real refactor, we would move logic to ds_engine.py)
    
    # ... (Reuse logic from existing endpoint)
# Supabase Client
from supabase import create_client, Client

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY") # Use Service Key for backend updates
supabase: Client = create_client(url, key)

async def process_fairness_analysis_background(audit_id: str, request: FairnessRequest, df: pd.DataFrame):
    print(f"🚀 [Background] Starting analysis for Audit {audit_id}...")
    try:
        # Use existing helper function for metrics
        print(f"🧮 [Background] Columns in DF: {df.columns.tolist()}")
        print(f"🧮 [Background] Sensitive Attributes: {request.sensitive_attributes}")
        
        metrics_result = _calculate_metrics_for_df(
            df, request.target_column, request.sensitive_attributes, request.favorable_outcome
        )
        
        # 2. Serialize metrics to dicts for LLM and Supabase
        serialized_metrics = {}
        for attr, metrics in metrics_result["metrics_by_attribute"].items():
            serialized_metrics[attr] = [m.dict() if hasattr(m, "dict") else m for m in metrics]
        
        print(f"📊 [Background] Generated metrics for {len(serialized_metrics)} attributes")
        for attr, ms in serialized_metrics.items():
            print(f"   - {attr}: {len(ms)} metrics")

        if request.enable_llm and llm_analyzer:
            # Prepare context for LLM
            context = {
                "ia_type": request.ia_type,
                "model_type": request.model_type,
                "target_column": request.target_column
            }

            # 3. Parallel LLM calls
            import asyncio
            
            task_interpretations = llm_analyzer.interpret_metrics(serialized_metrics, context)
            task_recommendations = llm_analyzer.generate_recommendations(serialized_metrics, context)
            task_summary = llm_analyzer.generate_executive_summary(
                metrics_result["overall_score"],
                metrics_result.get("risk_level", "eleve"),
                metrics_result["bias_detected"],
                sum(1 for m in [m for attrs in serialized_metrics.values() for m in attrs] if m['status'] == 'fail'),
                context
            )

            # Run all three concurrently
            interpretations, recommendations, executive_summary = await asyncio.gather(
                task_interpretations,
                task_recommendations,
                task_summary
            )

            # 4. Enrich result
            metrics_result["llm_insights"] = {
                "interpretations": interpretations,
                "recommendations": recommendations,
                "executive_summary": executive_summary
            }
            
            # Override basic recommendations with LLM ones
            metrics_result["recommendations"] = recommendations

        # 5. Update Supabase
        print(f"💾 [Background] Saving results to Supabase for Audit {audit_id}...")
        
        # Format recommendations for DB
        recommendations_db = (metrics_result.get("recommendations") or []).copy()
        # Ensure they are in the expected format if needed, but JSONB handles it.

        # Calculate critical bias count
        critical_bias_count = 0
        for metrics in serialized_metrics.values():
            critical_bias_count += sum(1 for m in metrics if m.get('status') == 'fail')

        update_payload = {
            "status": "completed",
            "overall_score": int(metrics_result["overall_score"]),
            "risk_level": "Low" if metrics_result.get("risk_level") == "faible" else "Medium" if metrics_result.get("risk_level") == "moyen" else "High",
            "bias_detected": metrics_result["bias_detected"],
            "critical_bias_count": critical_bias_count,
            "metrics_results": serialized_metrics,
            "recommendations": recommendations_db,
            "completed_at": datetime.now().isoformat()
        }
        
        if "llm_insights" in metrics_result:
            update_payload["llm_insights"] = metrics_result["llm_insights"]

        data, count = supabase.table("audits").update(update_payload).eq("id", audit_id).execute()
        print(f"✅ [Background] Audit {audit_id} completed successfully.")

    except Exception as e:
        print(f"❌ [Background] Error processing audit {audit_id}: {e}")
        # Update status to failed
        try:
            supabase.table("audits").update({
                "status": "failed",
                "error_message": str(e)
            }).eq("id", audit_id).execute()
        except Exception as update_err:
            print(f"❌ Critical error: Could not update status for failed audit {audit_id}: {update_err}")

# End of file


