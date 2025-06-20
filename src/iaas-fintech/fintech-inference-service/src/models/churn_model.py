"""
Customer churn prediction model
"""

import pandas as pd
import numpy as np
from typing import Tuple
try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    from sklearn.ensemble import RandomForestClassifier as XGBClassifier
    XGBOOST_AVAILABLE = False
    print("XGBoost not available, falling back to RandomForestClassifier")
from sklearn.preprocessing import LabelEncoder

from .base_model import BaseModel


class ChurnPredictionModel(BaseModel):
    """Model to predict customer churn based on transaction behavior"""
    
    def __init__(self, model_path: str = "../data/models"):
        """Initialize churn prediction model"""
        super().__init__("churn_prediction", model_path)
        self.target_column = "is_churned"
        self.label_encoders = {}
    
    def create_model(self) -> XGBClassifier:
        """Create XGBoost classifier for churn prediction"""
        return XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric='logloss'
        )
    
    def prepare_features(self, data: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """Prepare features for churn prediction"""
        
        # If this is raw transaction data, we need to engineer features first
        if "customer_id" in data.columns and "transaction_date" in data.columns:
            data = self._engineer_churn_features(data)
        
        # Define churn based on recency (if not already defined)
        if self.target_column not in data.columns:
            # Consider customer churned if no transactions in last 30 days
            data[self.target_column] = (data.get("days_since_last_transaction", 0) > 30).astype(int)
        
        # Select relevant features for churn prediction
        feature_columns = [
            # Recency features
            "days_since_last_transaction",
            "days_since_first_transaction",
            "customer_lifetime_days",
            
            # Frequency features
            "total_transactions",
            "avg_transactions_per_month",
            "unique_merchants",
            "unique_categories",
            
            # Monetary features
            "total_amount",
            "avg_transaction_amount",
            "std_transaction_amount",
            "total_expenses",
            "total_income",
            "net_cash_flow",
            
            # Category spending
            "grocery_total_spend",
            "restaurant_total_spend",
            "gas_total_spend",
            "retail_total_spend",
            "entertainment_total_spend",
            
            # Behavioral features
            "payment_mode_diversity",
            "location_diversity",
            "merchant_loyalty_score",
            "weekend_transaction_ratio",
            
            # Trend features
            "monthly_spending_trend",
            "monthly_frequency_trend",
            "spending_volatility",
        ]
        
        # Select available features
        available_features = [col for col in feature_columns if col in data.columns]
        
        if len(available_features) == 0:
            raise ValueError("No suitable features found for churn prediction")
        
        X = data[available_features].copy()
        y = data[self.target_column]
        
        # Handle missing values
        X = X.fillna(0)
        
        # Encode categorical features if any
        categorical_columns = X.select_dtypes(include=['object']).columns
        for col in categorical_columns:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                X[col] = self.label_encoders[col].fit_transform(X[col].astype(str))
            else:
                # Handle unseen categories
                known_categories = set(self.label_encoders[col].classes_)
                X[col] = X[col].apply(lambda x: x if x in known_categories else 'unknown')
                
                # Add 'unknown' to encoder if not present
                if 'unknown' not in known_categories:
                    new_classes = list(self.label_encoders[col].classes_) + ['unknown']
                    self.label_encoders[col].classes_ = np.array(new_classes)
                
                X[col] = self.label_encoders[col].transform(X[col].astype(str))
        
        print(f"Prepared {len(X.columns)} features for churn prediction")
        print(f"Churn rate: {y.mean():.2%}")
        
        return X, y
    
    def _engineer_churn_features(self, transaction_data: pd.DataFrame) -> pd.DataFrame:
        """Engineer features from raw transaction data for churn prediction"""
        from ..data.feature_engineering import FeatureEngineer
        
        feature_engineer = FeatureEngineer()
        customer_features = feature_engineer.create_customer_features(transaction_data)
        
        return customer_features
    
    def predict_churn_probability(self, customer_data: pd.DataFrame) -> pd.DataFrame:
        """Predict churn probability for customers"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Get probabilities
        proba = self.predict_proba(customer_data)
        
        # Create results dataframe
        results = pd.DataFrame({
            "customer_id": customer_data.get("customer_id", range(len(customer_data))),
            "churn_probability": proba[:, 1],
            "churn_prediction": proba[:, 1] > 0.5,
            "risk_level": self._categorize_risk(proba[:, 1])
        })
        
        return results
    
    def _categorize_risk(self, probabilities: np.ndarray) -> np.ndarray:
        """Categorize churn risk into levels"""
        risk_levels = np.full(len(probabilities), "Low", dtype=object)
        risk_levels[probabilities >= 0.3] = "Medium"
        risk_levels[probabilities >= 0.6] = "High"
        risk_levels[probabilities >= 0.8] = "Critical"
        
        return risk_levels
    
    def get_churn_insights(self, customer_data: pd.DataFrame) -> dict:
        """Get insights about churn factors"""
        if not self.is_trained:
            raise ValueError("Model must be trained before generating insights")
        
        churn_predictions = self.predict_churn_probability(customer_data)
        
        insights = {
            "total_customers": len(customer_data),
            "predicted_churners": int(churn_predictions["churn_prediction"].sum()),
            "churn_rate": float(churn_predictions["churn_prediction"].mean()),
            "avg_churn_probability": float(churn_predictions["churn_probability"].mean()),
            "risk_distribution": churn_predictions["risk_level"].value_counts().to_dict()
        }
        
        # Top risk factors from feature importance
        if self.feature_importance is not None:
            insights["top_risk_factors"] = self.feature_importance.head(5).to_dict("records")
        
        return insights


def main():
    """Test churn prediction model"""
    try:
        # Load customer features
        customer_features = pd.read_csv("../../data/processed/customer_features.csv")
        print(f"Loaded customer features: {customer_features.shape}")
        
        # Initialize and train model
        churn_model = ChurnPredictionModel()
        metrics = churn_model.train(customer_features)
        
        print("\nTraining Metrics:")
        for metric, value in metrics.items():
            print(f"{metric}: {value:.3f}")
        
        # Save model
        churn_model.save_model()
        
        # Test predictions
        sample_customers = customer_features.head(10)
        predictions = churn_model.predict_churn_probability(sample_customers)
        print("\nSample Predictions:")
        print(predictions)
        
        # Get insights
        insights = churn_model.get_churn_insights(customer_features)
        print("\nChurn Insights:")
        for key, value in insights.items():
            print(f"{key}: {value}")
        
        print("\nChurn prediction model trained successfully!")
        
    except FileNotFoundError:
        print("Please run feature_engineering.py first to create customer features")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
