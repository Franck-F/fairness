import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import shap
import lime
import lime.lime_tabular
from scipy import stats
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SeniorDataScientistEngine:
    """
    Expert-level engine for Data Science workflow.
    Handles Advanced Analysis, Feature Engineering, and Interpretation.
    """

    @staticmethod
    def _safe_float(val):
        """Convert to float and handle NaN/Inf for JSON compliance."""
        try:
            res = float(val)
            if np.isnan(res) or np.isinf(res):
                return 0.0
            return res
        except:
            return 0.0

    @staticmethod
    def get_detailed_stats(df):
        """Deep statistical analysis: skewness, kurtosis, etc."""
        numeric_df = df.select_dtypes(include=[np.number])
        stats_dict = {}
        
        for col in numeric_df.columns:
            col_data = numeric_df[col].dropna()
            if len(col_data) < 1:
                stats_dict[col] = {
                    "mean": 0.0, "median": 0.0, "std": 0.0, "min": 0.0, "max": 0.0,
                    "skewness": 0.0, "kurtosis": 0.0, "zeros_count": 0, "outliers_count": 0
                }
                continue

            # Quantiles
            q1, q3 = col_data.quantile(0.25), col_data.quantile(0.75)
            iqr = q3 - q1
            
            stats_dict[col] = {
                "mean": SeniorDataScientistEngine._safe_float(col_data.mean()),
                "median": SeniorDataScientistEngine._safe_float(col_data.median()),
                "std": SeniorDataScientistEngine._safe_float(col_data.std()),
                "min": SeniorDataScientistEngine._safe_float(col_data.min()),
                "max": SeniorDataScientistEngine._safe_float(col_data.max()),
                "skewness": SeniorDataScientistEngine._safe_float(stats.skew(col_data)) if len(col_data) > 2 else 0.0,
                "kurtosis": SeniorDataScientistEngine._safe_float(stats.kurtosis(col_data)) if len(col_data) > 3 else 0.0,
                "zeros_count": int((col_data == 0).sum()),
                "outliers_count": int(((col_data < (q1 - 1.5 * iqr)) | (col_data > (q3 + 1.5 * iqr))).sum())
            }
        return stats_dict

    @staticmethod
    def get_target_distributions(df, target_col):
        """Distributions relative to the target variable."""
        if target_col not in df.columns:
            return {}

        results = {}
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        for col in numeric_cols:
            if col == target_col: continue
            
            try:
                # Simple group by for categorical target or bins for numeric target
                if df[target_col].nunique() <= 10:
                    group_stats = df.groupby(target_col)[col].agg(['mean', 'std', 'median']).to_dict(orient='index')
                else:
                    # Discretize target for analysis
                    temp_df = df[[col, target_col]].copy()
                    temp_df['target_bins'] = pd.qcut(temp_df[target_col], q=5, duplicates='drop').astype(str)
                    group_stats = temp_df.groupby('target_bins')[col].agg(['mean', 'std', 'median']).to_dict(orient='index')
                
                # Sanitize results for JSON
                sanitized_stats = {}
                for k, v in group_stats.items():
                    sanitized_stats[str(k)] = {
                        mk: SeniorDataScientistEngine._safe_float(mv) for mk, mv in v.items()
                    }
                results[col] = sanitized_stats
            except Exception as e:
                logger.error(f"Distribution error for {col}: {e}")
                continue
        
        return results

    @staticmethod
    def engineer_time_series_features(df, date_col, target_col=None, lags=[1, 3, 7], windows=[3, 7]):
        """Create time-series variables (lags, rolling stats)."""
        if date_col not in df.columns:
            return df
        
        df = df.sort_values(by=date_col)
        new_features = []
        
        if target_col:
            # Lags
            for lag in lags:
                col_name = f"{target_col}_lag_{lag}"
                df[col_name] = df[target_col].shift(lag)
                new_features.append(col_name)
            
            # Rolling statistics
            for window in windows:
                mean_col = f"{target_col}_rolling_mean_{window}"
                std_col = f"{target_col}_rolling_std_{window}"
                df[mean_col] = df[target_col].rolling(window=window).mean()
                df[std_col] = df[target_col].rolling(window=window).std()
                new_features.extend([mean_col, std_col])
        
        return df, new_features

    @staticmethod
    def get_dimensionality_reduction(df, n_components=2):
        """PCA and t-SNE for multivariate visualization."""
        try:
            numeric_df = df.select_dtypes(include=[np.number]).dropna(axis=1, how='all')
            # Fill NaNs with 0 for reduction instead of dropping everything
            numeric_df = numeric_df.fillna(0)
            
            if numeric_df.empty or numeric_df.shape[1] < n_components:
                return {
                    "pca": [], "tsne": [], "explained_variance": [], "indices": []
                }
                
            scaler = StandardScaler()
            scaled_data = scaler.fit_transform(numeric_df)
            
            # PCA
            pca = PCA(n_components=min(n_components, numeric_df.shape[1]))
            pca_result = pca.fit_transform(scaled_data)
            
            # t-SNE (only on a sample if dataset is too large)
            sample_size = min(len(scaled_data), 1000)
            tsne = TSNE(n_components=n_components, random_state=42)
            tsne_result = tsne.fit_transform(scaled_data[:sample_size])
            
            return {
                "pca": [[SeniorDataScientistEngine._safe_float(x) for x in row] for row in pca_result.tolist()],
                "tsne": [[SeniorDataScientistEngine._safe_float(x) for x in row] for row in tsne_result.tolist()],
                "explained_variance": [SeniorDataScientistEngine._safe_float(x) for x in pca.explained_variance_ratio_.tolist()],
                "indices": numeric_df.index[:sample_size].tolist() if sample_size < len(scaled_data) else numeric_df.index.tolist()
            }
        except Exception as e:
            logger.error(f"Dim reduction error: {e}")
            return { "pca": [], "tsne": [], "explained_variance": [], "indices": [] }

    @staticmethod
    def get_shap_interpretation(model, X_train):
        """Calculate SHAP values for model interpretation."""
        try:
            explainer = shap.Explainer(model, X_train)
            shap_values = explainer(X_train)
            
            return {
                "base_value": [SeniorDataScientistEngine._safe_float(x) for x in shap_values.base_values.tolist()] if hasattr(shap_values, 'base_values') else None,
                "values": [[SeniorDataScientistEngine._safe_float(x) for x in row] for row in shap_values.values.tolist()],
                "feature_names": X_train.columns.tolist()
            }
        except Exception as e:
            logger.error(f"SHAP error: {e}")
            return None

    @staticmethod
    def get_quality_score(df):
        """Quantify dataset health from 0 to 100."""
        if df.empty:
            return 0.0
            
        score = 100
        
        # Penalty for missing values
        missing_pct = df.isnull().mean().mean()
        if pd.isna(missing_pct): missing_pct = 0.0
        score -= missing_pct * 100
        
        # Penalty for outliers (rough estimate)
        numeric_df = df.select_dtypes(include=[np.number])
        if not numeric_df.empty:
            outliers_total = 0
            for col in numeric_df.columns:
                col_data = numeric_df[col].dropna()
                if len(col_data) > 0:
                    q1, q3 = col_data.quantile(0.25), col_data.quantile(0.75)
                    iqr = q3 - q1
                    outliers = ((col_data < (q1 - 1.5 * iqr)) | (col_data > (q3 + 1.5 * iqr))).sum()
                    outliers_total += outliers / len(col_data)
            
            penalty = (outliers_total / len(numeric_df.columns)) * 20
            if pd.isna(penalty): penalty = 0.0
            score -= penalty
            
        return max(0.0, min(100.0, round(float(score), 1)))

    @staticmethod
    def get_expert_recommendations(df, target_col=None):
        """AI-style logic for initial recommendations."""
        recs = []
        
        # Check imbalance
        if target_col and target_col in df.columns and df[target_col].nunique() <= 10:
            counts = df[target_col].value_counts(normalize=True)
            if counts.min() < 0.2:
                recs.append({
                    "type": "imbalance",
                    "severity": "high",
                    "message": f"Déséquilibre important détecté dans '{target_col}' ({counts.min():.1%}). Envisager SMOTE ou un rééchantillonnage."
                })
        
        # Check missingness
        missing = df.isnull().mean()
        high_missing = missing[missing > 0.3]
        if not high_missing.empty:
            recs.append({
                "type": "missing",
                "severity": "medium",
                "message": f"Colonnes ({', '.join(high_missing.index[:3])}) avec >30% de manquants. Imputation ou suppression requise."
            })
            
        # Check skewness
        numeric_df = df.select_dtypes(include=[np.number])
        skewed_cols = []
        for col in numeric_df.columns:
            col_data = numeric_df[col].dropna()
            if len(col_data) > 2:
                skew = SeniorDataScientistEngine._safe_float(stats.skew(col_data))
                if abs(skew) > 1.5:
                    skewed_cols.append(col)
        
        if skewed_cols:
            recs.append({
                "type": "skewness",
                "severity": "low",
                "message": f"Variables asymétriques détectées ({', '.join(skewed_cols[:2])}). Envisagez une transformation Log ou Box-Cox."
            })
            
        return recs

    @staticmethod
    def get_correlation_matrix(df):
        """Calculate correlation matrix for numeric columns."""
        try:
            numeric_df = df.select_dtypes(include=[np.number]).dropna(axis=1, how='all')
            if numeric_df.empty:
                return {}
            
            # fillna(0) to avoid issues with sparse correlations
            corr = numeric_df.fillna(0).corr().round(3)
            return corr.to_dict()
        except Exception as e:
            logger.error(f"Correlation matrix error: {e}")
            return {}

    @staticmethod
    def get_outlier_analysis(df, top_n=5):
        """Analyze top columns with most outliers."""
        try:
            numeric_df = df.select_dtypes(include=[np.number]).fillna(0)
            outlier_details = []
            
            for col in numeric_df.columns:
                col_data = numeric_df[col].dropna()
                if len(col_data) < 1: continue
                
                q1, q3 = col_data.quantile(0.25), col_data.quantile(0.75)
                iqr = q3 - q1
                lower_bound = q1 - 1.5 * iqr
                upper_bound = q3 + 1.5 * iqr
                
                outliers = col_data[(col_data < lower_bound) | (col_data > upper_bound)]
                if len(outliers) > 0:
                    outlier_details.append({
                        "column": col,
                        "count": len(outliers),
                        "percentage": round(len(outliers) / len(col_data) * 100, 2),
                        "min_outlier": SeniorDataScientistEngine._safe_float(outliers.min()),
                        "max_outlier": SeniorDataScientistEngine._safe_float(outliers.max())
                    })
            
            # Sort by count descending
            outlier_details.sort(key=lambda x: x['count'], reverse=True)
            return outlier_details[:top_n]
        except Exception as e:
            logger.error(f"Outlier analysis error: {e}")
            return []
