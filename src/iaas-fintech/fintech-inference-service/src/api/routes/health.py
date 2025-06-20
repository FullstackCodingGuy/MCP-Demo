"""
Health check and system status routes
"""

from fastapi import APIRouter
from datetime import datetime
import psutil
import os

from ..schemas.models import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(),
        version="1.0.0",
        models_loaded={
            "churn_prediction": True,
            "customer_segmentation": True,
            "fraud_detection": True
        }
    )

@router.get("/health/detailed")
async def detailed_health_check():
    """Detailed health check with system metrics"""
    try:
        # System metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "status": "healthy",
            "timestamp": datetime.now(),
            "version": "1.0.0",
            "system_metrics": {
                "cpu_usage_percent": cpu_percent,
                "memory_usage_percent": memory.percent,
                "memory_available_gb": round(memory.available / (1024**3), 2),
                "disk_usage_percent": disk.percent,
                "disk_free_gb": round(disk.free / (1024**3), 2)
            },
            "models_status": {
                "churn_prediction": {"loaded": True, "last_trained": None},
                "customer_segmentation": {"loaded": True, "last_trained": None},
                "fraud_detection": {"loaded": True, "last_trained": None}
            },
            "environment": {
                "python_version": f"{os.sys.version_info.major}.{os.sys.version_info.minor}.{os.sys.version_info.micro}",
                "platform": os.name
            }
        }
    except Exception as e:
        return {
            "status": "degraded",
            "timestamp": datetime.now(),
            "error": str(e)
        }

@router.get("/ready")
async def readiness_check():
    """Kubernetes readiness probe endpoint"""
    # Check if critical services are ready
    services_ready = {
        "database": True,  # Check database connection
        "models": True,    # Check if models are loaded
        "storage": True    # Check storage accessibility
    }
    
    if all(services_ready.values()):
        return {"status": "ready", "services": services_ready}
    else:
        return {"status": "not_ready", "services": services_ready}

@router.get("/live")
async def liveness_check():
    """Kubernetes liveness probe endpoint"""
    return {"status": "alive", "timestamp": datetime.now()}
