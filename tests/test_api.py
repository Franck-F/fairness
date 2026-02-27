"""
Backend API tests for AuditIQ.
Tests critical endpoints: health, upload, fairness, ML training.
"""

import os
import sys
import pytest

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from fastapi.testclient import TestClient


@pytest.fixture(scope="module")
def client():
    from main import app
    return TestClient(app)


@pytest.fixture
def sample_csv(tmp_path):
    import pandas as pd
    df = pd.DataFrame({
        "age": [25, 30, 35, 40, 45, 50, 55, 60, 25, 30],
        "gender": ["M", "F", "M", "F", "M", "F", "M", "F", "M", "F"],
        "income": [30000, 45000, 50000, 35000, 60000, 55000, 70000, 40000, 32000, 48000],
        "approved": [1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    })
    path = tmp_path / "test_data.csv"
    df.to_csv(path, index=False)
    return path


class TestHealthCheck:
    def test_health_endpoint(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data

    def test_health_has_services(self, client):
        data = client.get("/health").json()
        assert "services" in data


class TestDatasetUpload:
    def test_upload_csv(self, client, sample_csv):
        with open(sample_csv, "rb") as f:
            response = client.post(
                "/api/datasets/upload",
                files={"file": ("test.csv", f, "text/csv")},
            )
        assert response.status_code == 200
        data = response.json()
        assert "dataset_id" in data
        assert data["rows"] == 10
        assert data["columns"] == 4
        assert "quality_score" in data

    def test_upload_invalid_extension(self, client, tmp_path):
        bad_file = tmp_path / "test.exe"
        bad_file.write_text("not a dataset")
        with open(bad_file, "rb") as f:
            response = client.post(
                "/api/datasets/upload",
                files={"file": ("test.exe", f, "application/octet-stream")},
            )
        assert response.status_code == 400

    def test_upload_returns_profiling(self, client, sample_csv):
        with open(sample_csv, "rb") as f:
            response = client.post(
                "/api/datasets/upload",
                files={"file": ("test.csv", f, "text/csv")},
            )
        data = response.json()
        assert "profiling" in data
        assert "missing_values" in data["profiling"]


class TestFairness:
    def _upload_and_get_id(self, client, sample_csv):
        with open(sample_csv, "rb") as f:
            resp = client.post(
                "/api/datasets/upload",
                files={"file": ("test.csv", f, "text/csv")},
            )
        return resp.json()["dataset_id"]

    def test_fairness_calculate(self, client, sample_csv):
        dataset_id = self._upload_and_get_id(client, sample_csv)
        response = client.post("/api/fairness/calculate", json={
            "dataset_id": dataset_id,
            "target_column": "approved",
            "sensitive_attributes": ["gender"],
            "favorable_outcome": 1,
        })
        assert response.status_code == 200
        data = response.json()
        assert "overall_score" in data
        assert "risk_level" in data
        assert "metrics_by_attribute" in data

    def test_fairness_missing_dataset(self, client):
        response = client.post("/api/fairness/calculate", json={
            "dataset_id": "nonexistent",
            "target_column": "approved",
            "sensitive_attributes": ["gender"],
        })
        assert response.status_code == 404


class TestMLTraining:
    def _upload_and_get_id(self, client, sample_csv):
        with open(sample_csv, "rb") as f:
            resp = client.post(
                "/api/datasets/upload",
                files={"file": ("test.csv", f, "text/csv")},
            )
        return resp.json()["dataset_id"]

    def test_train_logistic(self, client, sample_csv):
        dataset_id = self._upload_and_get_id(client, sample_csv)
        response = client.post("/api/ml/train", json={
            "dataset_id": dataset_id,
            "target_column": "approved",
            "algorithm": "logistic_regression",
        })
        assert response.status_code == 200
        data = response.json()
        assert "model_id" in data
        assert "accuracy" in data["metrics"]


class TestPydanticValidation:
    def test_invalid_algorithm(self, client):
        response = client.post("/api/ml/train", json={
            "dataset_id": "test",
            "target_column": "y",
            "algorithm": "invalid_algo",
        })
        assert response.status_code == 422

    def test_invalid_test_size(self, client):
        response = client.post("/api/ml/train", json={
            "dataset_id": "test",
            "target_column": "y",
            "test_size": 0.99,
        })
        assert response.status_code == 422

    def test_empty_sensitive_attributes(self, client):
        response = client.post("/api/fairness/calculate", json={
            "dataset_id": "test",
            "target_column": "y",
            "sensitive_attributes": [],
        })
        assert response.status_code == 422
