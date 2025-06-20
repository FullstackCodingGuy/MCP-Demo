#!/usr/bin/env python3
"""
Startup script for the Fintech Inference Service API
"""

import sys
import os
from pathlib import Path

# Add src directory to Python path
project_root = Path(__file__).parent
src_path = project_root / "src"
sys.path.insert(0, str(src_path))

# Import and start the app
if __name__ == "__main__":
    import uvicorn
    from api.main import app
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True
    )
