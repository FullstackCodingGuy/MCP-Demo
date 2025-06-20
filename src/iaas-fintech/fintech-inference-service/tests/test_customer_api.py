"""
Tests for customer and transaction API endpoints
"""

import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add src to path for imports
sys.path.append(str(Path(__file__).parent.parent / "src"))

from api.main import app

client = TestClient(app)


class TestCustomerEndpoints:
    """Test customer-related endpoints"""
    
    def test_get_customers_list(self):
        """Test getting customers list"""
        response = client.get("/api/v1/customers")
        
        if response.status_code == 503:
            # Data not available, which is acceptable
            assert "not available" in response.json()["detail"]
        else:
            assert response.status_code == 200
            data = response.json()
            assert "customers" in data
            assert "pagination" in data
            assert isinstance(data["customers"], list)
            assert isinstance(data["pagination"], dict)
    
    def test_get_customers_with_pagination(self):
        """Test customers list with pagination parameters"""
        response = client.get("/api/v1/customers", params={
            "page": 1,
            "page_size": 10
        })
        
        if response.status_code == 503:
            # Data not available, which is acceptable
            assert "not available" in response.json()["detail"]
        else:
            assert response.status_code == 200
            data = response.json()
            assert len(data["customers"]) <= 10
    
    def test_get_customers_with_filters(self):
        """Test customers list with filtering"""
        response = client.get("/api/v1/customers", params={
            "age_min": 25,
            "age_max": 65,
            "search": "CUST"
        })
        
        if response.status_code == 503:
            # Data not available, which is acceptable
            assert "not available" in response.json()["detail"]
        else:
            assert response.status_code == 200
    
    def test_get_customer_detail_invalid_id(self):
        """Test getting customer detail with invalid ID"""
        response = client.get("/api/v1/customers/INVALID_ID")
        
        # Should return 404 or 503
        assert response.status_code in [404, 503]
    
    def test_get_customer_transactions_invalid_id(self):
        """Test getting transactions for invalid customer ID"""
        response = client.get("/api/v1/customers/INVALID_ID/transactions")
        
        if response.status_code == 503:
            # Data not available, which is acceptable
            assert "not available" in response.json()["detail"]
        else:
            # Should return empty list for invalid customer
            assert response.status_code == 200
            data = response.json()
            assert "transactions" in data
            assert len(data["transactions"]) == 0
    
    def test_get_customer_transactions_with_filters(self):
        """Test getting customer transactions with filters"""
        response = client.get("/api/v1/customers/CUST_000001/transactions", params={
            "page": 1,
            "page_size": 50,
            "category": "grocery",
            "amount_min": 10.0,
            "amount_max": 1000.0
        })
        
        if response.status_code == 503:
            # Data not available, which is acceptable
            assert "not available" in response.json()["detail"]
        else:
            assert response.status_code == 200
            data = response.json()
            assert "transactions" in data
            assert "pagination" in data


class TestAnalyticsEndpoints:
    """Test analytics endpoints"""
    
    def test_get_customer_analytics(self):
        """Test customer analytics endpoint"""
        response = client.get("/api/v1/analytics/customers")
        
        if response.status_code == 503:
            # Data not available, which is acceptable
            assert "not available" in response.json()["detail"]
        else:
            assert response.status_code == 200
            data = response.json()
            assert "demographics" in data
            assert "transactions" in data
            assert "customer_activity" in data
    
    def test_get_transaction_analytics(self):
        """Test transaction analytics endpoint"""
        response = client.get("/api/v1/analytics/transactions")
        
        if response.status_code == 503:
            # Data not available, which is acceptable
            assert "not available" in response.json()["detail"]
        else:
            assert response.status_code == 200
            data = response.json()
            assert "period" in data
            assert "summary" in data
            assert "daily_trends" in data
    
    def test_get_transaction_analytics_with_period(self):
        """Test transaction analytics with different time periods"""
        for days in [7, 30, 90]:
            response = client.get("/api/v1/analytics/transactions", params={"days": days})
            
            if response.status_code == 503:
                # Data not available, which is acceptable
                assert "not available" in response.json()["detail"]
            else:
                assert response.status_code == 200
                data = response.json()
                assert data["period"]["days"] == days
    
    def test_transaction_analytics_invalid_period(self):
        """Test transaction analytics with invalid period"""
        response = client.get("/api/v1/analytics/transactions", params={"days": 500})
        
        # Should return validation error
        assert response.status_code == 422


class TestCustomerEndpointsValidation:
    """Test input validation for customer endpoints"""
    
    def test_customers_invalid_pagination(self):
        """Test customers endpoint with invalid pagination"""
        # Invalid page
        response = client.get("/api/v1/customers", params={"page": 0})
        assert response.status_code == 422
        
        # Invalid page size
        response = client.get("/api/v1/customers", params={"page_size": 1000})
        assert response.status_code == 422
    
    def test_customers_invalid_age_range(self):
        """Test customers endpoint with invalid age range"""
        response = client.get("/api/v1/customers", params={
            "age_min": 150,
            "age_max": 200
        })
        assert response.status_code == 422
    
    def test_transactions_invalid_pagination(self):
        """Test transactions endpoint with invalid pagination"""
        response = client.get("/api/v1/customers/CUST_001/transactions", params={
            "page": -1
        })
        assert response.status_code == 422
    
    def test_transactions_invalid_amount_range(self):
        """Test transactions endpoint with invalid amount range"""
        response = client.get("/api/v1/customers/CUST_001/transactions", params={
            "amount_min": -100
        })
        assert response.status_code == 422


class TestCustomerEndpointsWithData:
    """Test customer endpoints when data is available"""
    
    @pytest.fixture(autouse=True)
    def setup_method(self):
        """Setup for tests that assume data is available"""
        # Check if data is available
        response = client.get("/health")
        if response.status_code != 200:
            pytest.skip("API server not available")
    
    def test_customer_detail_structure(self):
        """Test customer detail response structure"""
        # First get a customer ID from the list
        response = client.get("/api/v1/customers", params={"page_size": 1})
        
        if response.status_code == 200 and response.json()["customers"]:
            customer_id = response.json()["customers"][0]["customer_id"]
            
            # Get customer detail
            detail_response = client.get(f"/api/v1/customers/{customer_id}")
            
            if detail_response.status_code == 200:
                data = detail_response.json()
                assert "customer" in data
                assert "features" in data
                assert "transaction_summary" in data
                
                customer = data["customer"]
                assert "customer_id" in customer
                assert "name" in customer
                assert "age" in customer
                assert "location" in customer
    
    def test_customer_transactions_structure(self):
        """Test customer transactions response structure"""
        # First get a customer ID
        response = client.get("/api/v1/customers", params={"page_size": 1})
        
        if response.status_code == 200 and response.json()["customers"]:
            customer_id = response.json()["customers"][0]["customer_id"]
            
            # Get customer transactions
            transactions_response = client.get(f"/api/v1/customers/{customer_id}/transactions")
            
            if transactions_response.status_code == 200:
                data = transactions_response.json()
                assert "transactions" in data
                assert "pagination" in data
                
                if data["transactions"]:
                    transaction = data["transactions"][0]
                    assert "transaction_id" in transaction
                    assert "amount" in transaction
                    assert "category" in transaction
                    assert "merchant" in transaction


class TestCustomerEndpointsPerformance:
    """Test performance aspects of customer endpoints"""
    
    def test_customers_list_performance(self):
        """Test that customers list loads in reasonable time"""
        import time
        
        start_time = time.time()
        response = client.get("/api/v1/customers", params={"page_size": 100})
        end_time = time.time()
        
        # Should complete within 5 seconds
        assert (end_time - start_time) < 5.0
        
        if response.status_code == 200:
            # Should return data structure correctly
            assert "customers" in response.json()
    
    def test_analytics_performance(self):
        """Test that analytics endpoints load in reasonable time"""
        import time
        
        start_time = time.time()
        response = client.get("/api/v1/analytics/customers")
        end_time = time.time()
        
        # Should complete within 10 seconds
        assert (end_time - start_time) < 10.0
