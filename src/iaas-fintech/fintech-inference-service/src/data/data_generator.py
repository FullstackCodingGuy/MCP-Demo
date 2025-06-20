"""
Synthetic transaction data generator for the Fintech Inference Service
"""

import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import pandas as pd
import numpy as np


class TransactionDataGenerator:
    """Generate realistic synthetic transaction data for testing and development"""
    
    def __init__(self, random_state: int = 42):
        """Initialize the data generator with a random state for reproducibility"""
        random.seed(random_state)
        np.random.seed(random_state)
        
        # Define realistic merchant names by category
        self.merchants = {
            "grocery": ["Walmart", "Kroger", "Safeway", "Whole Foods", "Target", "Costco"],
            "restaurant": ["McDonald's", "Starbucks", "Subway", "Pizza Hut", "KFC", "Domino's"],
            "gas": ["Shell", "Chevron", "BP", "Exxon", "Mobil", "Texaco"],
            "retail": ["Amazon", "Best Buy", "Macy's", "Nike", "Apple Store", "Home Depot"],
            "entertainment": ["Netflix", "Spotify", "AMC Theaters", "GameStop", "iTunes"],
            "healthcare": ["CVS Pharmacy", "Walgreens", "Quest Diagnostics", "LabCorp"],
            "utilities": ["Electric Company", "Water Authority", "Gas Company", "Internet Provider"],
            "transport": ["Uber", "Lyft", "Metro Transit", "Parking Authority", "Taxi"],
            "banking": ["Bank Fee", "ATM Fee", "Wire Transfer", "Interest Payment"],
            "income": ["Salary Deposit", "Freelance Payment", "Investment Return", "Bonus"]
        }
        
        self.payment_modes = ["Credit Card", "Debit Card", "Bank Transfer", "UPI", "Cash", "Check"]
        self.locations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
                         "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville"]
    
    def generate_customer_profile(self, customer_id: str) -> Dict:
        """Generate a customer profile with spending behavior characteristics"""
        # Define customer segments with different behaviors
        segments = {
            "high_spender": {
                "avg_monthly_spend": 5000,
                "transaction_frequency": 25,
                "preferred_categories": ["retail", "restaurant", "entertainment"],
                "churn_probability": 0.1
            },
            "moderate_spender": {
                "avg_monthly_spend": 2500,
                "transaction_frequency": 15,
                "preferred_categories": ["grocery", "gas", "restaurant"],
                "churn_probability": 0.2
            },
            "low_spender": {
                "avg_monthly_spend": 1000,
                "transaction_frequency": 8,
                "preferred_categories": ["grocery", "utilities", "transport"],
                "churn_probability": 0.3
            },
            "risky": {
                "avg_monthly_spend": 3000,
                "transaction_frequency": 30,
                "preferred_categories": ["entertainment", "retail", "restaurant"],
                "churn_probability": 0.5
            }
        }
        
        segment = random.choice(list(segments.keys()))
        profile = segments[segment].copy()
        profile["customer_id"] = customer_id
        profile["segment"] = segment
        profile["signup_date"] = datetime.now() - timedelta(days=random.randint(30, 730))
        
        return profile
    
    def generate_transaction(self, customer_profile: Dict, transaction_date: datetime) -> Dict:
        """Generate a single transaction for a customer"""
        
        # Select category based on customer preferences
        if random.random() < 0.7:  # 70% chance to use preferred categories
            category = random.choice(customer_profile["preferred_categories"])
        else:
            category = random.choice(list(self.merchants.keys()))
        
        # Select merchant from category
        merchant = random.choice(self.merchants[category])
        
        # Generate amount based on category and customer profile
        base_amount = customer_profile["avg_monthly_spend"] / customer_profile["transaction_frequency"]
        
        if category == "income":
            amount = random.uniform(base_amount * 3, base_amount * 8)  # Positive for income
        elif category == "utilities":
            amount = -random.uniform(50, 300)  # Negative for expenses
        elif category == "grocery":
            amount = -random.uniform(20, 200)
        elif category == "restaurant":
            amount = -random.uniform(10, 100)
        elif category == "gas":
            amount = -random.uniform(30, 80)
        elif category == "retail":
            amount = -random.uniform(25, 500)
        elif category == "entertainment":
            amount = -random.uniform(10, 50)
        elif category == "healthcare":
            amount = -random.uniform(20, 200)
        elif category == "transport":
            amount = -random.uniform(5, 50)
        elif category == "banking":
            amount = -random.uniform(5, 35)  # Fees
        else:
            amount = -random.uniform(10, 100)
        
        # Add some randomness
        amount *= random.uniform(0.7, 1.3)
        
        # Generate transaction
        transaction = {
            "transaction_id": f"TXN_{random.randint(100000, 999999)}",
            "customer_id": customer_profile["customer_id"],
            "transaction_date": transaction_date.strftime("%Y-%m-%d %H:%M:%S"),
            "amount": round(amount, 2),
            "merchant": merchant,
            "category": category,
            "mode": random.choice(self.payment_modes),
            "location": random.choice(self.locations),
            "remarks": self._generate_remarks(category, merchant)
        }
        
        return transaction
    
    def _generate_remarks(self, category: str, merchant: str) -> str:
        """Generate realistic transaction remarks"""
        remarks_templates = {
            "grocery": ["Weekly groceries", "Grocery shopping", "Food supplies"],
            "restaurant": ["Lunch", "Dinner", "Coffee", "Quick bite"],
            "gas": ["Fuel refill", "Gas station", "Petrol"],
            "retail": ["Online purchase", "Shopping", "Store purchase"],
            "entertainment": ["Streaming service", "Movie tickets", "Gaming"],
            "healthcare": ["Pharmacy", "Medical supplies", "Health checkup"],
            "utilities": ["Monthly bill", "Utility payment"],
            "transport": ["Ride share", "Public transport", "Taxi"],
            "banking": ["Service fee", "Transaction fee"],
            "income": ["Salary", "Payment received", "Income"]
        }
        
        templates = remarks_templates.get(category, ["Purchase"])
        return f"{random.choice(templates)} - {merchant}"
    
    def introduce_fraud_patterns(self, transactions: List[Dict]) -> List[Dict]:
        """Introduce fraudulent transaction patterns"""
        fraud_rate = 0.02  # 2% fraud rate
        num_fraud = int(len(transactions) * fraud_rate)
        
        fraud_indices = random.sample(range(len(transactions)), num_fraud)
        
        for idx in fraud_indices:
            transaction = transactions[idx]
            
            # Fraud patterns
            fraud_type = random.choice(["unusual_amount", "unusual_location", "unusual_frequency"])
            
            if fraud_type == "unusual_amount":
                # Unusually high amount
                transaction["amount"] = -random.uniform(1000, 5000)
                transaction["remarks"] += " [SUSPICIOUS_AMOUNT]"
            
            elif fraud_type == "unusual_location":
                # Transaction in unusual location
                unusual_locations = ["Las Vegas", "Miami", "International"]
                transaction["location"] = random.choice(unusual_locations)
                transaction["remarks"] += " [SUSPICIOUS_LOCATION]"
            
            elif fraud_type == "unusual_frequency":
                # Multiple transactions in short time
                transaction["remarks"] += " [SUSPICIOUS_FREQUENCY]"
            
            transaction["is_fraud"] = True
        
        return transactions
    
    def generate_dataset(self, 
                        num_customers: int = 1000, 
                        num_months: int = 6, 
                        output_path: Optional[str] = None) -> pd.DataFrame:
        """Generate a complete transaction dataset"""
        
        print(f"Generating transaction data for {num_customers} customers over {num_months} months...")
        
        customers = []
        transactions = []
        
        # Generate customer profiles
        for i in range(num_customers):
            customer_id = f"CUST_{i+1:06d}"
            profile = self.generate_customer_profile(customer_id)
            customers.append(profile)
        
        # Generate transactions for each customer
        for customer in customers:
            customer_transactions = []
            
            # Generate transactions over the specified period
            start_date = datetime.now() - timedelta(days=num_months * 30)
            current_date = start_date
            
            while current_date < datetime.now():
                # Determine if customer should have transactions on this day
                if random.random() < 0.3:  # 30% chance of transaction on any given day
                    # Number of transactions for this day
                    daily_transactions = random.choices(
                        [1, 2, 3, 4, 5], 
                        weights=[60, 25, 10, 4, 1]
                    )[0]
                    
                    for _ in range(daily_transactions):
                        transaction_time = current_date + timedelta(
                            hours=random.randint(6, 23),
                            minutes=random.randint(0, 59)
                        )
                        
                        transaction = self.generate_transaction(customer, transaction_time)
                        transaction["is_fraud"] = False  # Default to non-fraudulent
                        customer_transactions.append(transaction)
                
                current_date += timedelta(days=1)
            
            transactions.extend(customer_transactions)
        
        # Introduce fraud patterns
        transactions = self.introduce_fraud_patterns(transactions)
        
        # Create DataFrame
        df = pd.DataFrame(transactions)
        
        # Add derived features
        df["transaction_date"] = pd.to_datetime(df["transaction_date"])
        df["day_of_week"] = df["transaction_date"].dt.day_name()
        df["hour"] = df["transaction_date"].dt.hour
        df["is_weekend"] = df["transaction_date"].dt.weekday >= 5
        df["abs_amount"] = df["amount"].abs()
        
        # Sort by date
        df = df.sort_values("transaction_date").reset_index(drop=True)
        
        print(f"Generated {len(df)} transactions")
        print(f"Fraud rate: {df['is_fraud'].mean():.2%}")
        
        # Save to file if path provided
        if output_path:
            df.to_csv(output_path, index=False)
            print(f"Dataset saved to {output_path}")
        
        # Save customer profiles
        customer_df = pd.DataFrame(customers)
        if output_path:
            customer_path = output_path.replace("transactions", "customers")
            customer_df.to_csv(customer_path, index=False)
            print(f"Customer profiles saved to {customer_path}")
        
        return df, customer_df


def main():
    """Generate sample data for the fintech inference service"""
    generator = TransactionDataGenerator(random_state=42)
    
    # Generate dataset
    transactions_df, customers_df = generator.generate_dataset(
        num_customers=1000,
        num_months=6,
        output_path="../../data/raw/transactions.csv"
    )
    
    print("\nDataset Summary:")
    print(f"Total customers: {customers_df.shape[0]}")
    print(f"Total transactions: {transactions_df.shape[0]}")
    print(f"Date range: {transactions_df['transaction_date'].min()} to {transactions_df['transaction_date'].max()}")
    print(f"Categories: {transactions_df['category'].unique()}")
    print(f"Average transactions per customer: {len(transactions_df) / len(customers_df):.1f}")


if __name__ == "__main__":
    main()
