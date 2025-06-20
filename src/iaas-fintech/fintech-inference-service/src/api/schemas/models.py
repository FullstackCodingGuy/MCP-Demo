"""
Pydantic schemas for API request/response models
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class PaymentMode(str, Enum):
    """Available payment modes"""
    CREDIT_CARD = "Credit Card"
    DEBIT_CARD = "Debit Card"
    BANK_TRANSFER = "Bank Transfer"
    UPI = "UPI"
    CASH = "Cash"
    CHECK = "Check"


class TransactionCategory(str, Enum):
    """Transaction categories"""
    GROCERY = "grocery"
    RESTAURANT = "restaurant"
    GAS = "gas"
    RETAIL = "retail"
    ENTERTAINMENT = "entertainment"
    HEALTHCARE = "healthcare"
    UTILITIES = "utilities"
    TRANSPORT = "transport"
    BANKING = "banking"
    INCOME = "income"


class RiskLevel(str, Enum):
    """Risk levels for churn prediction"""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


# Transaction Models
class TransactionInput(BaseModel):
    """Input schema for a single transaction"""
    customer_id: str = Field(..., description="Unique customer identifier")
    transaction_date: datetime = Field(..., description="Transaction timestamp")
    amount: float = Field(..., description="Transaction amount (positive for income, negative for expenses)")
    merchant: str = Field(..., description="Merchant name")
    category: TransactionCategory = Field(..., description="Transaction category")
    mode: PaymentMode = Field(..., description="Payment mode")
    location: str = Field(..., description="Transaction location")
    remarks: Optional[str] = Field(None, description="Additional remarks")


class TransactionBatch(BaseModel):
    """Batch of transactions for processing"""
    transactions: List[TransactionInput] = Field(..., description="List of transactions")


# Customer Models
class CustomerInput(BaseModel):
    """Input schema for customer data"""
    customer_id: str = Field(..., description="Unique customer identifier")
    features: Optional[Dict[str, float]] = Field(None, description="Pre-computed customer features")


class CustomerBatch(BaseModel):
    """Batch of customers for processing"""
    customers: List[CustomerInput] = Field(..., description="List of customers")


# Prediction Response Models
class ChurnPrediction(BaseModel):
    """Churn prediction response"""
    customer_id: str
    churn_probability: float = Field(..., ge=0, le=1, description="Probability of churn (0-1)")
    churn_prediction: bool = Field(..., description="Binary churn prediction")
    risk_level: RiskLevel = Field(..., description="Risk categorization")
    confidence: float = Field(..., ge=0, le=1, description="Model confidence")


class ChurnBatchResponse(BaseModel):
    """Batch churn prediction response"""
    predictions: List[ChurnPrediction]
    summary: Dict[str, Any] = Field(..., description="Batch summary statistics")


class SegmentPrediction(BaseModel):
    """Customer segment prediction response"""
    customer_id: str
    segment_id: int = Field(..., description="Assigned segment ID")
    segment_name: str = Field(..., description="Human-readable segment name")
    confidence: float = Field(..., ge=0, le=1, description="Assignment confidence")
    characteristics: Dict[str, Any] = Field(..., description="Segment characteristics")


class SegmentBatchResponse(BaseModel):
    """Batch segmentation response"""
    predictions: List[SegmentPrediction]
    segment_summary: Dict[str, Any] = Field(..., description="Segment distribution")


class FraudPrediction(BaseModel):
    """Fraud detection response"""
    transaction_id: Optional[str] = None
    customer_id: str
    fraud_probability: float = Field(..., ge=0, le=1, description="Probability of fraud (0-1)")
    fraud_prediction: bool = Field(..., description="Binary fraud prediction")
    anomaly_score: float = Field(..., description="Anomaly score")
    risk_factors: List[str] = Field(..., description="Key risk factors identified")


class FraudBatchResponse(BaseModel):
    """Batch fraud detection response"""
    predictions: List[FraudPrediction]
    summary: Dict[str, Any] = Field(..., description="Fraud detection summary")


# Model Explanation Models
class FeatureContribution(BaseModel):
    """Feature contribution for model explanation"""
    feature_name: str
    feature_value: float
    contribution: float = Field(..., description="SHAP value contribution")
    importance: float = Field(..., description="Feature importance")


class ModelExplanation(BaseModel):
    """Model explanation response"""
    prediction: Any = Field(..., description="Model prediction")
    probability: Optional[List[float]] = Field(None, description="Class probabilities")
    feature_contributions: List[FeatureContribution] = Field(..., description="Feature contributions")
    explanation_summary: str = Field(..., description="Human-readable explanation")


# Health and Status Models
class HealthResponse(BaseModel):
    """API health check response"""
    status: str = Field(..., description="Service status")
    timestamp: datetime = Field(..., description="Response timestamp")
    version: str = Field(..., description="API version")
    models_loaded: Dict[str, bool] = Field(..., description="Model loading status")


class ModelInfo(BaseModel):
    """Model information response"""
    model_name: str
    version: str
    is_trained: bool
    training_date: Optional[datetime] = None
    accuracy: Optional[float] = None
    features_count: int
    description: str


class ModelsStatusResponse(BaseModel):
    """All models status response"""
    models: List[ModelInfo]
    total_models: int
    trained_models: int


# Error Models
class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    timestamp: datetime = Field(..., description="Error timestamp")


# Batch Processing Models
class BatchProcessingRequest(BaseModel):
    """Request for batch processing"""
    data_source: str = Field(..., description="Data source (file path or database)")
    processing_type: str = Field(..., description="Type of processing (churn, segment, fraud)")
    parameters: Optional[Dict[str, Any]] = Field(None, description="Processing parameters")


class BatchProcessingResponse(BaseModel):
    """Response for batch processing"""
    job_id: str = Field(..., description="Batch job identifier")
    status: str = Field(..., description="Job status")
    total_records: int = Field(..., description="Total records to process")
    processed_records: int = Field(..., description="Records processed so far")
    results_path: Optional[str] = Field(None, description="Path to results file")
    started_at: datetime = Field(..., description="Job start time")
    estimated_completion: Optional[datetime] = Field(None, description="Estimated completion time")


# Analytics and Insights Models
class CustomerInsights(BaseModel):
    """Customer analytics insights"""
    total_customers: int
    active_customers: int
    churn_rate: float
    avg_transaction_value: float
    top_categories: List[Dict[str, Any]]
    risk_distribution: Dict[str, int]
    trends: Dict[str, Any]


class BusinessMetrics(BaseModel):
    """Business metrics response"""
    period: str = Field(..., description="Reporting period")
    metrics: Dict[str, float] = Field(..., description="Key business metrics")
    comparisons: Dict[str, float] = Field(..., description="Period-over-period changes")
    insights: List[str] = Field(..., description="Key insights and recommendations")
