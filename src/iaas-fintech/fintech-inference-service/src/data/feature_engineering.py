"""
Feature engineering module for transaction data
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
from datetime import datetime, timedelta


class FeatureEngineer:
    """Extract and engineer features from transaction data for ML models"""
    
    def __init__(self, lookback_days: int = 90):
        """Initialize feature engineer with lookback period"""
        self.lookback_days = lookback_days
    
    def create_customer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create customer-level features from transaction data"""
        
        print("Engineering customer features...")
        
        # Ensure proper data types
        df["transaction_date"] = pd.to_datetime(df["transaction_date"])
        df["amount"] = pd.to_numeric(df["amount"])
        
        # Calculate reference date (usually the latest date in data)
        reference_date = df["transaction_date"].max()
        
        customer_features = []
        
        for customer_id in df["customer_id"].unique():
            customer_data = df[df["customer_id"] == customer_id].copy()
            customer_data = customer_data.sort_values("transaction_date")
            
            # Basic customer info
            features = {"customer_id": customer_id}
            
            # === RECENCY FEATURES ===
            features.update(self._calculate_recency_features(customer_data, reference_date))
            
            # === FREQUENCY FEATURES ===
            features.update(self._calculate_frequency_features(customer_data))
            
            # === MONETARY FEATURES ===
            features.update(self._calculate_monetary_features(customer_data))
            
            # === CATEGORY FEATURES ===
            features.update(self._calculate_category_features(customer_data))
            
            # === TEMPORAL FEATURES ===
            features.update(self._calculate_temporal_features(customer_data))
            
            # === TREND FEATURES ===
            features.update(self._calculate_trend_features(customer_data))
            
            # === BEHAVIORAL FEATURES ===
            features.update(self._calculate_behavioral_features(customer_data))
            
            customer_features.append(features)
        
        feature_df = pd.DataFrame(customer_features)
        
        # Fill missing values
        feature_df = feature_df.fillna(0)
        
        print(f"Created {len(feature_df.columns)-1} features for {len(feature_df)} customers")
        
        return feature_df
    
    def _calculate_recency_features(self, customer_data: pd.DataFrame, reference_date: datetime) -> Dict:
        """Calculate recency-based features"""
        features = {}
        
        if len(customer_data) == 0:
            return features
        
        last_transaction = customer_data["transaction_date"].max()
        first_transaction = customer_data["transaction_date"].min()
        
        features["days_since_last_transaction"] = (reference_date - last_transaction).days
        features["days_since_first_transaction"] = (reference_date - first_transaction).days
        features["customer_lifetime_days"] = (last_transaction - first_transaction).days
        
        return features
    
    def _calculate_frequency_features(self, customer_data: pd.DataFrame) -> Dict:
        """Calculate frequency-based features"""
        features = {}
        
        features["total_transactions"] = len(customer_data)
        features["unique_merchants"] = customer_data["merchant"].nunique()
        features["unique_categories"] = customer_data["category"].nunique()
        features["unique_locations"] = customer_data["location"].nunique()
        
        # Transaction frequency by period
        if len(customer_data) > 0:
            date_range = (customer_data["transaction_date"].max() - customer_data["transaction_date"].min()).days
            if date_range > 0:
                features["avg_transactions_per_day"] = len(customer_data) / date_range
                features["avg_transactions_per_week"] = len(customer_data) / (date_range / 7)
                features["avg_transactions_per_month"] = len(customer_data) / (date_range / 30)
        
        return features
    
    def _calculate_monetary_features(self, customer_data: pd.DataFrame) -> Dict:
        """Calculate monetary features"""
        features = {}
        
        if len(customer_data) == 0:
            return features
        
        # Separate income and expenses
        expenses = customer_data[customer_data["amount"] < 0]["amount"]
        income = customer_data[customer_data["amount"] > 0]["amount"]
        
        # Overall monetary features
        features["total_amount"] = customer_data["amount"].sum()
        features["avg_transaction_amount"] = customer_data["amount"].mean()
        features["median_transaction_amount"] = customer_data["amount"].median()
        features["std_transaction_amount"] = customer_data["amount"].std()
        features["min_transaction_amount"] = customer_data["amount"].min()
        features["max_transaction_amount"] = customer_data["amount"].max()
        
        # Expense features
        if len(expenses) > 0:
            features["total_expenses"] = expenses.sum()
            features["avg_expense_amount"] = expenses.mean()
            features["max_expense_amount"] = expenses.min()  # Most negative (largest expense)
            features["expense_transaction_count"] = len(expenses)
        
        # Income features
        if len(income) > 0:
            features["total_income"] = income.sum()
            features["avg_income_amount"] = income.mean()
            features["max_income_amount"] = income.max()
            features["income_transaction_count"] = len(income)
        
        # Financial health indicators
        if len(income) > 0 and len(expenses) > 0:
            features["net_cash_flow"] = income.sum() + expenses.sum()  # expenses are negative
            features["income_expense_ratio"] = income.sum() / abs(expenses.sum())
            features["savings_rate"] = features["net_cash_flow"] / income.sum() if income.sum() > 0 else 0
        
        return features
    
    def _calculate_category_features(self, customer_data: pd.DataFrame) -> Dict:
        """Calculate category-based spending features"""
        features = {}
        
        if len(customer_data) == 0:
            return features
        
        # Spending by category
        category_spending = customer_data.groupby("category")["amount"].agg(["sum", "count", "mean"])
        
        # Major categories
        major_categories = ["grocery", "restaurant", "gas", "retail", "entertainment"]
        
        for category in major_categories:
            if category in category_spending.index:
                features[f"{category}_total_spend"] = category_spending.loc[category, "sum"]
                features[f"{category}_transaction_count"] = category_spending.loc[category, "count"]
                features[f"{category}_avg_amount"] = category_spending.loc[category, "mean"]
            else:
                features[f"{category}_total_spend"] = 0
                features[f"{category}_transaction_count"] = 0
                features[f"{category}_avg_amount"] = 0
        
        # Category diversity
        total_spending = abs(customer_data[customer_data["amount"] < 0]["amount"].sum())
        if total_spending > 0:
            for category in major_categories:
                category_spend = abs(category_spending.loc[category, "sum"]) if category in category_spending.index else 0
                features[f"{category}_spend_percentage"] = category_spend / total_spending
        
        # Most frequent category
        most_frequent_category = customer_data["category"].mode()
        features["most_frequent_category"] = most_frequent_category[0] if len(most_frequent_category) > 0 else "unknown"
        
        return features
    
    def _calculate_temporal_features(self, customer_data: pd.DataFrame) -> Dict:
        """Calculate temporal patterns in transactions"""
        features = {}
        
        if len(customer_data) == 0:
            return features
        
        # Add temporal columns
        customer_data["hour"] = customer_data["transaction_date"].dt.hour
        customer_data["day_of_week"] = customer_data["transaction_date"].dt.dayofweek
        customer_data["is_weekend"] = customer_data["day_of_week"].isin([5, 6])
        
        # Hourly patterns
        features["avg_transaction_hour"] = customer_data["hour"].mean()
        features["most_common_hour"] = customer_data["hour"].mode()[0] if len(customer_data["hour"].mode()) > 0 else 12
        
        # Weekly patterns
        features["weekend_transaction_ratio"] = customer_data["is_weekend"].mean()
        features["most_common_day"] = customer_data["day_of_week"].mode()[0] if len(customer_data["day_of_week"].mode()) > 0 else 0
        
        # Time-based spending patterns
        weekend_spending = customer_data[customer_data["is_weekend"]]["amount"].sum()
        weekday_spending = customer_data[~customer_data["is_weekend"]]["amount"].sum()
        
        if weekday_spending != 0:
            features["weekend_weekday_spending_ratio"] = weekend_spending / weekday_spending
        
        return features
    
    def _calculate_trend_features(self, customer_data: pd.DataFrame) -> Dict:
        """Calculate trend features over time"""
        features = {}
        
        if len(customer_data) < 2:
            return features
        
        # Sort by date
        customer_data = customer_data.sort_values("transaction_date")
        
        # Monthly aggregation
        customer_data["year_month"] = customer_data["transaction_date"].dt.to_period("M")
        monthly_stats = customer_data.groupby("year_month").agg({
            "amount": ["sum", "count", "mean"],
            "transaction_date": "count"
        }).reset_index()
        
        if len(monthly_stats) >= 2:
            # Spending trend
            monthly_spending = monthly_stats["amount"]["sum"].values
            if len(monthly_spending) >= 2:
                spending_trend = np.polyfit(range(len(monthly_spending)), monthly_spending, 1)[0]
                features["monthly_spending_trend"] = spending_trend
            
            # Transaction frequency trend
            monthly_counts = monthly_stats["amount"]["count"].values
            if len(monthly_counts) >= 2:
                frequency_trend = np.polyfit(range(len(monthly_counts)), monthly_counts, 1)[0]
                features["monthly_frequency_trend"] = frequency_trend
            
            # Volatility measures
            features["spending_volatility"] = np.std(monthly_spending)
            features["frequency_volatility"] = np.std(monthly_counts)
        
        return features
    
    def _calculate_behavioral_features(self, customer_data: pd.DataFrame) -> Dict:
        """Calculate behavioral and pattern features"""
        features = {}
        
        if len(customer_data) == 0:
            return features
        
        # Payment mode preferences
        mode_counts = customer_data["mode"].value_counts()
        features["most_used_payment_mode"] = mode_counts.index[0] if len(mode_counts) > 0 else "unknown"
        features["payment_mode_diversity"] = customer_data["mode"].nunique()
        
        # Location patterns
        features["location_diversity"] = customer_data["location"].nunique()
        location_counts = customer_data["location"].value_counts()
        features["most_common_location"] = location_counts.index[0] if len(location_counts) > 0 else "unknown"
        
        # Merchant loyalty
        merchant_counts = customer_data["merchant"].value_counts()
        if len(merchant_counts) > 0:
            features["merchant_loyalty_score"] = merchant_counts.iloc[0] / len(customer_data)
            features["top_merchant"] = merchant_counts.index[0]
        
        # Transaction size patterns
        small_transactions = (customer_data["amount"].abs() < 50).sum()
        medium_transactions = ((customer_data["amount"].abs() >= 50) & (customer_data["amount"].abs() < 200)).sum()
        large_transactions = (customer_data["amount"].abs() >= 200).sum()
        
        total_transactions = len(customer_data)
        if total_transactions > 0:
            features["small_transaction_ratio"] = small_transactions / total_transactions
            features["medium_transaction_ratio"] = medium_transactions / total_transactions
            features["large_transaction_ratio"] = large_transactions / total_transactions
        
        return features
    
    def create_transaction_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create transaction-level features for fraud detection"""
        
        print("Engineering transaction-level features...")
        
        df = df.copy()
        df["transaction_date"] = pd.to_datetime(df["transaction_date"])
        
        # Sort by customer and date
        df = df.sort_values(["customer_id", "transaction_date"])
        
        transaction_features = []
        
        for customer_id in df["customer_id"].unique():
            customer_data = df[df["customer_id"] == customer_id].copy()
            
            for idx, row in customer_data.iterrows():
                features = {}
                
                # Basic transaction info
                features["transaction_id"] = row["transaction_id"]
                features["customer_id"] = row["customer_id"]
                features["amount"] = row["amount"]
                features["abs_amount"] = abs(row["amount"])
                
                # Historical context features
                features.update(self._calculate_transaction_context_features(customer_data, idx, row))
                
                transaction_features.append(features)
        
        feature_df = pd.DataFrame(transaction_features)
        
        # Fill missing values
        feature_df = feature_df.fillna(0)
        
        print(f"Created transaction-level features for {len(feature_df)} transactions")
        
        return feature_df
    
    def _calculate_transaction_context_features(self, customer_data: pd.DataFrame, 
                                              current_idx: int, current_row: pd.Series) -> Dict:
        """Calculate context features for a specific transaction"""
        features = {}
        
        # Get previous transactions
        prev_transactions = customer_data[customer_data.index < current_idx]
        
        if len(prev_transactions) == 0:
            # First transaction for customer
            features["is_first_transaction"] = 1
            features["days_since_last_transaction"] = 0
            features["amount_vs_avg_ratio"] = 1
            features["frequency_last_7_days"] = 0
            features["frequency_last_30_days"] = 0
            return features
        
        features["is_first_transaction"] = 0
        
        # Time since last transaction
        last_transaction_date = prev_transactions["transaction_date"].iloc[-1]
        current_date = current_row["transaction_date"]
        features["days_since_last_transaction"] = (current_date - last_transaction_date).days
        
        # Amount compared to historical average
        avg_amount = prev_transactions["amount"].mean()
        if avg_amount != 0:
            features["amount_vs_avg_ratio"] = current_row["amount"] / avg_amount
        else:
            features["amount_vs_avg_ratio"] = 1
        
        # Recent transaction frequency
        last_7_days = current_date - timedelta(days=7)
        last_30_days = current_date - timedelta(days=30)
        
        features["frequency_last_7_days"] = len(prev_transactions[prev_transactions["transaction_date"] >= last_7_days])
        features["frequency_last_30_days"] = len(prev_transactions[prev_transactions["transaction_date"] >= last_30_days])
        
        # Merchant and category patterns
        features["merchant_seen_before"] = 1 if current_row["merchant"] in prev_transactions["merchant"].values else 0
        features["category_seen_before"] = 1 if current_row["category"] in prev_transactions["category"].values else 0
        features["location_seen_before"] = 1 if current_row["location"] in prev_transactions["location"].values else 0
        
        return features


def main():
    """Test feature engineering with sample data"""
    # Load sample data
    try:
        df = pd.read_csv("../../data/raw/transactions.csv")
        print(f"Loaded {len(df)} transactions")
        
        # Initialize feature engineer
        feature_engineer = FeatureEngineer(lookback_days=90)
        
        # Create customer features
        customer_features = feature_engineer.create_customer_features(df)
        customer_features.to_csv("../../data/processed/customer_features.csv", index=False)
        print(f"Customer features saved: {customer_features.shape}")
        
        # Create transaction features
        transaction_features = feature_engineer.create_transaction_features(df)
        transaction_features.to_csv("../../data/processed/transaction_features.csv", index=False)
        print(f"Transaction features saved: {transaction_features.shape}")
        
        print("\nFeature engineering completed successfully!")
        
    except FileNotFoundError:
        print("Please run data_generator.py first to create sample data")


if __name__ == "__main__":
    main()
