"""
Pydantic v2 schemas for AuditIQ API request/response validation.
"""

from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Dict, Any


# --- Dataset ---
class DatasetUploadResponse(BaseModel):
    dataset_id: str
    filename: str
    rows: int
    columns: int
    columns_info: List[Dict[str, str]]
    stats: Dict[str, int]
    profiling: Dict[str, Any]
    quality_score: float = Field(ge=0, le=100)


# --- ML Training ---
class TrainRequest(BaseModel):
    dataset_id: str
    target_column: str
    algorithm: str = Field(default="logistic_regression", pattern="^(logistic_regression|xgboost|random_forest)$")
    test_size: float = Field(default=0.2, ge=0.05, le=0.5)
    feature_columns: Optional[List[str]] = None

    @model_validator(mode="after")
    def validate_feature_columns(self):
        if self.feature_columns is not None:
            self.feature_columns = [c for c in self.feature_columns if c != self.target_column]
        return self


class TrainResponse(BaseModel):
    model_id: str
    algorithm: str
    metrics: Dict[str, float]
    feature_importance: Optional[Dict[str, float]] = None
    training_time: float


# --- Fairness ---
class FairnessRequest(BaseModel):
    dataset_id: Any
    dataset_id_post: Optional[Any] = None
    model_id: Optional[Any] = None
    target_column: str
    prediction_column: Optional[str] = None
    sensitive_attributes: List[str] = Field(min_length=1)
    favorable_outcome: Any = 1
    metrics: Optional[List[str]] = None
    model_type: Optional[str] = None
    ia_type: Optional[str] = None
    enable_llm: bool = True


class FairnessMetric(BaseModel):
    name: str
    value: float
    description: str
    threshold: float
    status: str = Field(pattern="^(pass|warning|fail)$")


class FairnessResponse(BaseModel):
    audit_id: str
    overall_score: float = Field(ge=0, le=100)
    risk_level: str
    bias_detected: bool
    metrics_by_attribute: Dict[str, List[FairnessMetric]]
    recommendations: List[str]
    comparison_results: Optional[Dict[str, Any]] = None


# --- Reports ---
class ReportRequest(BaseModel):
    audit_id: str
    dataset_name: str
    fairness_results: Dict[str, Any]
    model_metrics: Optional[Dict[str, float]] = None
    format: str = Field(default="pdf", pattern="^(pdf|txt)$")


# --- Data Science ---
class DSAnalyzeRequest(BaseModel):
    dataset_id: str
    target_column: Optional[str] = None


class DSEdaRequest(BaseModel):
    dataset_id: str
    project_id: Optional[str] = None
    target_column: Optional[str] = None
    n_components: int = Field(default=2, ge=2, le=10)


class DSAgentChatRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=2000)
    dataset_id: str
    target_column: Optional[str] = None
    n_components: int = Field(default=2, ge=2, le=10)


class DSFeatureEngRequest(BaseModel):
    dataset_id: str
    project_id: Optional[str] = None
    target_column: Optional[str] = None
    date_column: Optional[str] = None
    lags: List[int] = Field(default=[1, 3, 7])
    windows: List[int] = Field(default=[3, 7])


class DSModelingRequest(BaseModel):
    dataset_id: str
    project_id: Optional[str] = None
    target_column: str
    algorithm: str = Field(default="logistic_regression", pattern="^(logistic_regression|xgboost|random_forest)$")
    test_size: float = Field(default=0.2, ge=0.05, le=0.5)
    feature_columns: Optional[List[str]] = None


class DSIntelligenceRequest(BaseModel):
    dataset_id: str
    project_id: Optional[str] = None


class DSInterpretRequest(BaseModel):
    model_id: str
    dataset_id: str
    project_id: Optional[str] = None


class DSProjectCreateRequest(BaseModel):
    user_id: int
    dataset_id: Optional[int] = None
    project_name: str = Field(min_length=1, max_length=200)
    target_column: Optional[str] = None
    problem_type: Optional[str] = None


class DataBiasRequest(BaseModel):
    dataset_id: Optional[str] = None
    target_column: Optional[str] = None
    sensitive_attributes: Any = []
    favorable_outcome: Any = 1
