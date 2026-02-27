"""
AI Ethics Validator - Bias detection, fairness thresholds, compliance checks.
Implements validating-ai-ethics-and-fairness skill patterns.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional
from datetime import datetime
from config import logger, FAIRNESS_DI_LOW


class EthicsValidator:
    """Validate AI models and datasets for bias, fairness, and ethical compliance."""

    # EU AI Act + EEOC thresholds
    DISPARATE_IMPACT_THRESHOLD = FAIRNESS_DI_LOW  # 0.8 (80% rule)
    MAX_REPRESENTATION_SKEW = 0.3  # 30% max deviation from expected

    @staticmethod
    def validate_input_data_bias(
        df: pd.DataFrame,
        sensitive_attributes: List[str],
        target_column: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Detect bias in input data before model training."""
        results = {
            "timestamp": datetime.utcnow().isoformat(),
            "checks": [],
            "overall_status": "pass",
            "risk_score": 0,
        }

        total_checks = 0
        failed_checks = 0

        for attr in sensitive_attributes:
            if attr not in df.columns:
                continue

            # 1. Representation balance check
            counts = df[attr].value_counts(normalize=True)
            expected = 1.0 / len(counts)
            max_dev = (counts - expected).abs().max()

            total_checks += 1
            status = "pass" if max_dev <= EthicsValidator.MAX_REPRESENTATION_SKEW else "fail"
            if status == "fail":
                failed_checks += 1

            results["checks"].append({
                "check": "representation_balance",
                "attribute": attr,
                "status": status,
                "detail": f"Max deviation from uniform: {max_dev:.2%}",
                "groups": {str(k): round(v, 4) for k, v in counts.items()},
            })

            # 2. Disparate impact check (if target available)
            if target_column and target_column in df.columns:
                groups = df[attr].unique()
                rates = {}
                for g in groups:
                    mask = df[attr] == g
                    if mask.sum() == 0:
                        continue
                    rate = (df.loc[mask, target_column].astype(str) == str(df[target_column].mode().iloc[0])).mean()
                    rates[str(g)] = float(rate)

                if len(rates) >= 2:
                    max_rate = max(rates.values())
                    min_rate = min(rates.values())
                    di_ratio = min_rate / max_rate if max_rate > 0 else 1.0

                    total_checks += 1
                    status = "pass" if di_ratio >= EthicsValidator.DISPARATE_IMPACT_THRESHOLD else "fail"
                    if status == "fail":
                        failed_checks += 1

                    results["checks"].append({
                        "check": "disparate_impact",
                        "attribute": attr,
                        "status": status,
                        "di_ratio": round(di_ratio, 4),
                        "threshold": EthicsValidator.DISPARATE_IMPACT_THRESHOLD,
                        "rates": rates,
                    })

            # 3. Missing data bias check
            missing_by_group = df.groupby(attr).apply(lambda x: x.isnull().mean().mean())
            max_missing_diff = missing_by_group.max() - missing_by_group.min()

            total_checks += 1
            status = "pass" if max_missing_diff < 0.1 else "warning" if max_missing_diff < 0.2 else "fail"
            if status == "fail":
                failed_checks += 1

            results["checks"].append({
                "check": "missing_data_bias",
                "attribute": attr,
                "status": status,
                "detail": f"Max missing rate diff between groups: {max_missing_diff:.2%}",
            })

        # Overall
        results["risk_score"] = round(failed_checks / total_checks * 100, 1) if total_checks > 0 else 0
        results["overall_status"] = "pass" if failed_checks == 0 else "warning" if failed_checks <= 1 else "fail"
        results["total_checks"] = total_checks
        results["failed_checks"] = failed_checks

        return results

    @staticmethod
    def generate_compliance_report(
        fairness_results: Dict[str, Any],
        ethics_results: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Generate EU AI Act / EEOC compliance summary."""
        overall_score = fairness_results.get("overall_score", 0)
        ethics_status = ethics_results.get("overall_status", "unknown")

        compliance = {
            "timestamp": datetime.utcnow().isoformat(),
            "frameworks": [],
        }

        # EU AI Act compliance
        eu_status = "compliant" if overall_score >= 80 and ethics_status != "fail" else "non_compliant"
        compliance["frameworks"].append({
            "name": "EU AI Act",
            "status": eu_status,
            "requirements_met": [
                {"req": "Bias monitoring", "met": overall_score >= 75},
                {"req": "Transparency (audit trail)", "met": True},
                {"req": "Human oversight capability", "met": True},
                {"req": "Data quality validation", "met": ethics_status != "fail"},
            ],
        })

        # EEOC 4/5ths rule
        eeoc_status = "compliant" if overall_score >= 80 else "non_compliant"
        compliance["frameworks"].append({
            "name": "EEOC 4/5ths Rule",
            "status": eeoc_status,
            "detail": f"Overall fairness score: {overall_score}%",
        })

        compliance["overall_compliance"] = (
            "compliant" if eu_status == "compliant" and eeoc_status == "compliant"
            else "non_compliant"
        )

        return compliance
