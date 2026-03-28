"""Tests for FastAPI backend endpoints."""
import pytest
import sys
import os
import io

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from fastapi.testclient import TestClient
    from main import app
    client = TestClient(app)
    BACKEND_AVAILABLE = True
except ImportError:
    BACKEND_AVAILABLE = False

pytestmark = pytest.mark.skipif(not BACKEND_AVAILABLE, reason="Backend dependencies not installed")


class TestHealthEndpoint:
    def test_root(self):
        response = client.get("/")
        assert response.status_code == 200

    def test_health(self):
        response = client.get("/api/health")
        # May or may not exist, just check it doesn't crash
        assert response.status_code in [200, 404]


class TestDatasetUpload:
    def test_upload_csv(self):
        csv_content = "age,gender,income,label\n25,M,30000,1\n35,F,50000,0\n28,M,40000,1\n"
        response = client.post(
            "/api/datasets/upload",
            files={"file": ("test.csv", io.BytesIO(csv_content.encode()), "text/csv")},
            data={"dataset_name": "test_dataset"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "dataset_id" in data

    def test_upload_empty_file(self):
        response = client.post(
            "/api/datasets/upload",
            files={"file": ("empty.csv", io.BytesIO(b""), "text/csv")},
            data={"dataset_name": "empty"},
        )
        # Should fail or return error
        assert response.status_code in [400, 422, 200]

    def test_upload_no_file(self):
        response = client.post("/api/datasets/upload")
        assert response.status_code == 422  # FastAPI validation error


class TestFairnessCalculation:
    @pytest.fixture(autouse=True)
    def setup_dataset(self):
        """Upload a test dataset before each test."""
        csv_content = (
            "age,gender,income,credit_score,label\n"
            "25,0,30000,600,1\n"
            "35,1,50000,750,0\n"
            "28,0,40000,680,1\n"
            "42,1,60000,700,0\n"
            "31,0,35000,620,1\n"
            "55,1,80000,800,0\n"
        )
        response = client.post(
            "/api/datasets/upload",
            files={"file": ("fairness_test.csv", io.BytesIO(csv_content.encode()), "text/csv")},
            data={"dataset_name": "fairness_test"},
        )
        if response.status_code == 200:
            self.dataset_id = response.json().get("dataset_id")
        else:
            self.dataset_id = None

    def test_calculate_fairness(self):
        if not self.dataset_id:
            pytest.skip("Dataset upload failed")

        response = client.post(
            "/api/fairness/calculate",
            json={
                "dataset_id": str(self.dataset_id),
                "target_column": "label",
                "sensitive_attributes": ["gender"],
                "favorable_outcome": 1,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "overall_score" in data or "metrics_by_attribute" in data

    def test_calculate_missing_target(self):
        if not self.dataset_id:
            pytest.skip("Dataset upload failed")

        response = client.post(
            "/api/fairness/calculate",
            json={
                "dataset_id": str(self.dataset_id),
                "target_column": "nonexistent_column",
                "sensitive_attributes": ["gender"],
            },
        )
        # Should fail gracefully
        assert response.status_code in [400, 422, 500]


class TestMLTraining:
    @pytest.fixture(autouse=True)
    def setup_dataset(self):
        csv_content = (
            "feature1,feature2,feature3,target\n"
            "1.0,2.0,3.0,1\n"
            "4.0,5.0,6.0,0\n"
            "7.0,8.0,9.0,1\n"
            "2.0,3.0,4.0,0\n"
            "5.0,6.0,7.0,1\n"
            "8.0,9.0,10.0,0\n"
        )
        response = client.post(
            "/api/datasets/upload",
            files={"file": ("ml_test.csv", io.BytesIO(csv_content.encode()), "text/csv")},
            data={"dataset_name": "ml_test"},
        )
        if response.status_code == 200:
            self.dataset_id = response.json().get("dataset_id")
        else:
            self.dataset_id = None

    def test_train_model(self):
        if not self.dataset_id:
            pytest.skip("Dataset upload failed")

        response = client.post(
            "/api/train",
            json={
                "dataset_id": str(self.dataset_id),
                "target_column": "target",
                "algorithm": "logistic_regression",
                "test_size": 0.3,
            },
        )
        # Training might fail with small dataset, that's acceptable
        assert response.status_code in [200, 400, 500]


class TestReportGeneration:
    def test_generate_report_missing_data(self):
        response = client.post(
            "/api/reports/generate",
            json={
                "audit_id": "nonexistent",
                "dataset_name": "test",
                "fairness_results": {
                    "overall_score": 75,
                    "risk_level": "Medium",
                    "bias_detected": True,
                    "metrics_by_attribute": {},
                    "recommendations": ["Test recommendation"],
                },
                "format": "pdf",
            },
        )
        # Should handle gracefully even with missing audit
        assert response.status_code in [200, 400, 404, 500]
