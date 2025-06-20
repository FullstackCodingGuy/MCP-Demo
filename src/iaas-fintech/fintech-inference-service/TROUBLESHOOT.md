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
