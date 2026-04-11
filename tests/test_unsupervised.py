"""Tests pour la détection non supervisée de biais (sprint refonte alignement)."""
import io
import os
import sys

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from fastapi.testclient import TestClient
    from main import app
    client = TestClient(app)
    BACKEND_AVAILABLE = True
except ImportError:
    BACKEND_AVAILABLE = False

pytestmark = pytest.mark.skipif(not BACKEND_AVAILABLE, reason="Backend dependencies not installed")


def _upload_synthetic_dataset() -> str:
    """Charge un dataset synthétique avec un biais évident sur 'group'."""
    rows = ["age,group,score,prediction"]
    # Groupe A : majoritairement positif. Groupe B : majoritairement négatif.
    for i in range(60):
        rows.append(f"{20 + i % 30},A,{0.6 + (i % 10) * 0.01},1")
    for i in range(60):
        rows.append(f"{20 + i % 30},B,{0.3 + (i % 10) * 0.01},0")
    csv = "\n".join(rows)
    resp = client.post(
        "/api/datasets/upload",
        files={"file": ("biased.csv", io.BytesIO(csv.encode()), "text/csv")},
        data={"dataset_name": "synthetic_biased"},
    )
    assert resp.status_code == 200
    return resp.json()["dataset_id"]


class TestUnsupervisedDetection:
    def test_detect_known_disparity(self):
        dataset_id = _upload_synthetic_dataset()
        resp = client.post(
            "/api/unsupervised/detect",
            json={
                "dataset_id": dataset_id,
                "prediction_column": "prediction",
                "favorable_value": 1,
                "n_clusters": 4,
                "disparity_threshold": 0.10,
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        # Le biais synthétique doit être détecté comme statistiquement significatif
        assert data["is_statistically_significant"] is True
        # Au moins un cluster doit être en alerte (orange ou rouge)
        risks = [f["risk_level"] for f in data["findings"]]
        assert any(r in ("orange", "rouge") for r in risks)
        # Le risque global ne doit pas être vert
        assert data["overall_risk"] in ("orange", "rouge")

    def test_missing_prediction_column(self):
        dataset_id = _upload_synthetic_dataset()
        resp = client.post(
            "/api/unsupervised/detect",
            json={
                "dataset_id": dataset_id,
                "prediction_column": "colonne_inexistante",
                "favorable_value": 1,
            },
        )
        assert resp.status_code == 400

    def test_dataset_not_found(self):
        resp = client.post(
            "/api/unsupervised/detect",
            json={
                "dataset_id": "00000000-0000-0000-0000-000000000000",
                "prediction_column": "prediction",
                "favorable_value": 1,
            },
        )
        assert resp.status_code == 404


class TestLLMAuditValidation:
    def test_invalid_prompt_bank(self):
        resp = client.post(
            "/api/llm-audit/run",
            json={
                "endpoint": {
                    "url": "http://localhost:9999/never-exists",
                    "payload_template": {"prompt": "{{PROMPT}}"},
                    "response_path": "response",
                },
                "prompt_bank": [],
                "max_prompts": 2,
            },
        )
        # Banque vide rejetée OU 500 si toutes les paires échouent
        assert resp.status_code in (400, 500)
