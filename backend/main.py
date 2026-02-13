from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
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

# DS Engine import
from ds_engine import SeniorDataScientistEngine

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

load_dotenv()

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
    dataset_id: str
    model_id: Optional[str] = None
    target_column: str
    prediction_column: Optional[str] = None
    sensitive_attributes: List[str]
    favorable_outcome: Any = 1
    metrics: Optional[List[str]] = None

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
    target_column: Optional[str] = None
    n_components: int = 2

class DSFeatureEngRequest(BaseModel):
    dataset_id: str
    target_column: Optional[str] = None
    date_column: Optional[str] = None
    lags: List[int] = [1, 3, 7]
    windows: List[int] = [3, 7]

class DSModelingRequest(BaseModel):
    dataset_id: str
    target_column: str
    algorithm: str = "logistic_regression"  # "logistic_regression", "xgboost", "random_forest"
    test_size: float = 0.2
    feature_columns: Optional[List[str]] = None

class DSInterpretRequest(BaseModel):
    model_id: str
    dataset_id: str

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Dataset upload endpoint
@app.post("/api/datasets/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    dataset_name: str = Form(None)
):
    try:
        # Read file content
        content = await file.read()
        
        # Determine file type and parse
        filename = file.filename.lower()
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Format de fichier non supporte. Utilisez CSV ou Excel.")
        
        # Generate dataset ID
        dataset_id = str(uuid.uuid4())
        
        # Store dataset
        datasets_store[dataset_id] = {
            "df": df,
            "filename": file.filename,
            "name": dataset_name or file.filename,
            "uploaded_at": datetime.now().isoformat(),
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": df.columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "missing_values": df.isnull().sum().to_dict()
        }
        
        return {
            "dataset_id": dataset_id,
            "filename": file.filename,
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": df.columns.tolist(),
            "preview": df.head(10).to_dict(orient="records")
        }
    except Exception as e:
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

# Fairness calculation endpoint
@app.post("/api/fairness/calculate", response_model=FairnessResponse)
async def calculate_fairness(request: FairnessRequest):
    try:
        # Get dataset
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail="Dataset non trouve")
        
        df = datasets_store[request.dataset_id]["df"].copy()
        
        # Validate columns
        if request.target_column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Colonne cible '{request.target_column}' non trouvee")
        
        for attr in request.sensitive_attributes:
            if attr not in df.columns:
                raise HTTPException(status_code=400, detail=f"Attribut sensible '{attr}' non trouve")
        
        # Get predictions (from model or from prediction column)
        if request.prediction_column and request.prediction_column in df.columns:
            predictions = df[request.prediction_column]
        elif request.model_id and request.model_id in models_store:
            model_data = models_store[request.model_id]
            model = model_data["model"]
            scaler = model_data["scaler"]
            feature_cols = model_data["feature_columns"]
            
            # Prepare features for prediction
            X = df[feature_cols].copy()
            for col in feature_cols:
                if X[col].dtype == 'object':
                    le = model_data["label_encoders"].get(col)
                    if le:
                        X[col] = X[col].fillna('Unknown')
                        X[col] = X[col].apply(lambda x: le.transform([str(x)])[0] if str(x) in le.classes_ else 0)
                else:
                    X[col] = X[col].fillna(X[col].median())
            
            X = scaler.transform(X.values)
            predictions = model.predict(X)
        else:
            # Use target column as predictions for basic analysis
            predictions = df[request.target_column]
        
        actual = df[request.target_column]
        
        # Calculate fairness metrics for each sensitive attribute
        metrics_by_attribute = {}
        all_scores = []
        all_recommendations = []
        
        for attr in request.sensitive_attributes:
            attr_metrics = []
            groups = df[attr].unique()
            
            if len(groups) < 2:
                continue
            
            # Calculate metrics for each pair of groups
            group_stats = {}
            for group in groups:
                mask = df[attr] == group
                group_preds = predictions[mask]
                group_actual = actual[mask]
                
                # Positive rate (predictions)
                positive_rate = (group_preds == request.favorable_outcome).mean() if len(group_preds) > 0 else 0
                
                # True positive rate (actual positives correctly predicted)
                actual_positive_mask = group_actual == request.favorable_outcome
                if actual_positive_mask.sum() > 0:
                    tpr = ((group_preds == request.favorable_outcome) & actual_positive_mask).sum() / actual_positive_mask.sum()
                else:
                    tpr = 0
                
                # False positive rate
                actual_negative_mask = group_actual != request.favorable_outcome
                if actual_negative_mask.sum() > 0:
                    fpr = ((group_preds == request.favorable_outcome) & actual_negative_mask).sum() / actual_negative_mask.sum()
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
                
                # 4. Equalized Odds Difference (average of TPR and FPR differences)
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
                
                # 5. Predictive Parity (simplified)
                pp_diff = abs(stats["positive_rate"] - ref_stats["positive_rate"])
                pp_status = "pass" if pp_diff < 0.1 else ("warning" if pp_diff < 0.2 else "fail")
                attr_metrics.append(FairnessMetric(
                    name="Parite Predictive",
                    value=round(pp_diff, 4),
                    description=f"Difference de precision positive entre {group} et {ref_group}",
                    threshold=0.1,
                    status=pp_status
                ))
                all_scores.append(1 - min(pp_diff, 1))
                
                # 6. Treatment Equality
                if stats["tpr"] > 0 and ref_stats["tpr"] > 0:
                    te_ratio = (stats["fpr"] / stats["tpr"]) / (ref_stats["fpr"] / ref_stats["tpr"]) if ref_stats["fpr"] > 0 and ref_stats["tpr"] > 0 else 1
                else:
                    te_ratio = 1.0
                te_status = "pass" if 0.8 <= te_ratio <= 1.25 else ("warning" if 0.6 <= te_ratio <= 1.5 else "fail")
                attr_metrics.append(FairnessMetric(
                    name="Egalite de Traitement",
                    value=round(te_ratio, 4),
                    description=f"Ratio FP/TP entre {group} et {ref_group}",
                    threshold=0.8,
                    status=te_status
                ))
                all_scores.append(min(te_ratio, 1/te_ratio) if te_ratio > 0 else 0)
                
                # Generate recommendations
                if spd_status == "fail":
                    all_recommendations.append(f"Reequilibrer les taux de selection pour l'attribut '{attr}' (groupe {group})")
                if di_status == "fail":
                    all_recommendations.append(f"Appliquer une correction d'impact disparate pour '{attr}'")
                if eod_status == "fail":
                    all_recommendations.append(f"Ameliorer l'egalite des chances pour '{attr}' via reechantillonnage")
            
            metrics_by_attribute[attr] = attr_metrics
        
        # Calculate overall score
        overall_score = np.mean(all_scores) * 100 if all_scores else 100
        
        # Determine risk level
        if overall_score >= 80:
            risk_level = "faible"
        elif overall_score >= 60:
            risk_level = "moyen"
        else:
            risk_level = "eleve"
        
        # Determine if bias detected
        bias_detected = any(
            m.status == "fail" 
            for metrics in metrics_by_attribute.values() 
            for m in metrics
        )
        
        # Default recommendations if none generated
        if not all_recommendations:
            if risk_level == "faible":
                all_recommendations = ["Continuer a surveiller les metriques de fairness regulierement"]
            else:
                all_recommendations = [
                    "Analyser les donnees d'entrainement pour detecter les desequilibres",
                    "Envisager l'utilisation de techniques de reechantillonnage",
                    "Appliquer des contraintes de fairness lors de l'entrainement"
                ]
        
        audit_id = str(uuid.uuid4())
        
        return FairnessResponse(
            audit_id=audit_id,
            overall_score=round(overall_score, 2),
            risk_level=risk_level,
            bias_detected=bias_detected,
            metrics_by_attribute=metrics_by_attribute,
            recommendations=list(set(all_recommendations))[:5]
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
        raise HTTPException(status_code=500, detail=f"Erreur de generation de rapport: {str(e)}")

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
        
        return {
            "status": "success",
            "detailed_stats": detailed_stats,
            "recommendations": recommendations,
            "quality_score": quality_score
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        print(f"DS Analyze Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

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
        
        return {
            "status": "success",
            "target_distributions": target_dist,
            "dimensionality_reduction": dim_reduction
        }
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
        
        return {
            "status": "success",
            "new_features": new_features,
            "preview": df.head(10).to_dict(orient="records")
        }
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
        from main import train_model, TrainRequest
        
        train_req = TrainRequest(
            dataset_id=request.dataset_id,
            target_column=request.target_column,
            algorithm=request.algorithm,
            test_size=request.test_size,
            feature_columns=request.feature_columns
        )
        
        return await train_model(train_req)
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
        if model_data.get("feature_names"):
            # Only use columns that exist in both
            common_cols = [c for c in model_data["feature_names"] if c in X.columns]
            X = X[common_cols]
        
        shap_results = SeniorDataScientistEngine.get_shap_interpretation(model_data["model"], X)
        
        return {
            "status": "success",
            "shap": shap_results
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        print(f"DS Interpret Error: {str(e)}")
        print(traceback.format_exc())
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
    
    return stats

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
