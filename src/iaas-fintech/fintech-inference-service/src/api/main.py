"""
Main FastAPI application for the Fintech Inference Service
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import uvicorn
import logging
from pathlib import Path
import sys

# Add src to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from api.schemas.models import (
    HealthResponse, ChurnPrediction, ChurnBatchResponse,
    SegmentPrediction, FraudPrediction, ErrorResponse,
    TransactionInput, CustomerInput, ModelExplanation
)
from api.routes import inference, health
from utils.config import settings

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format=settings.log_format
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="AI-powered inference service for banking and fintech applications",
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors"""
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="internal_server_error",
            message="An internal server error occurred",
            timestamp=datetime.now()
        ).dict()
    )

# Include routers
app.include_router(health.router, prefix="", tags=["Health"])
app.include_router(inference.router, prefix=settings.api_prefix, tags=["Inference"])

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "healthy",
        "documentation": "/docs",
        "health_check": "/health"
    }

# Model management endpoints
@app.get("/models/status")
async def get_models_status():
    """Get status of all loaded models"""
    try:
        # This would typically load model status from a model registry
        models_status = {
            "churn_prediction": True,
            "customer_segmentation": True,
            "fraud_detection": True
        }
        
        return {
            "models": models_status,
            "total_models": len(models_status),
            "loaded_models": sum(models_status.values()),
            "timestamp": datetime.now()
        }
    except Exception as e:
        logger.error(f"Error getting models status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get models status")

@app.post("/models/reload")
async def reload_models(background_tasks: BackgroundTasks):
    """Reload all models (background task)"""
    try:
        background_tasks.add_task(reload_models_task)
        return {
            "message": "Model reload initiated",
            "status": "in_progress",
            "timestamp": datetime.now()
        }
    except Exception as e:
        logger.error(f"Error initiating model reload: {e}")
        raise HTTPException(status_code=500, detail="Failed to initiate model reload")

async def reload_models_task():
    """Background task to reload models"""
    try:
        logger.info("Starting model reload...")
        # Model reload logic would go here
        logger.info("Model reload completed")
    except Exception as e:
        logger.error(f"Model reload failed: {e}")

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    
    # Create necessary directories
    settings.model_path.mkdir(parents=True, exist_ok=True)
    settings.data_path.mkdir(parents=True, exist_ok=True)
    
    # Initialize models (in production, load pre-trained models)
    logger.info("Application startup completed")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    logger.info("Shutting down application")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
