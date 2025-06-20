## Issue:

./setup.sh
zsh: permission denied: ./setup.sh

## Fix
```
chmod +x /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service/setup.sh
```

## Run One Script
```
cd /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service && ./setup.sh
```

## Installing Dependencies

```
cd /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service && source venv/bin/activate && pip install --upgrade setuptools wheel && pip install -r requirements.txt
```

 To start the services:
   API Server:  uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
   Dashboard:   streamlit run src/dashboard/app.py

📖 API Documentation: http://localhost:8000/docs
📊 Dashboard:         http://localhost:8501
---


## SEt Permission

setup.sh script doesn't have execute permissions. Let me fix that and then run the script for you.

```
chmod +x /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service/setup.sh
```


# Issue in setup


brew install libomp


## Customer API Test

```
cd /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service && PYTHONPATH=src python -m pytest tests/test_customer_api.py -v
```

## Check the data

```
head -1 data/raw/customers.csv
```

```
head -1 data/raw/transactions.csv
```

### let's test the API endpoints again:

```
PYTHONPATH=src python -m pytest tests/test_customer_api.py::TestCustomerEndpoints::test_get_customers_list -v
```

### let's test the analytics endpoints:
```
PYTHONPATH=src python -m pytest tests/test_customer_api.py::TestAnalyticsEndpoints -v
```

Other way

```
cd /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service && python -m pytest tests/test_customer_api.py -v
```

### let's start the API server and test the customer management interface:
```
PYTHONPATH=src uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```


### Start dashboard app
```
cd /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service && streamlit run src/dashboard/app.py --server.port 8501
```



# API Example Invokcation

```
curl -s "http://localhost:8000/api/v1/customers?page_size=5" | jq '.customers[0]'
```

```
curl -s "http://localhost:8000/api/v1/customers/CUST_000001" | jq '.customer | keys'
```

```
curl -s "http://localhost:8000/api/v1/customers/CUST_000001/transactions?page_size=3" | jq '.transactions[0]'
```

### Churn Prediction
```
curl -s -X POST "http://localhost:8000/predict/churn" -H "Content-Type: application/json" -d '{"customer_id": "CUST_000001", "feature_values": [100, 50, 25, 10, 5]}' | jq
```


### Inference Endpoints
```
curl -s -X POST "http://localhost:8000/api/v1/inference/churn-score" -H "Content-Type: application/json" -d '{"customer_id": "CUST_000001", "transaction_count": 100, "avg_transaction_amount": 50.0, "days_since_last_transaction": 10, "total_amount": 5000.0, "preferred_categories": ["retail", "restaurant"]}' | jq
```


## Script to verify all functionality
```
cd /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service && python test_full_system.py
```


## run the feature engineering to generate the features 
```
cd /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service && python src/data/feature_engineering.py
```

## check if the data files exist and run it properly:
```
cd /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service && ls data/raw/ && ls data/processed/
```

## test the feature engineering page by creating a quick test script to ensure all functionality is preserved:
```
cd /Users/dhamodharabalaji/Desktop/Workspace/Github/MCP-Demo/src/iaas-fintech/fintech-inference-service && python test_feature_engineering.py
```

