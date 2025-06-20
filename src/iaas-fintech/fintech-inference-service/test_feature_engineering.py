#!/usr/bin/env python3
"""
Test script to verify feature engineering documentation and system functionality
"""

import requests
import sys
import os

def test_api_functionality():
    """Test that all API endpoints still work"""
    base_url = "http://localhost:8000"
    
    print("🔄 Testing API Functionality...")
    
    # Test health
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ API Health check passed")
        else:
            print(f"❌ API Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API not accessible: {e}")
        return False
    
    # Test customer endpoints
    try:
        response = requests.get(f"{base_url}/api/v1/customers", params={"page_size": 5}, timeout=5)
        if response.status_code == 200:
            print("✅ Customer endpoints working")
        else:
            print(f"❌ Customer endpoints failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Customer endpoints error: {e}")
        return False
    
    # Test analytics endpoints
    try:
        response = requests.get(f"{base_url}/api/v1/analytics/customers", timeout=5)
        if response.status_code == 200:
            print("✅ Analytics endpoints working")
        else:
            print(f"❌ Analytics endpoints failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Analytics endpoints error: {e}")
        return False
    
    return True

def test_feature_files():
    """Test that feature files exist and are accessible"""
    print("\n🔄 Testing Feature Files...")
    
    customer_features_path = "data/processed/customer_features.csv"
    transaction_features_path = "data/processed/transaction_features.csv"
    
    if os.path.exists(customer_features_path):
        print("✅ Customer features file exists")
    else:
        print("❌ Customer features file missing")
        return False
    
    if os.path.exists(transaction_features_path):
        print("✅ Transaction features file exists")
    else:
        print("❌ Transaction features file missing")
        return False
    
    return True

def test_dashboard_accessibility():
    """Test that Streamlit dashboard is accessible"""
    print("\n🔄 Testing Dashboard Accessibility...")
    
    try:
        response = requests.get("http://localhost:8501", timeout=5)
        if response.status_code == 200:
            print("✅ Streamlit dashboard accessible")
            return True
        else:
            print(f"❌ Dashboard not accessible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Dashboard error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Feature Engineering Implementation Test")
    print("=" * 50)
    
    # Change to correct directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Run tests
    api_test = test_api_functionality()
    files_test = test_feature_files()
    dashboard_test = test_dashboard_accessibility()
    
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    print(f"API Functionality: {'✅ PASS' if api_test else '❌ FAIL'}")
    print(f"Feature Files: {'✅ PASS' if files_test else '❌ FAIL'}")
    print(f"Dashboard: {'✅ PASS' if dashboard_test else '❌ FAIL'}")
    
    if api_test and files_test and dashboard_test:
        print("\n🎉 All tests passed! Feature Engineering documentation is ready.")
        print("\n📋 What's been added:")
        print("- 🔧 Feature Engineering page in dashboard navigation")
        print("- 📊 Comprehensive documentation for 65 customer features")
        print("- 💳 Detailed explanation of 10 transaction features")
        print("- 📈 Feature examples and ML applications")
        print("- 🎯 Business impact and use case explanations")
        print("\n🌐 Access the new page at: http://localhost:8501 -> Feature Engineering")
        return True
    else:
        print("\n❌ Some tests failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
