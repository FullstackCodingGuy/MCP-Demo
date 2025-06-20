#!/usr/bin/env python3
"""
Full system test to verify all functionality
"""

import requests
import json
import time

def test_api_endpoints():
    """Test all API endpoints"""
    base_url = "http://localhost:8000"
    api_base = f"{base_url}/api/v1"
    
    print("🔄 Testing Full System Functionality...")
    print("=" * 50)
    
    # Test health check
    print("1. Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("   ✅ Health check passed")
            health_data = response.json()
            print(f"   📊 Status: {health_data['status']}")
            print(f"   🤖 Models: {health_data['models_loaded']}")
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
    
    # Test customer endpoints
    print("\n2. Testing Customer Endpoints...")
    try:
        # List customers
        response = requests.get(f"{api_base}/customers", params={"page_size": 5})
        if response.status_code == 200:
            customers_data = response.json()
            print(f"   ✅ Customer list: {len(customers_data['customers'])} customers found")
            
            if customers_data['customers']:
                customer_id = customers_data['customers'][0]['customer_id']
                print(f"   📋 Sample customer: {customer_id}")
                
                # Test customer detail
                detail_response = requests.get(f"{api_base}/customers/{customer_id}")
                if detail_response.status_code == 200:
                    print("   ✅ Customer detail endpoint working")
                    customer_detail = detail_response.json()
                    print(f"   👤 Customer: {customer_detail['customer']['name']}")
                    print(f"   📈 Total transactions: {customer_detail['transaction_summary']['total_transactions']}")
                
                # Test customer transactions
                trans_response = requests.get(f"{api_base}/customers/{customer_id}/transactions", params={"page_size": 3})
                if trans_response.status_code == 200:
                    trans_data = trans_response.json()
                    print(f"   ✅ Customer transactions: {len(trans_data['transactions'])} transactions")
                
        else:
            print(f"   ❌ Customer list failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Customer endpoints error: {e}")
    
    # Test analytics endpoints
    print("\n3. Testing Analytics Endpoints...")
    try:
        # Customer analytics
        response = requests.get(f"{api_base}/analytics/customers")
        if response.status_code == 200:
            analytics_data = response.json()
            print("   ✅ Customer analytics working")
            print(f"   📊 Total customers: {analytics_data['demographics']['total_customers']}")
            print(f"   💰 Total transactions: {analytics_data['transactions']['total_transactions']}")
        
        # Transaction analytics
        response = requests.get(f"{api_base}/analytics/transactions")
        if response.status_code == 200:
            print("   ✅ Transaction analytics working")
        
    except Exception as e:
        print(f"   ❌ Analytics endpoints error: {e}")
    
    # Test inference endpoints
    print("\n4. Testing Inference Endpoints...")
    try:
        # Churn prediction
        churn_data = {
            "customer_id": "CUST_000001",
            "transaction_count": 100,
            "avg_transaction_amount": 50.0,
            "days_since_last_transaction": 10,
            "total_amount": 5000.0,
            "preferred_categories": ["retail", "restaurant"]
        }
        
        response = requests.post(f"{api_base}/inference/churn-score", json=churn_data)
        if response.status_code == 200:
            churn_result = response.json()
            print("   ✅ Churn prediction working")
            print(f"   🎯 Churn probability: {churn_result['churn_probability']:.2%}")
            print(f"   ⚠️  Risk level: {churn_result['risk_level']}")
        
    except Exception as e:
        print(f"   ❌ Inference endpoints error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 System test completed!")

if __name__ == "__main__":
    test_api_endpoints()
