"""
Fairness calculation and bias analysis endpoints.
"""

import uuid
import json
import asyncio
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any

from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from sklearn.preprocessing import LabelEncoder

from config import (
    logger, SUPABASE_URL, SUPABASE_SERVICE_KEY,
    FAIRNESS_SPD_THRESHOLD, FAIRNESS_DI_LOW, FAIRNESS_DI_HIGH,
    FAIRNESS_EOD_THRESHOLD, FAIRNESS_EO_THRESHOLD,
    FAIRNESS_RISK_HIGH, FAIRNESS_RISK_MEDIUM,
)
from schemas import FairnessRequest, FairnessMetric, FairnessResponse
from utils import to_json_safe, datasets_store, load_dataset

# Supabase client for background task updates
from supabase import create_client, Client

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

router = APIRouter(prefix="/api", tags=["Fairness"])

# LLM analyzer (set by main app)
llm_analyzer = None


def set_llm_analyzer(analyzer):
    global llm_analyzer
    llm_analyzer = analyzer


def _calculate_metrics_for_df(df, target_column, sensitive_attributes, favorable_outcome=1, predictions=None):
    """Helper to calculate fairness metrics for a dataframe."""
    if predictions is None:
        predictions = df[target_column]

    actual = df[target_column]
    metrics_by_attribute = {}
    all_scores = []

    for attr in sensitive_attributes:
        if attr not in df.columns:
            logger.warning(f"Attribute {attr} not found in columns: {df.columns.tolist()}")
            continue

        attr_metrics = []
        groups = [g for g in df[attr].unique() if pd.notna(g)]

        if len(groups) < 2:
            logger.warning(f"Not enough groups for {attr} (needed 2+, found {len(groups)})")
            continue

        # Calculate per-group statistics
        group_stats = {}
        for group in groups:
            mask = df[attr] == group
            group_preds = predictions[mask].astype(str)
            group_actual = actual[mask].astype(str)
            fav_str = str(favorable_outcome)

            matches = group_preds == fav_str
            positive_rate = matches.mean() if len(group_preds) > 0 else 0

            actual_positive_mask = group_actual == fav_str
            tpr = (
                ((group_preds == fav_str) & actual_positive_mask).sum() / actual_positive_mask.sum()
                if actual_positive_mask.sum() > 0
                else 0
            )

            actual_negative_mask = group_actual != fav_str
            fpr = (
                ((group_preds == fav_str) & actual_negative_mask).sum() / actual_negative_mask.sum()
                if actual_negative_mask.sum() > 0
                else 0
            )

            group_stats[group] = {
                "positive_rate": float(positive_rate),
                "tpr": float(tpr),
                "fpr": float(fpr),
                "count": int(mask.sum()),
            }

        ref_group = max(group_stats.keys(), key=lambda g: group_stats[g]["count"])
        ref_stats = group_stats[ref_group]

        for group, stats in group_stats.items():
            if group == ref_group:
                continue

            # 1. Statistical Parity Difference
            spd = stats["positive_rate"] - ref_stats["positive_rate"]
            spd_status = "pass" if abs(spd) < FAIRNESS_SPD_THRESHOLD else ("warning" if abs(spd) < 0.2 else "fail")
            attr_metrics.append(
                FairnessMetric(
                    name="Parite Statistique (SPD)",
                    value=round(spd, 4),
                    description=f"Difference de taux de selection entre {group} et {ref_group}",
                    threshold=FAIRNESS_SPD_THRESHOLD,
                    status=spd_status,
                )
            )
            all_scores.append(1 - min(abs(spd), 1))

            # 2. Disparate Impact Ratio
            di = stats["positive_rate"] / ref_stats["positive_rate"] if ref_stats["positive_rate"] > 0 else 1.0
            di_status = "pass" if FAIRNESS_DI_LOW <= di <= FAIRNESS_DI_HIGH else ("warning" if 0.6 <= di <= 1.5 else "fail")
            attr_metrics.append(
                FairnessMetric(
                    name="Impact Disparate (DI)",
                    value=round(di, 4),
                    description=f"Ratio de selection entre {group} et {ref_group}",
                    threshold=FAIRNESS_DI_LOW,
                    status=di_status,
                )
            )
            all_scores.append(min(di, 1 / di) if di > 0 else 0)

            # 3. Equal Opportunity Difference
            eod = stats["tpr"] - ref_stats["tpr"]
            eod_status = "pass" if abs(eod) < FAIRNESS_EOD_THRESHOLD else ("warning" if abs(eod) < 0.2 else "fail")
            attr_metrics.append(
                FairnessMetric(
                    name="Egalite des Chances (EOD)",
                    value=round(eod, 4),
                    description=f"Difference de taux de vrais positifs entre {group} et {ref_group}",
                    threshold=FAIRNESS_EOD_THRESHOLD,
                    status=eod_status,
                )
            )
            all_scores.append(1 - min(abs(eod), 1))

            # 4. Equalized Odds Difference
            fpr_diff = stats["fpr"] - ref_stats["fpr"]
            avg_odds = (abs(eod) + abs(fpr_diff)) / 2
            eo_status = "pass" if avg_odds < FAIRNESS_EO_THRESHOLD else ("warning" if avg_odds < 0.2 else "fail")
            attr_metrics.append(
                FairnessMetric(
                    name="Odds Egalises (EO)",
                    value=round(avg_odds, 4),
                    description=f"Moyenne des differences TPR et FPR entre {group} et {ref_group}",
                    threshold=FAIRNESS_EO_THRESHOLD,
                    status=eo_status,
                )
            )
            all_scores.append(1 - min(avg_odds, 1))

        metrics_by_attribute[attr] = attr_metrics

    overall_score = np.mean(all_scores) * 100 if all_scores else 100

    if overall_score >= FAIRNESS_RISK_MEDIUM:
        risk_level = "faible"
    elif overall_score >= FAIRNESS_RISK_HIGH:
        risk_level = "moyen"
    else:
        risk_level = "eleve"

    return {
        "overall_score": round(overall_score, 2),
        "risk_level": risk_level,
        "metrics_by_attribute": metrics_by_attribute,
        "bias_detected": any(m.status == "fail" for attr in metrics_by_attribute.values() for m in attr),
    }


@router.post("/fairness/calculate", response_model=FairnessResponse)
async def calculate_fairness(request: FairnessRequest):
    """Calculate fairness metrics for a dataset."""
    try:
        if request.dataset_id not in datasets_store:
            raise HTTPException(status_code=404, detail="Dataset original non trouve")

        df_pre = datasets_store[request.dataset_id]["df"].copy()
        results_pre = _calculate_metrics_for_df(
            df_pre, request.target_column, request.sensitive_attributes, request.favorable_outcome
        )

        results_post = None
        if request.dataset_id_post and request.dataset_id_post in datasets_store:
            df_post = datasets_store[request.dataset_id_post]["df"].copy()
            results_post = _calculate_metrics_for_df(
                df_post, request.target_column, request.sensitive_attributes, request.favorable_outcome
            )

        main_results = results_post if results_post else results_pre

        comparison_results = None
        if results_post:
            comparison_results = {
                "pre": results_pre["metrics_by_attribute"],
                "post": results_post["metrics_by_attribute"],
                "improvement": round(results_post["overall_score"] - results_pre["overall_score"], 2),
            }

        risk_level = main_results.get("risk_level", "eleve")
        overall_score = main_results["overall_score"]

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
                    "Appliquer des contraintes de fairness lors de l'entrainement",
                ]

        return FairnessResponse(
            audit_id=str(uuid.uuid4()),
            overall_score=overall_score,
            risk_level="Low" if risk_level == "faible" else "Medium" if risk_level == "moyen" else "High",
            bias_detected=main_results["bias_detected"],
            metrics_by_attribute=main_results["metrics_by_attribute"],
            recommendations=list(set(all_recommendations))[:5],
            comparison_results=comparison_results,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Fairness calculation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erreur de calcul de fairness: {str(e)}")


@router.post("/fairness/calculate-enhanced")
async def calculate_fairness_enhanced(request: FairnessRequest, background_tasks: BackgroundTasks):
    """Enhanced fairness calculation with LLM insights (background processing)."""
    logger.info(f"Enhanced fairness request for dataset {request.dataset_id}")

    try:
        df, _ = load_dataset(request.dataset_id)

        if request.target_column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Target '{request.target_column}' not found")

        audit_id = request.model_id
        if not audit_id:
            raise HTTPException(status_code=400, detail="audit_id (passed in model_id) is required")

        background_tasks.add_task(_process_fairness_background, audit_id, request, df)

        return {"status": "processing", "message": "Optimized analysis started in background."}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Enhanced fairness start error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/fairness/bias-analysis")
async def calculate_data_bias(raw_request: Request):
    """Analyze raw dataset for bias BEFORE model predictions."""
    try:
        request_data = await raw_request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    try:
        dataset_id = request_data.get("dataset_id")
        target_column = request_data.get("target_column")
        attrs = request_data.get("sensitive_attributes", [])
        favorable_outcome = request_data.get("favorable_outcome", 1)

        if not dataset_id:
            raise HTTPException(status_code=400, detail="dataset_id is required")

        # Robust parsing of sensitive_attributes
        if isinstance(attrs, str):
            try:
                attrs = json.loads(attrs)
            except (json.JSONDecodeError, ValueError):
                attrs = [a.strip() for a in attrs.split(",") if a.strip()]

        if not isinstance(attrs, list):
            attrs = []
        attrs = [str(a) for a in attrs]

        df, _ = load_dataset(dataset_id)

        results = {"demographics": {}, "success_rates": {}, "proxy_correlations": {}}

        # 1. Demographics & Success Rates
        for attr in attrs:
            if attr not in df.columns:
                continue

            counts = df[attr].value_counts().to_dict()
            total = len(df)
            results["demographics"][attr] = [
                {"name": str(k), "value": int(v), "percentage": round(v / total * 100, 2)}
                for k, v in counts.items()
            ]

            if target_column and target_column in df.columns:
                fav_val = str(favorable_outcome)
                group_rates = []
                for group in counts.keys():
                    group_df = df[df[attr] == group]
                    if len(group_df) > 0:
                        successes = (group_df[target_column].astype(str) == fav_val).sum()
                        rate = successes / len(group_df)
                        group_rates.append(
                            {"group": str(group), "rate": round(float(rate), 4), "count": int(len(group_df))}
                        )
                results["success_rates"][attr] = group_rates

        # 2. Proxy Correlation Analysis
        numeric_df = df.select_dtypes(include=[np.number])
        if not numeric_df.empty:
            for attr in attrs:
                if attr not in df.columns:
                    continue

                target_series = df[attr]
                if target_series.dtype == "object" or target_series.nunique() < 20:
                    le = LabelEncoder()
                    target_encoded = le.fit_transform(target_series.astype(str))
                else:
                    target_encoded = target_series

                corrs = []
                for col in numeric_df.columns:
                    if col == attr or col == target_column:
                        continue

                    col_data = numeric_df[col].fillna(numeric_df[col].median())
                    if col_data.std() == 0:
                        continue

                    correlation = np.corrcoef(target_encoded, col_data)[0, 1]
                    if abs(correlation) > 0.1:
                        corrs.append(
                            {
                                "feature": col,
                                "correlation": round(float(correlation), 4),
                                "abs_correlation": abs(float(correlation)),
                            }
                        )

                corrs.sort(key=lambda x: x["abs_correlation"], reverse=True)
                results["proxy_correlations"][attr] = corrs[:10]

        return results

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Bias analysis error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


async def _process_fairness_background(audit_id: str, request: FairnessRequest, df: pd.DataFrame):
    """Background task for enhanced fairness analysis with LLM."""
    logger.info(f"[Background] Starting analysis for Audit {audit_id}")

    try:
        metrics_result = _calculate_metrics_for_df(
            df, request.target_column, request.sensitive_attributes, request.favorable_outcome
        )

        serialized_metrics = {}
        for attr, metrics in metrics_result["metrics_by_attribute"].items():
            serialized_metrics[attr] = [m.dict() if hasattr(m, "dict") else m for m in metrics]

        logger.info(f"[Background] Generated metrics for {len(serialized_metrics)} attributes")

        if request.enable_llm and llm_analyzer:
            context = {
                "ia_type": request.ia_type,
                "model_type": request.model_type,
                "target_column": request.target_column,
            }

            task_interpretations = llm_analyzer.interpret_metrics(serialized_metrics, context)
            task_recommendations = llm_analyzer.generate_recommendations(serialized_metrics, context)
            task_summary = llm_analyzer.generate_executive_summary(
                metrics_result["overall_score"],
                metrics_result.get("risk_level", "eleve"),
                metrics_result["bias_detected"],
                sum(1 for m in [m for attrs in serialized_metrics.values() for m in attrs] if m["status"] == "fail"),
                context,
            )

            interpretations, recommendations, executive_summary = await asyncio.gather(
                task_interpretations, task_recommendations, task_summary
            )

            metrics_result["llm_insights"] = {
                "interpretations": interpretations,
                "recommendations": recommendations,
                "executive_summary": executive_summary,
            }
            metrics_result["recommendations"] = recommendations

        # Update Supabase
        critical_bias_count = sum(
            1 for metrics in serialized_metrics.values() for m in metrics if m.get("status") == "fail"
        )

        update_payload = {
            "status": "completed",
            "overall_score": int(metrics_result["overall_score"]),
            "risk_level": (
                "Low" if metrics_result.get("risk_level") == "faible"
                else "Medium" if metrics_result.get("risk_level") == "moyen"
                else "High"
            ),
            "bias_detected": metrics_result["bias_detected"],
            "critical_bias_count": critical_bias_count,
            "metrics_results": serialized_metrics,
            "recommendations": (metrics_result.get("recommendations") or []).copy(),
            "completed_at": datetime.now().isoformat(),
        }

        if "llm_insights" in metrics_result:
            update_payload["llm_insights"] = metrics_result["llm_insights"]

        supabase.table("audits").update(update_payload).eq("id", audit_id).execute()
        logger.info(f"[Background] Audit {audit_id} completed successfully")

    except Exception as e:
        logger.error(f"[Background] Error processing audit {audit_id}: {e}", exc_info=True)
        try:
            supabase.table("audits").update(
                {"status": "failed", "error_message": str(e)}
            ).eq("id", audit_id).execute()
        except Exception as update_err:
            logger.error(f"[Background] Could not update failed status for {audit_id}: {update_err}")
