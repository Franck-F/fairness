"""
Détection non supervisée de biais algorithmiques.

Approche : clustering des données pour identifier des sous-groupes recevant des
traitements significativement différents par le modèle, SANS nécessiter de label
démographique préalable. Inspiré de l'approche d'Algorithm Audit (Pays-Bas) reconnue
par l'OCDE dans son Catalogue of Tools for Trustworthy AI.

Cas d'usage : une PME a un modèle en production, ne peut pas (ou ne veut pas)
collecter d'attributs sensibles (origine ethnique, etc.) au titre de l'AI Act
art. 10(5), mais veut détecter d'éventuels traitements inéquitables.

Pipeline :
  1. KMeans sur les features numériques (après one-hot et standardisation)
  2. Calcul du taux de prédiction positive par cluster
  3. Test du Khi-deux sur la matrice cluster x prédiction
  4. Caractérisation des clusters "outliers" (écart > seuil) par features dominantes
  5. Renvoi d'un rapport interprétable sans expertise data science
"""

from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from scipy import stats
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

from config import logger
from utils import load_dataset

router = APIRouter(prefix="/api/unsupervised", tags=["Unsupervised Bias Detection"])


class UnsupervisedRequest(BaseModel):
    dataset_id: str = Field(..., description="Identifiant du dataset chargé")
    prediction_column: str = Field(..., description="Colonne contenant les prédictions du modèle")
    favorable_value: Any = Field(1, description="Valeur considérée comme positive (ex : 1 = embauche, accord)")
    feature_columns: Optional[List[str]] = Field(
        None, description="Colonnes à utiliser pour le clustering. Toutes si None."
    )
    n_clusters: int = Field(5, ge=2, le=12, description="Nombre de clusters à former")
    disparity_threshold: float = Field(
        0.10, ge=0.01, le=0.5,
        description="Seuil d'écart absolu de taux positif entre clusters pour signaler un biais",
    )


class ClusterFinding(BaseModel):
    cluster_id: int
    size: int
    positive_rate: float
    deviation_from_global: float
    risk_level: str  # "vert" | "orange" | "rouge"
    dominant_features: Dict[str, Any]
    interpretation: str


class UnsupervisedResponse(BaseModel):
    n_clusters: int
    n_samples: int
    global_positive_rate: float
    chi2_statistic: float
    chi2_p_value: float
    is_statistically_significant: bool
    overall_risk: str
    findings: List[ClusterFinding]
    natural_language_summary: str
    ai_act_relevance: str


def _prepare_features(df: pd.DataFrame, feature_cols: List[str]) -> np.ndarray:
    """One-hot pour catégorielles, standardisation pour numériques."""
    sub = df[feature_cols].copy()
    sub = pd.get_dummies(sub, drop_first=False)
    sub = sub.fillna(sub.median(numeric_only=True)).fillna(0)
    scaler = StandardScaler()
    return scaler.fit_transform(sub.values)


def _characterize_cluster(df: pd.DataFrame, mask: np.ndarray, feature_cols: List[str], top_k: int = 3) -> Dict[str, Any]:
    """Caractérise un cluster par les valeurs les plus distinctives de ses features."""
    cluster_df = df.loc[mask, feature_cols]
    rest_df = df.loc[~mask, feature_cols]
    distinctive: Dict[str, Any] = {}

    for col in feature_cols:
        col_series = cluster_df[col]
        rest_series = rest_df[col]

        if pd.api.types.is_numeric_dtype(col_series):
            cluster_mean = float(col_series.mean())
            rest_mean = float(rest_series.mean()) if len(rest_series) else cluster_mean
            distinctive[col] = {
                "type": "numeric",
                "cluster_mean": round(cluster_mean, 3),
                "rest_mean": round(rest_mean, 3),
            }
        else:
            top_value = col_series.mode().iloc[0] if not col_series.mode().empty else None
            cluster_freq = float((col_series == top_value).mean()) if top_value is not None else 0.0
            rest_freq = float((rest_series == top_value).mean()) if top_value is not None and len(rest_series) else 0.0
            distinctive[col] = {
                "type": "categorical",
                "dominant_value": str(top_value) if top_value is not None else None,
                "cluster_frequency": round(cluster_freq, 3),
                "rest_frequency": round(rest_freq, 3),
            }

    # On garde les features où l'écart est le plus grand
    def _gap(item):
        v = item[1]
        if v["type"] == "numeric":
            return abs(v["cluster_mean"] - v["rest_mean"])
        return abs(v["cluster_frequency"] - v["rest_frequency"])

    sorted_items = sorted(distinctive.items(), key=_gap, reverse=True)[:top_k]
    return dict(sorted_items)


def _risk_for_deviation(deviation: float, threshold: float) -> str:
    abs_dev = abs(deviation)
    if abs_dev >= threshold * 2:
        return "rouge"
    if abs_dev >= threshold:
        return "orange"
    return "vert"


def _build_interpretation(finding: ClusterFinding, global_rate: float) -> str:
    direction = "supérieur" if finding.deviation_from_global > 0 else "inférieur"
    pct = abs(finding.deviation_from_global) * 100
    feats = ", ".join(
        f"{k} ({'~' + str(v.get('cluster_mean')) if v['type'] == 'numeric' else v.get('dominant_value')})"
        for k, v in finding.dominant_features.items()
    )
    return (
        f"Le cluster {finding.cluster_id} ({finding.size} individus) reçoit un taux de décision "
        f"positive {direction} de {pct:.1f} points par rapport à la moyenne globale "
        f"({global_rate * 100:.1f} %). Ce sous-groupe se distingue principalement par : {feats}. "
        f"Niveau de risque : {finding.risk_level}."
    )


@router.post("/detect", response_model=UnsupervisedResponse)
async def detect_unsupervised_bias(req: UnsupervisedRequest) -> UnsupervisedResponse:
    """
    Détecte des biais de traitement sans nécessiter d'attributs sensibles labellisés.
    """
    try:
        df, _ = load_dataset(req.dataset_id)
    except Exception as exc:
        logger.error(f"Dataset {req.dataset_id} introuvable : {exc}")
        raise HTTPException(status_code=404, detail="Dataset introuvable")

    if df is None or len(df) == 0:
        raise HTTPException(status_code=404, detail="Dataset vide ou non chargé")

    if req.prediction_column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Colonne {req.prediction_column} absente du dataset")

    feature_cols = req.feature_columns or [c for c in df.columns if c != req.prediction_column]
    feature_cols = [c for c in feature_cols if c in df.columns]
    if not feature_cols:
        raise HTTPException(status_code=400, detail="Aucune feature exploitable")

    try:
        X = _prepare_features(df, feature_cols)
    except Exception as exc:
        logger.error(f"Préparation features : {exc}")
        raise HTTPException(status_code=400, detail=f"Préparation impossible : {exc}")

    n_samples = X.shape[0]
    if n_samples < req.n_clusters * 5:
        raise HTTPException(
            status_code=400,
            detail=f"Pas assez d'observations ({n_samples}) pour {req.n_clusters} clusters",
        )

    kmeans = KMeans(n_clusters=req.n_clusters, n_init=10, random_state=42)
    labels = kmeans.fit_predict(X)

    predictions = df[req.prediction_column]
    is_positive = (predictions == req.favorable_value).astype(int).values

    global_positive_rate = float(is_positive.mean())

    # Test du Khi-deux : indépendance entre cluster et prédiction
    contingency = pd.crosstab(labels, is_positive)
    chi2, p_value, _, _ = stats.chi2_contingency(contingency)

    findings: List[ClusterFinding] = []
    for cluster_id in range(req.n_clusters):
        mask = labels == cluster_id
        cluster_size = int(mask.sum())
        if cluster_size == 0:
            continue
        cluster_positive_rate = float(is_positive[mask].mean())
        deviation = cluster_positive_rate - global_positive_rate
        risk = _risk_for_deviation(deviation, req.disparity_threshold)
        dominant = _characterize_cluster(df, mask, feature_cols, top_k=3)

        finding = ClusterFinding(
            cluster_id=cluster_id,
            size=cluster_size,
            positive_rate=round(cluster_positive_rate, 4),
            deviation_from_global=round(deviation, 4),
            risk_level=risk,
            dominant_features=dominant,
            interpretation="",
        )
        finding.interpretation = _build_interpretation(finding, global_positive_rate)
        findings.append(finding)

    findings.sort(key=lambda f: abs(f.deviation_from_global), reverse=True)

    risk_levels = [f.risk_level for f in findings]
    if "rouge" in risk_levels:
        overall = "rouge"
    elif "orange" in risk_levels:
        overall = "orange"
    else:
        overall = "vert"

    summary = (
        f"Analyse non supervisée sur {n_samples} observations regroupées en {req.n_clusters} clusters. "
        f"Taux de décision positive global : {global_positive_rate * 100:.1f} %. "
        f"Test du Khi-deux : statistique = {chi2:.2f}, p = {p_value:.4f} "
        f"({'significatif' if p_value < 0.05 else 'non significatif'} au seuil 5 %). "
        f"Risque global : {overall.upper()}."
    )

    ai_act_note = (
        "Cette détection non supervisée constitue une démarche de diligence proportionnée au sens "
        "de l'article 9 de l'AI Act (gestion des risques). Elle permet de remplir partiellement "
        "l'obligation d'examen des biais de l'article 10 sans collecter d'attributs sensibles "
        "supplémentaires, ce qui réduit l'exposition RGPD. À combiner avec une analyse supervisée "
        "lorsque des labels démographiques sont légalement disponibles (article 10(5))."
    )

    return UnsupervisedResponse(
        n_clusters=req.n_clusters,
        n_samples=n_samples,
        global_positive_rate=round(global_positive_rate, 4),
        chi2_statistic=round(float(chi2), 4),
        chi2_p_value=round(float(p_value), 6),
        is_statistically_significant=bool(p_value < 0.05),
        overall_risk=overall,
        findings=findings,
        natural_language_summary=summary,
        ai_act_relevance=ai_act_note,
    )
