"""
Test suite for the Fintech Inference Service API
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from datetime import datetime
import sys
from pathlib import Path

# Add src to path for imports
sys.path.append(str(Path(__file__).parent.parent / "src"))

from api.main import app

client = TestClient(app)

class TestHealthEndpoints:
    """Test health check endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "service" in data
        assert "version" in data
    
    def test_health_check(self):
        """Test basic health check"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "models_loaded" in data
    
    def test_readiness_check(self):
        """Test readiness probe"""
        response = client.get("/ready")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
    
    def test_liveness_check(self):
        """Test liveness probe"""
        response = client.get("/live")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "alive"

class TestInferenceEndpoints:
    """Test ML inference endpoints"""
    
    def test_churn_prediction(self):
        """Test single customer churn prediction"""
        customer_data = {
            "customer_id": "TEST_001",
            "features": {
                "days_since_last_transaction": 30,
                "total_transactions": 15,
                "avg_transaction_amount": 125.50
            }
        }
        
        response = client.post("/api/v1/inference/churn-score", json=customer_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "customer_id" in data
        assert "churn_probability" in data
        assert "churn_prediction" in data
        assert "risk_level" in data
        assert 0 <= data["churn_probability"] <= 1
    
    def test_churn_batch_prediction(self):
        """Test batch churn prediction"""
        batch_data = {
            "customers": [
                {
                    "customer_id": "TEST_001",
                    "features": {"days_since_last_transaction": 30}
                },
                {
                    "customer_id": "TEST_002", 
                    "features": {"days_since_last_transaction": 60}
                }
            ]
        }
        
        response = client.post("/api/v1/inference/churn-batch", json=batch_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "predictions" in data
        assert "summary" in data
        assert len(data["predictions"]) == 2
    
    def test_customer_segmentation(self):
        """Test customer segmentation"""
        customer_data = {
            "customer_id": "TEST_001",
            "features": {
                "avg_transaction_amount": 250.0,
                "total_transactions": 20
            }
        }
        
        response = client.post("/api/v1/inference/segment", json=customer_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "customer_id" in data
        assert "segment_id" in data
        assert "segment_name" in data
        assert "confidence" in data
    
    def test_fraud_detection(self):
        """Test fraud detection"""
        transaction_data = {
            "customer_id": "TEST_001",
            "transaction_date": "2024-12-20T14:30:00",
            "amount": -1500.0,
            "merchant": "Unknown Store",
            "category": "retail",
            "mode": "Credit Card",
            "location": "Unknown Location"
        }
        
        response = client.post("/api/v1/inference/fraud-detection", json=transaction_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "customer_id" in data
        assert "fraud_probability" in data
        assert "fraud_prediction" in data
        assert "risk_factors" in data
        assert 0 <= data["fraud_probability"] <= 1
    
    def test_model_explanation(self):
        """Test model explanation endpoint"""
        response = client.get("/api/v1/inference/explain?customer_id=TEST_001&model_type=churn")
        assert response.status_code == 200
        
        data = response.json()
        assert "prediction" in data
        assert "feature_contributions" in data
        assert "explanation_summary" in data
    
    def test_inference_metrics(self):
        """Test inference metrics endpoint"""
        response = client.get("/api/v1/inference/metrics")
        assert response.status_code == 200
        
        data = response.json()
        assert "metrics" in data
        assert "timestamp" in data
        assert "status" in data

class TestModelEndpoints:
    """Test model management endpoints"""
    
    def test_models_status(self):
        """Test models status endpoint"""
        response = client.get("/models/status")
        assert response.status_code == 200
        
        data = response.json()
        assert "models" in data
        assert "total_models" in data
        assert "loaded_models" in data
    
    def test_model_reload(self):
        """Test model reload endpoint"""
        response = client.post("/models/reload")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "status" in data

class TestErrorHandling:
    """Test error handling and edge cases"""
    
    def test_invalid_customer_data(self):
        """Test with invalid customer data"""
        invalid_data = {
            "customer_id": "",  # Empty customer ID
            "features": {}
        }
        
        response = client.post("/api/v1/inference/churn-score", json=invalid_data)
        # Should handle gracefully, not necessarily return 400
        assert response.status_code in [200, 400, 422]
    
    def test_missing_required_fields(self):
        """Test with missing required fields"""
        incomplete_data = {
            "customer_id": "TEST_001"
            # Missing features
        }
        
        response = client.post("/api/v1/inference/churn-score", json=incomplete_data)
        # Should handle gracefully
        assert response.status_code in [200, 400, 422]
    
    def test_invalid_transaction_data(self):
        """Test fraud detection with invalid transaction data"""
        invalid_transaction = {
            "customer_id": "TEST_001",
            "transaction_date": "invalid-date",
            "amount": "not-a-number",
            "merchant": "",
            "category": "invalid_category",
            "mode": "Invalid Mode",
            "location": ""
        }
        
        response = client.post("/api/v1/inference/fraud-detection", json=invalid_transaction)
        assert response.status_code in [400, 422]  # Should return validation error

class TestPerformance:
    """Test performance and load handling"""
    
    def test_batch_processing_large(self):
        """Test batch processing with larger dataset"""
        large_batch = {
            "customers": [
                {"customer_id": f"TEST_{i:06d}", "features": {"days_since_last_transaction": i}}
                for i in range(100)  # 100 customers
            ]
        }
        
        response = client.post("/api/v1/inference/churn-batch", json=large_batch)
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["predictions"]) == 100
    
    def test_concurrent_requests(self):
        """Test handling of concurrent requests"""
        import threading
        import time
        
        results = []
        
        def make_request():
            customer_data = {
                "customer_id": f"TEST_{threading.current_thread().ident}",
                "features": {"days_since_last_transaction": 30}
            }
            response = client.post("/api/v1/inference/churn-score", json=customer_data)
            results.append(response.status_code)
        
        # Create 5 concurrent threads
        threads = []
        for i in range(5):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        # All requests should succeed
        assert all(status == 200 for status in results)
        assert len(results) == 5

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
