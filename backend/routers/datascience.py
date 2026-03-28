"""
Data Science endpoints: intelligence, EDA, feature engineering, modeling, interpretation, chat agent.
"""

import numpy as np
from typing import Dict, Any
from fastapi import APIRouter, HTTPException

from config import logger
from schemas import (
    DSAnalyzeRequest, DSEdaRequest, DSAgentChatRequest,
    DSFeatureEngRequest, DSModelingRequest, DSIntelligenceRequest,
    DSInterpretRequest, DSProjectCreateRequest, TrainRequest,
)
from utils import to_json_safe, datasets_store, models_store
from ds_engine import SeniorDataScientistEngine

# Supabase client for project persistence
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

router = APIRouter(prefix="/api", tags=["Data Science"])

# LLM analyzer (set by main app)
llm_analyzer = None


def set_llm_analyzer(analyzer):
    global llm_analyzer
    llm_analyzer = analyzer


async def _update_ds_project(project_id: str, update_data: Dict[str, Any]):
    """Helper to update a Data Science project in Supabase."""
    try:
        if not project_id or project_id == "undefined":
            return
        supabase.table("ds_projects").update(update_data).eq("id", project_id).execute()
        logger.info(f"Updated DS Project {project_id}")
    except Exception as e:
        logger.warning(f"Failed to update DS Project {project_id}: {e}")


@router.post("/ds/analyze")
async def ds_analyze(request: DSAnalyzeRequest):
    """Analyze dataset with detailed statistics and recommendations."""
    try:
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail=f"Dataset '{request.dataset_id}' non trouve")

        df = datasets_store[request.dataset_id]["df"]

        detailed_stats = SeniorDataScientistEngine.get_detailed_stats(df)
        recommendations = SeniorDataScientistEngine.get_expert_recommendations(df, request.target_column)
        quality_score = SeniorDataScientistEngine.get_quality_score(df)

        return to_json_safe({
            "status": "success",
            "detailed_stats": detailed_stats,
            "recommendations": recommendations,
            "quality_score": quality_score,
        })

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DS Analyze error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ds/intelligence")
async def ds_intelligence(request: DSIntelligenceRequest):
    """AI-powered dataset intelligence: semantic analysis with LLM."""
    try:
        if request.dataset_id not in datasets_store:
            from utils import load_dataset
            try:
                load_dataset(request.dataset_id)
            except Exception:
                raise HTTPException(status_code=404, detail="Dataset non trouve")

        df = datasets_store[request.dataset_id]["df"]

        if llm_analyzer is None:
            raise HTTPException(status_code=500, detail="LLM analyzer non disponible")

        preview = df.head(5).to_dict(orient="records")
        columns_info = datasets_store[request.dataset_id].get("columns_info", [])

        if not columns_info:
            for col in df.columns:
                columns_info.append({"name": col, "type": str(df[col].dtype)})

        intelligence = await llm_analyzer.analyze_dataset_semantics(preview, columns_info)

        detailed_stats = SeniorDataScientistEngine.get_detailed_stats(df)
        quality_score = SeniorDataScientistEngine.get_quality_score(df)

        if request.project_id:
            await _update_ds_project(request.project_id, {"intelligence_suggestions": intelligence})

        return to_json_safe({
            "status": "success",
            "intelligence": intelligence,
            "preview": preview,
            "detailed_stats": detailed_stats,
            "quality_score": quality_score,
        })

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DS Intelligence error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ds/eda")
async def ds_eda(request: DSEdaRequest):
    """Exploratory Data Analysis with expert insights."""
    try:
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail=f"Dataset '{request.dataset_id}' non trouve")

        df = datasets_store[request.dataset_id]["df"]

        target_dist = None
        if request.target_column:
            target_dist = SeniorDataScientistEngine.get_target_distributions(df, request.target_column)

        dim_reduction = SeniorDataScientistEngine.get_dimensionality_reduction(df, request.n_components)
        correlations = SeniorDataScientistEngine.get_correlation_matrix(df)
        outliers = SeniorDataScientistEngine.get_outlier_analysis(df)
        detailed_stats = SeniorDataScientistEngine.get_detailed_stats(df)

        expert_insights = None
        if llm_analyzer:
            expert_insights = await llm_analyzer.generate_expert_eda_insights(
                detailed_stats,
                request.target_column,
                {"filename": datasets_store[request.dataset_id].get("filename", "Inconnu")},
            )

        results = {
            "target_distributions": target_dist,
            "dimensionality_reduction": dim_reduction,
            "correlations": correlations,
            "outliers": outliers,
            "expert_insights": expert_insights,
        }

        if request.project_id:
            await _update_ds_project(request.project_id, {
                "eda_results": results,
                "target_column": request.target_column,
                "status": "eda_completed",
            })

        return to_json_safe({"status": "success", **results})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DS EDA error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ds/feature-engineering")
async def ds_feature_engineering(request: DSFeatureEngRequest):
    """Feature engineering with time series support."""
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

        datasets_store[request.dataset_id]["df"] = df

        if request.project_id:
            await _update_ds_project(request.project_id, {
                "problem_type": "Time Series" if request.date_column else "General"
            })

        return to_json_safe({
            "status": "success",
            "new_features": new_features,
            "preview": df.head(10).to_dict(orient="records"),
        })

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DS Feature Engineering error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ds/modeling")
async def ds_modeling(request: DSModelingRequest):
    """Train a model using the data science pipeline."""
    try:
        from routers.ml import train_model

        train_req = TrainRequest(
            dataset_id=request.dataset_id,
            target_column=request.target_column,
            algorithm=request.algorithm,
            test_size=request.test_size,
            feature_columns=request.feature_columns,
        )

        results = await train_model(train_req)

        if request.project_id:
            await _update_ds_project(request.project_id, {
                "modeling_results": results.dict() if hasattr(results, "dict") else results,
                "status": "modeled",
            })

        safe_results = results.dict() if hasattr(results, "dict") else results
        return to_json_safe(safe_results)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DS Modeling error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ds/interpret")
async def ds_interpret(request: DSInterpretRequest):
    """Interpret model with SHAP values."""
    try:
        if request.model_id not in models_store:
            raise HTTPException(status_code=404, detail="Modele non trouve")
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail="Dataset non trouve")

        model_data = models_store[request.model_id]
        df = datasets_store[request.dataset_id]["df"]

        X = df.select_dtypes(include=[np.number])
        if model_data.get("feature_columns"):
            feature_cols = [c for c in model_data["feature_columns"] if c in X.columns]
            X = X[feature_cols]

        shap_results = SeniorDataScientistEngine.get_shap_interpretation(model_data["model"], X)

        if request.project_id:
            await _update_ds_project(request.project_id, {
                "interpretability_results": shap_results,
                "status": "interpreted",
            })

        return to_json_safe({"status": "success", "shap": shap_results})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DS Interpret error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ds/agent/chat")
async def ds_agent_chat(request: DSAgentChatRequest):
    """Chat with the AI Data Science agent."""
    try:
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail="Dataset non trouve")

        df = datasets_store[request.dataset_id]["df"]
        filename = datasets_store[request.dataset_id].get("filename", "Inconnu")

        context = {
            "columns": list(df.columns),
            "target": request.target_column,
            "filename": filename,
        }

        if llm_analyzer is None:
            raise HTTPException(status_code=500, detail="LLM analyzer non disponible")

        result = await llm_analyzer.chat_with_ds_agent(request.prompt, context)
        return to_json_safe({"status": "success", **result})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DS Agent Chat error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ds/projects")
async def create_ds_project(request: DSProjectCreateRequest):
    """Create a new Data Science project."""
    try:
        payload = {
            "user_id": request.user_id,
            "project_name": request.project_name,
            "target_column": request.target_column,
            "problem_type": request.problem_type,
            "status": "active",
        }

        if request.dataset_id:
            payload["dataset_id"] = request.dataset_id

        res = supabase.table("ds_projects").insert(payload).execute()
        if hasattr(res, "data") and len(res.data) > 0:
            return {"status": "success", "project": res.data[0]}
        return {"status": "error", "message": "Failed to create project"}

    except Exception as e:
        logger.error(f"Error creating DS project: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
