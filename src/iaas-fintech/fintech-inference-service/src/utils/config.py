"""
Configuration settings for the Fintech Inference Service
"""

import os
from pathlib import Path
from typing import Optional

from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # App Configuration
    app_name: str = "Fintech Inference Service"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_prefix: str = "/api/v1"
    
    # Database Configuration
    database_url: str = "sqlite:///./data/fintech.db"
    
    # Model Configuration
    model_path: Path = Path("./data/models")
    data_path: Path = Path("./data")
    raw_data_path: Path = Path("./data/raw")
    processed_data_path: Path = Path("./data/processed")
    
    # ML Model Parameters
    random_state: int = 42
    test_size: float = 0.2
    cv_folds: int = 5
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Feature Engineering
    lookback_days: int = 90
    min_transactions: int = 5
    
    # Model Thresholds
    churn_threshold: float = 0.5
    fraud_threshold: float = 0.3
    n_segments: int = 5
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()

# Create necessary directories
settings.model_path.mkdir(parents=True, exist_ok=True)
settings.data_path.mkdir(parents=True, exist_ok=True)
settings.raw_data_path.mkdir(parents=True, exist_ok=True)
settings.processed_data_path.mkdir(parents=True, exist_ok=True)
