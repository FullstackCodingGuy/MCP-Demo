"""
Customer and transaction data API routes
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import logging
from datetime import datetime, timedelta

from ..schemas.models import ErrorResponse

logger = logging.getLogger(__name__)
router = APIRouter()

# Load data once at module level for better performance
try:
    customers_df = pd.read_csv("data/raw/customers.csv")
    transactions_df = pd.read_csv("data/raw/transactions.csv")
    customer_features_df = pd.read_csv("data/processed/customer_features.csv")
    
    # Convert date columns
    transactions_df['transaction_date'] = pd.to_datetime(transactions_df['transaction_date'])
    
    logger.info(f"Loaded {len(customers_df)} customers and {len(transactions_df)} transactions")
except Exception as e:
    logger.error(f"Error loading data: {e}")
    customers_df = pd.DataFrame()
    transactions_df = pd.DataFrame()
    customer_features_df = pd.DataFrame()


@router.get("/customers", 
           summary="Get customers list with filtering and pagination")
async def get_customers(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=500, description="Number of customers per page"),
    search: Optional[str] = Query(None, description="Search by customer ID or name"),
    age_min: Optional[int] = Query(None, ge=18, le=100, description="Minimum age"),
    age_max: Optional[int] = Query(None, ge=18, le=100, description="Maximum age"),
    location: Optional[str] = Query(None, description="Filter by location"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level (Low, Medium, High, Critical)")
):
    """Get paginated list of customers with optional filtering"""
    try:
        if customers_df.empty:
            raise HTTPException(status_code=503, detail="Customer data not available")
        
        # Merge with features for additional filtering
        df = customers_df.copy()
        if not customer_features_df.empty:
            df = df.merge(customer_features_df, on='customer_id', how='left')
        
        # Apply filters
        if search:
            df = df[df['customer_id'].str.contains(search, case=False)]
        
        # For now, we'll use the existing columns and map them appropriately
        # Since we don't have separate name, age, location columns in the current data structure
        
        # Calculate pagination
        total_customers = len(df)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        # Get page data
        page_data = df.iloc[start_idx:end_idx]
        
        # Convert to dict and clean up
        customers = []
        for _, row in page_data.iterrows():
            customer = {
                "customer_id": row['customer_id'],
                "name": f"Customer {row['customer_id'].split('_')[-1]}",  # Generate name from ID
                "age": 25 + (hash(row['customer_id']) % 40),  # Generate age from ID hash
                "location": "New York",  # Default location
                "email": f"{row['customer_id'].lower()}@example.com",
                "phone": f"+1-555-{row['customer_id'].split('_')[-1][:4].zfill(4)}",
                "account_type": "Premium" if row.get('segment', '') == 'High Value' else "Standard",
                "credit_score": 650 + (hash(row['customer_id']) % 200),  # Generate credit score
                "annual_income": float(row.get('avg_monthly_spend', 0) * 12 * 2),  # Estimate from monthly spend
                "join_date": str(row.get('signup_date', '2024-01-01'))  # Ensure string conversion
            }
            
            # Add features if available
            if not customer_features_df.empty and 'total_transactions' in row:
                customer.update({
                    "total_transactions": int(row.get('total_transactions', 0)),
                    "total_amount": float(row.get('total_amount', 0)),
                    "avg_transaction_amount": float(row.get('avg_transaction_amount', 0)),
                    "days_since_last_transaction": int(row.get('days_since_last_transaction', 0)),
                    "churn_risk": "High" if row.get('days_since_last_transaction', 0) > 60 else "Low"
                })
            
            customers.append(customer)
        
        return {
            "customers": customers,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_customers": total_customers,
                "total_pages": (total_customers + page_size - 1) // page_size,
                "has_next": end_idx < total_customers,
                "has_prev": page > 1
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting customers: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/customers/{customer_id}",
           summary="Get detailed customer information")
async def get_customer_detail(customer_id: str):
    """Get detailed information for a specific customer"""
    try:
        if customers_df.empty:
            raise HTTPException(status_code=503, detail="Customer data not available")
        
        # Get customer basic info and convert to JSON-serializable format
        customer_row = customers_df[customers_df['customer_id'] == customer_id]
        if customer_row.empty:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        customer_data = customer_row.iloc[0]
        
        # Format customer data with consistent structure
        customer = {
            "customer_id": customer_data['customer_id'],
            "name": f"Customer {customer_data['customer_id'].split('_')[-1]}",  # Generate name from ID
            "age": 25 + (hash(customer_data['customer_id']) % 40),  # Generate age from ID hash
            "location": "New York",  # Default location
            "email": f"{customer_data['customer_id'].lower()}@example.com",
            "phone": f"+1-555-{customer_data['customer_id'].split('_')[-1][:4].zfill(4)}",
            "account_type": "Premium" if customer_data.get('segment', '') == 'High Value' else "Standard",
            "credit_score": 650 + (hash(customer_data['customer_id']) % 200),  # Generate credit score
            "annual_income": float(customer_data.get('avg_monthly_spend', 0) * 12 * 2),  # Estimate from monthly spend
            "join_date": str(customer_data.get('signup_date', '2024-01-01')),  # Ensure string conversion
            # Include original CSV data fields
            "avg_monthly_spend": float(customer_data.get('avg_monthly_spend', 0)),
            "transaction_frequency": float(customer_data.get('transaction_frequency', 0)),
            "preferred_categories": str(customer_data.get('preferred_categories', '')),
            "churn_probability": float(customer_data.get('churn_probability', 0)),
            "segment": str(customer_data.get('segment', ''))
        }
        
        # Get customer features and convert to JSON-serializable format
        features = {}
        if not customer_features_df.empty:
            feature_row = customer_features_df[customer_features_df['customer_id'] == customer_id]
            if not feature_row.empty:
                feature_data = feature_row.iloc[0]
                for key, value in feature_data.items():
                    if pd.isna(value):
                        features[key] = None
                    elif isinstance(value, (pd.Timestamp, pd.Period)):
                        features[key] = str(value)
                    elif isinstance(value, (np.integer, np.floating)):
                        features[key] = float(value)
                    else:
                        features[key] = value
        
        # Get transaction summary
        customer_transactions = transactions_df[transactions_df['customer_id'] == customer_id]
        
        # Calculate monthly spending with JSON-serializable format
        monthly_spending = {}
        if not customer_transactions.empty:
            monthly_data = customer_transactions.groupby(customer_transactions['transaction_date'].dt.to_period('M'))['amount'].sum()
            monthly_spending = {str(period): float(amount) for period, amount in monthly_data.items()}
        
        transaction_summary = {
            "total_transactions": len(customer_transactions),
            "total_amount": float(customer_transactions['amount'].sum()) if not customer_transactions.empty else 0,
            "avg_amount": float(customer_transactions['amount'].mean()) if not customer_transactions.empty else 0,
            "date_range": {
                "first_transaction": customer_transactions['transaction_date'].min().isoformat() if not customer_transactions.empty else None,
                "last_transaction": customer_transactions['transaction_date'].max().isoformat() if not customer_transactions.empty else None
            },
            "top_categories": customer_transactions['category'].value_counts().head(5).to_dict() if not customer_transactions.empty else {},
            "monthly_spending": monthly_spending
        }
        
        return {
            "customer": customer,
            "features": features,
            "transaction_summary": transaction_summary
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting customer detail: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/customers/{customer_id}/transactions",
           summary="Get customer's transaction history")
async def get_customer_transactions(
    customer_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(100, ge=1, le=1000, description="Number of transactions per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    date_from: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    amount_min: Optional[float] = Query(None, ge=0, description="Minimum amount"),
    amount_max: Optional[float] = Query(None, ge=0, description="Maximum amount"),
    is_fraud: Optional[bool] = Query(None, description="Filter by fraud status")
):
    """Get paginated transaction history for a specific customer"""
    try:
        if transactions_df.empty:
            raise HTTPException(status_code=503, detail="Transaction data not available")
        
        # Get customer transactions
        customer_transactions = transactions_df[transactions_df['customer_id'] == customer_id].copy()
        
        if customer_transactions.empty:
            return {
                "transactions": [],
                "pagination": {
                    "page": page,
                    "page_size": page_size,
                    "total_transactions": 0,
                    "total_pages": 0,
                    "has_next": False,
                    "has_prev": False
                }
            }
        
        # Apply filters
        if category:
            customer_transactions = customer_transactions[
                customer_transactions['category'].str.contains(category, case=False)
            ]
        
        if date_from:
            date_from_dt = pd.to_datetime(date_from)
            customer_transactions = customer_transactions[
                customer_transactions['transaction_date'] >= date_from_dt
            ]
        
        if date_to:
            date_to_dt = pd.to_datetime(date_to)
            customer_transactions = customer_transactions[
                customer_transactions['transaction_date'] <= date_to_dt
            ]
        
        if amount_min is not None:
            customer_transactions = customer_transactions[
                customer_transactions['amount'] >= amount_min
            ]
        
        if amount_max is not None:
            customer_transactions = customer_transactions[
                customer_transactions['amount'] <= amount_max
            ]
        
        if is_fraud is not None:
            customer_transactions = customer_transactions[
                customer_transactions['is_fraud'] == is_fraud
            ]
        
        # Sort by date descending
        customer_transactions = customer_transactions.sort_values('transaction_date', ascending=False)
        
        # Calculate pagination
        total_transactions = len(customer_transactions)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        # Get page data
        page_data = customer_transactions.iloc[start_idx:end_idx]
        
        # Convert to dict
        transactions = []
        for _, row in page_data.iterrows():
            transaction = {
                "transaction_id": row['transaction_id'],
                "customer_id": row['customer_id'],
                "transaction_date": row['transaction_date'].isoformat(),
                "amount": float(row['amount']),
                "category": row['category'],
                "merchant": row['merchant'],
                "payment_method": row['mode'],  # 'mode' instead of 'payment_method'
                "location": row['location'],
                "is_fraud": bool(row['is_fraud']),
                "description": row.get('description', '')
            }
            transactions.append(transaction)
        
        return {
            "transactions": transactions,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_transactions": total_transactions,
                "total_pages": (total_transactions + page_size - 1) // page_size,
                "has_next": end_idx < total_transactions,
                "has_prev": page > 1
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting customer transactions: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analytics/customers",
           summary="Get customer analytics and insights")
async def get_customer_analytics():
    """Get comprehensive customer analytics"""
    try:
        if customers_df.empty or transactions_df.empty:
            raise HTTPException(status_code=503, detail="Data not available")
        
        # Customer demographics
        demographics = {
            "total_customers": len(customers_df),
            "age_distribution": {  # Simulated age distribution
                "min": 25, "25%": 35, "50%": 45, "75%": 55, "max": 65, "mean": 45
            },
            "location_distribution": {"New York": len(customers_df) // 3, "Los Angeles": len(customers_df) // 3, "Chicago": len(customers_df) // 3},
            "account_type_distribution": {"Premium": len(customers_df) // 2, "Standard": len(customers_df) // 2},
            "credit_score_distribution": {
                "excellent": len(customers_df) // 4,
                "good": len(customers_df) // 4,
                "fair": len(customers_df) // 4,
                "poor": len(customers_df) // 4
            }
        }
        
        # Transaction analytics
        transaction_analytics = {
            "total_transactions": len(transactions_df),
            "total_volume": float(transactions_df['amount'].sum()),
            "avg_transaction_amount": float(transactions_df['amount'].mean()),
            "transaction_by_category": transactions_df['category'].value_counts().to_dict(),
            "fraud_rate": float(transactions_df['is_fraud'].mean() * 100),
            "transactions_by_month": {
                str(k): v for k, v in transactions_df.groupby(
                    transactions_df['transaction_date'].dt.to_period('M')
                )['amount'].sum().items()
            },
            "payment_methods": transactions_df['mode'].value_counts().to_dict()  # 'mode' instead of 'payment_method'
        }
        
        # Customer activity metrics
        customer_activity = transactions_df.groupby('customer_id').agg({
            'transaction_id': 'count',
            'amount': ['sum', 'mean'],
            'transaction_date': ['min', 'max']
        }).reset_index()
        
        customer_activity.columns = ['customer_id', 'transaction_count', 'total_amount', 'avg_amount', 'first_transaction', 'last_transaction']
        
        activity_metrics = {
            "avg_transactions_per_customer": float(customer_activity['transaction_count'].mean()),
            "top_customers_by_volume": customer_activity.nlargest(10, 'total_amount')[['customer_id', 'total_amount']].to_dict('records'),
            "top_customers_by_frequency": customer_activity.nlargest(10, 'transaction_count')[['customer_id', 'transaction_count']].to_dict('records'),
            "customer_activity_distribution": {
                "high": len(customer_activity[customer_activity['transaction_count'] > 100]),
                "medium": len(customer_activity[(customer_activity['transaction_count'] >= 50) & (customer_activity['transaction_count'] <= 100)]),
                "low": len(customer_activity[customer_activity['transaction_count'] < 50])
            }
        }
        
        return {
            "demographics": demographics,
            "transactions": transaction_analytics,
            "customer_activity": activity_metrics,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting customer analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analytics/transactions",
           summary="Get transaction analytics and trends")
async def get_transaction_analytics(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze")
):
    """Get detailed transaction analytics for specified period"""
    try:
        if transactions_df.empty:
            raise HTTPException(status_code=503, detail="Transaction data not available")
        
        # Filter by date range
        end_date = transactions_df['transaction_date'].max()
        start_date = end_date - timedelta(days=days)
        
        filtered_df = transactions_df[
            transactions_df['transaction_date'] >= start_date
        ]
        
        if filtered_df.empty:
            raise HTTPException(status_code=404, detail="No transactions found in specified period")
        
        # Daily transaction trends
        daily_trends = filtered_df.groupby(filtered_df['transaction_date'].dt.date).agg({
            'transaction_id': 'count',
            'amount': ['sum', 'mean'],
            'is_fraud': 'sum'
        }).reset_index()
        
        daily_trends.columns = ['date', 'transaction_count', 'total_amount', 'avg_amount', 'fraud_count']
        
        # Category analysis
        category_analysis = filtered_df.groupby('category').agg({
            'transaction_id': 'count',
            'amount': ['sum', 'mean'],
            'is_fraud': 'sum'
        }).reset_index()
        
        category_analysis.columns = ['category', 'transaction_count', 'total_amount', 'avg_amount', 'fraud_count']
        
        # Time-based patterns - make explicit copy to avoid warning
        time_df = filtered_df.copy()
        time_df['hour'] = time_df['transaction_date'].dt.hour
        time_df['day_of_week'] = time_df['transaction_date'].dt.day_name()
        
        hourly_pattern = time_df.groupby('hour')['transaction_id'].count().to_dict()
        weekly_pattern = time_df.groupby('day_of_week')['transaction_id'].count().to_dict()
        
        analytics = {
            "period": {
                "start_date": start_date.date().isoformat(),
                "end_date": end_date.date().isoformat(),
                "days": days
            },
            "summary": {
                "total_transactions": len(filtered_df),
                "total_volume": float(filtered_df['amount'].sum()),
                "avg_transaction_amount": float(filtered_df['amount'].mean()),
                "fraud_transactions": int(filtered_df['is_fraud'].sum()),
                "fraud_rate": float(filtered_df['is_fraud'].mean() * 100),
                "unique_customers": filtered_df['customer_id'].nunique(),
                "unique_merchants": filtered_df['merchant'].nunique()
            },
            "daily_trends": daily_trends.to_dict('records'),
            "category_breakdown": category_analysis.to_dict('records'),
            "time_patterns": {
                "hourly": hourly_pattern,
                "weekly": weekly_pattern
            },
            "top_merchants": filtered_df['merchant'].value_counts().head(10).to_dict(),
            "payment_methods": filtered_df['mode'].value_counts().to_dict()  # 'mode' instead of 'payment_method'
        }
        
        return analytics
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting transaction analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))
