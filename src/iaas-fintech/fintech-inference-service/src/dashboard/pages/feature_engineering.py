"""
Feature Engineering Documentation Page
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np

# Page configuration
st.set_page_config(
    page_title="Feature Engineering - Fintech Inference Service",
    page_icon="🔧",
    layout="wide"
)

def load_feature_data():
    """Load feature data for examples"""
    try:
        customer_features = pd.read_csv("data/processed/customer_features.csv")
        transaction_features = pd.read_csv("data/processed/transaction_features.csv")
        return customer_features, transaction_features
    except Exception as e:
        st.error(f"Error loading feature data: {e}")
        return None, None

def main():
    st.title("🔧 Feature Engineering Documentation")
    st.markdown("---")
    
    # Introduction
    st.header("📊 Overview")
    st.markdown("""
    Feature engineering is a critical component of our fintech inference service, transforming raw transaction 
    data into meaningful features that power our machine learning models for **churn prediction**, 
    **fraud detection**, and **customer segmentation**.
    
    Our system generates **65 customer-level features** and **10 transaction-level features** from transaction history, 
    capturing behavioral patterns, spending habits, and risk indicators.
    """)
    
    # Load data for examples
    customer_features, transaction_features = load_feature_data()
    
    # Create tabs for different sections
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "🏗️ Feature Architecture", 
        "👤 Customer Features (65)", 
        "💳 Transaction Features (10)", 
        "📈 Feature Examples", 
        "🎯 ML Applications"
    ])
    
    with tab1:
        st.header("🏗️ Feature Engineering Architecture")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("📊 Data Flow")
            st.markdown("""
            ```
            Raw Transaction Data
                    ↓
            Data Preprocessing
                    ↓
            Feature Extraction
            ├── Customer-Level Features (65)
            │   ├── Recency Features (3)
            │   ├── Frequency Features (8)
            │   ├── Monetary Features (17)
            │   ├── Category Features (20)
            │   ├── Temporal Features (6)
            │   ├── Trend Features (4)
            │   └── Behavioral Features (7)
            └── Transaction-Level Features (10)
                ├── Basic Features (2)
                ├── Context Features (4)
                ├── Historical Features (2)
                └── Pattern Features (2)
                    ↓
            ML Model Training
            ```
            """)
        
        with col2:
            st.subheader("🎯 Feature Purpose")
            st.markdown("""
            **Customer Features** - Aggregated insights about customer behavior:
            - **Churn Prediction**: Identify customers likely to leave
            - **Customer Segmentation**: Group customers by behavior
            - **Risk Assessment**: Evaluate customer credit risk
            
            **Transaction Features** - Real-time transaction context:
            - **Fraud Detection**: Identify suspicious transactions
            - **Anomaly Detection**: Spot unusual patterns
            - **Risk Scoring**: Real-time transaction risk assessment
            """)
        
        st.subheader("⏱️ Feature Generation Process")
        st.markdown("""
        1. **Data Ingestion**: Raw transactions from CSV/database
        2. **Preprocessing**: Clean data, handle missing values, type conversion
        3. **Customer Aggregation**: Group transactions by customer_id
        4. **Feature Calculation**: Apply statistical and behavioral algorithms
        5. **Feature Storage**: Save to processed CSV files for ML models
        6. **Real-time Updates**: Incremental feature updates for new transactions
        """)
    
    with tab2:
        st.header("👤 Customer Features (65 Features)")
        st.markdown("Comprehensive behavioral profile for each customer based on transaction history")
        
        # Feature categories with detailed explanations
        feature_categories = {
            "🕒 Recency Features (3)": {
                "description": "Time-based features measuring customer activity recency",
                "features": [
                    ("days_since_last_transaction", "Days since the customer's most recent transaction", "Churn prediction - customers with high values likely to churn"),
                    ("days_since_first_transaction", "Total days since customer's first transaction", "Customer lifetime and loyalty measurement"),
                    ("customer_lifetime_days", "Active period from first to last transaction", "Customer engagement duration")
                ],
                "business_impact": "Critical for churn prediction and customer retention strategies",
                "example": "Customer with 45 days since last transaction has higher churn risk"
            },
            
            "📊 Frequency Features (8)": {
                "description": "Transaction frequency and diversity metrics",
                "features": [
                    ("total_transactions", "Total number of transactions by customer", "Activity level indicator"),
                    ("unique_merchants", "Number of different merchants visited", "Shopping diversity"),
                    ("unique_categories", "Number of different spending categories", "Spending diversity"),
                    ("unique_locations", "Number of different transaction locations", "Geographic diversity"),
                    ("avg_transactions_per_day", "Average daily transaction frequency", "Activity intensity"),
                    ("avg_transactions_per_week", "Average weekly transaction frequency", "Weekly activity pattern"),
                    ("avg_transactions_per_month", "Average monthly transaction frequency", "Monthly activity pattern"),
                    ("avg_transactions_per_year", "Average annual transaction frequency", "Yearly activity pattern")
                ],
                "business_impact": "Customer segmentation and engagement level assessment",
                "example": "High-frequency customers (>50 transactions/month) are premium segments"
            },
            
            "💰 Monetary Features (17)": {
                "description": "Financial behavior and spending pattern analysis",
                "features": [
                    ("total_amount", "Sum of all transaction amounts", "Total customer value"),
                    ("avg_transaction_amount", "Average transaction amount", "Typical spending level"),
                    ("median_transaction_amount", "Median transaction amount", "Typical spending (outlier-resistant)"),
                    ("std_transaction_amount", "Standard deviation of amounts", "Spending consistency"),
                    ("min_transaction_amount", "Smallest transaction amount", "Minimum spending threshold"),
                    ("max_transaction_amount", "Largest transaction amount", "Maximum spending capacity"),
                    ("total_expenses", "Sum of all negative amounts (expenses)", "Total spending"),
                    ("avg_expense_amount", "Average expense amount", "Typical expense size"),
                    ("max_expense_amount", "Largest single expense", "Major purchase capability"),
                    ("expense_transaction_count", "Number of expense transactions", "Spending frequency"),
                    ("total_income", "Sum of all positive amounts (income)", "Total earnings"),
                    ("avg_income_amount", "Average income amount", "Typical income size"),
                    ("max_income_amount", "Largest income transaction", "Income capacity"),
                    ("income_transaction_count", "Number of income transactions", "Income frequency"),
                    ("net_cash_flow", "Total income minus total expenses", "Financial health"),
                    ("income_expense_ratio", "Ratio of income to expenses", "Financial stability"),
                    ("savings_rate", "Net cash flow as percentage of income", "Saving behavior")
                ],
                "business_impact": "Credit scoring, loan approval, premium service targeting",
                "example": "Customer with income_expense_ratio > 1.2 and savings_rate > 20% is low credit risk"
            },
            
            "🏷️ Category Features (20)": {
                "description": "Spending behavior across different merchant categories",
                "features": [
                    ("grocery_total_spend", "Total spending on groceries", "Essential spending"),
                    ("grocery_transaction_count", "Number of grocery transactions", "Grocery shopping frequency"),
                    ("grocery_avg_amount", "Average grocery transaction amount", "Grocery spending level"),
                    ("restaurant_total_spend", "Total restaurant spending", "Dining habits"),
                    ("restaurant_transaction_count", "Restaurant transaction frequency", "Dining frequency"),
                    ("restaurant_avg_amount", "Average restaurant spending", "Dining spending level"),
                    ("gas_total_spend", "Total fuel spending", "Transportation costs"),
                    ("gas_transaction_count", "Number of fuel transactions", "Fuel purchase frequency"),
                    ("gas_avg_amount", "Average fuel transaction", "Fuel spending pattern"),
                    ("retail_total_spend", "Total retail spending", "Shopping behavior"),
                    ("retail_transaction_count", "Retail transaction frequency", "Shopping frequency"),
                    ("retail_avg_amount", "Average retail spending", "Retail spending level"),
                    ("entertainment_total_spend", "Entertainment spending", "Leisure spending"),
                    ("entertainment_transaction_count", "Entertainment frequency", "Entertainment habits"),
                    ("entertainment_avg_amount", "Average entertainment spending", "Entertainment budget"),
                    ("grocery_spend_percentage", "Grocery as % of total spending", "Essential spending ratio"),
                    ("restaurant_spend_percentage", "Restaurant as % of total spending", "Dining spending ratio"),
                    ("gas_spend_percentage", "Fuel as % of total spending", "Transportation ratio"),
                    ("retail_spend_percentage", "Retail as % of total spending", "Shopping ratio"),
                    ("entertainment_spend_percentage", "Entertainment as % of total spending", "Leisure ratio")
                ],
                "business_impact": "Targeted marketing, category-specific offers, lifestyle segmentation",
                "example": "Customer with 40% grocery spending is family-focused, good target for family products"
            },
            
            "⏰ Temporal Features (6)": {
                "description": "Time-based spending patterns and preferences",
                "features": [
                    ("avg_transaction_hour", "Average hour of transactions", "Daily activity pattern"),
                    ("most_common_hour", "Most frequent transaction hour", "Peak activity time"),
                    ("weekend_transaction_ratio", "Weekend vs weekday transaction ratio", "Weekend activity level"),
                    ("most_common_day", "Most frequent transaction day", "Preferred transaction day"),
                    ("weekend_weekday_spending_ratio", "Weekend vs weekday spending ratio", "Weekend spending behavior"),
                    ("most_frequent_category", "Most common spending category", "Primary spending focus")
                ],
                "business_impact": "Promotional timing, customer service scheduling, targeted campaigns",
                "example": "Customer with high weekend spending gets weekend-specific promotions"
            },
            
            "📈 Trend Features (4)": {
                "description": "Spending and activity trends over time",
                "features": [
                    ("monthly_spending_trend", "Monthly spending growth/decline rate", "Spending trajectory"),
                    ("monthly_frequency_trend", "Monthly transaction frequency trend", "Activity trajectory"),
                    ("spending_volatility", "Variability in monthly spending", "Spending consistency"),
                    ("frequency_volatility", "Variability in transaction frequency", "Activity consistency")
                ],
                "business_impact": "Growth prediction, capacity planning, risk assessment",
                "example": "Positive spending trend indicates growing customer value"
            },
            
            "🎭 Behavioral Features (7)": {
                "description": "Customer preferences and loyalty patterns",
                "features": [
                    ("most_used_payment_mode", "Preferred payment method", "Payment preference"),
                    ("payment_mode_diversity", "Number of different payment methods", "Payment flexibility"),
                    ("location_diversity", "Geographic spending diversity", "Travel/mobility pattern"),
                    ("most_common_location", "Most frequent transaction location", "Primary location"),
                    ("merchant_loyalty_score", "Loyalty to top merchant", "Brand loyalty"),
                    ("top_merchant", "Most frequented merchant", "Preferred merchant"),
                    ("small_transaction_ratio", "Ratio of small transactions (<$50)", "Micro-spending behavior"),
                    ("medium_transaction_ratio", "Ratio of medium transactions ($50-$200)", "Regular spending behavior"),
                    ("large_transaction_ratio", "Ratio of large transactions (>$200)", "Major purchase behavior")
                ],
                "business_impact": "Loyalty programs, merchant partnerships, personalized services",
                "example": "High merchant loyalty score (>0.3) indicates strong brand preference"
            }
        }
        
        for category, details in feature_categories.items():
            with st.expander(category, expanded=False):
                st.markdown(f"**{details['description']}**")
                st.markdown(f"**Business Impact:** {details['business_impact']}")
                st.markdown(f"**Example:** {details['example']}")
                
                # Create features table
                feature_data = []
                for feature_name, description, ml_use in details['features']:
                    feature_data.append({
                        "Feature": feature_name,
                        "Description": description,
                        "ML Application": ml_use
                    })
                
                df_features = pd.DataFrame(feature_data)
                st.dataframe(df_features, use_container_width=True)
    
    with tab3:
        st.header("💳 Transaction Features (10 Features)")
        st.markdown("Real-time contextual features for each individual transaction")
        
        transaction_feature_categories = {
            "📋 Basic Features (2)": {
                "description": "Fundamental transaction attributes for ML models",
                "features": [
                    ("amount", "Transaction amount (positive/negative)", "Financial impact analysis"),
                    ("abs_amount", "Absolute transaction amount", "Transaction size analysis")
                ],
                "business_impact": "Basic transaction processing and analysis",
                "example": "abs_amount used for transaction size-based fraud detection"
            },
            
            "🔍 Context Features (4)": {
                "description": "Historical context for current transaction",
                "features": [
                    ("is_first_transaction", "1 if customer's first transaction, 0 otherwise", "New customer identification"),
                    ("days_since_last_transaction", "Days since customer's previous transaction", "Activity gap analysis"),
                    ("amount_vs_avg_ratio", "Current amount vs customer's historical average", "Spending deviation detection"),
                    ("frequency_last_7_days", "Number of transactions in past 7 days", "Recent activity level")
                ],
                "business_impact": "Fraud detection, anomaly identification, customer behavior analysis",
                "example": "amount_vs_avg_ratio > 5.0 indicates potentially fraudulent large transaction"
            },
            
            "📊 Historical Features (2)": {
                "description": "Customer's transaction history context",
                "features": [
                    ("frequency_last_30_days", "Number of transactions in past 30 days", "Monthly activity pattern"),
                    ("merchant_seen_before", "1 if customer used this merchant before", "Merchant familiarity")
                ],
                "business_impact": "Pattern recognition, customer journey analysis",
                "example": "First-time merchant (merchant_seen_before=0) increases fraud risk"
            },
            
            "🎯 Pattern Features (2)": {
                "description": "Behavioral pattern recognition",
                "features": [
                    ("category_seen_before", "1 if customer shopped this category before", "Category familiarity"),
                    ("location_seen_before", "1 if customer transacted at this location before", "Location familiarity")
                ],
                "business_impact": "Fraud detection, customer preference analysis",
                "example": "New location + new category + large amount = high fraud risk"
            }
        }
        
        for category, details in transaction_feature_categories.items():
            with st.expander(category, expanded=False):
                st.markdown(f"**{details['description']}**")
                st.markdown(f"**Business Impact:** {details['business_impact']}")
                st.markdown(f"**Example:** {details['example']}")
                
                # Create features table
                feature_data = []
                for feature_name, description, ml_use in details['features']:
                    feature_data.append({
                        "Feature": feature_name,
                        "Description": description,
                        "ML Application": ml_use
                    })
                
                df_features = pd.DataFrame(feature_data)
                st.dataframe(df_features, use_container_width=True)
    
    with tab4:
        st.header("📈 Feature Examples & Analysis")
        
        if customer_features is not None and transaction_features is not None:
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("👤 Customer Feature Distribution")
                
                # Sample customer features for visualization
                sample_features = [
                    'total_transactions', 'avg_transaction_amount', 'days_since_last_transaction',
                    'weekend_transaction_ratio', 'merchant_loyalty_score'
                ]
                
                selected_feature = st.selectbox("Select Feature to Analyze:", sample_features)
                
                if selected_feature in customer_features.columns:
                    fig = px.histogram(
                        customer_features, 
                        x=selected_feature,
                        title=f"Distribution of {selected_feature}",
                        nbins=30
                    )
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Statistics
                    stats = customer_features[selected_feature].describe()
                    st.write("**Statistics:**")
                    st.write(stats)
            
            with col2:
                st.subheader("💳 Transaction Feature Analysis")
                
                # Transaction feature analysis
                transaction_sample = transaction_features.head(1000)  # Sample for performance
                
                trans_features = [
                    'amount', 'days_since_last_transaction', 'amount_vs_avg_ratio',
                    'frequency_last_7_days', 'frequency_last_30_days'
                ]
                
                selected_trans_feature = st.selectbox("Select Transaction Feature:", trans_features)
                
                if selected_trans_feature in transaction_sample.columns:
                    fig = px.histogram(
                        transaction_sample, 
                        x=selected_trans_feature,
                        title=f"Distribution of {selected_trans_feature}",
                        nbins=30
                    )
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Statistics
                    stats = transaction_sample[selected_trans_feature].describe()
                    st.write("**Statistics:**")
                    st.write(stats)
            
            # Feature correlation analysis
            st.subheader("🔗 Feature Correlation Analysis")
            
            # Select numeric columns for correlation
            numeric_cols = customer_features.select_dtypes(include=[np.number]).columns[:10]  # First 10 for performance
            corr_matrix = customer_features[numeric_cols].corr()
            
            fig = px.imshow(
                corr_matrix,
                title="Customer Feature Correlation Matrix",
                color_continuous_scale="RdBu",
                aspect="auto"
            )
            st.plotly_chart(fig, use_container_width=True)
        
        else:
            st.warning("Feature data not available. Please ensure feature engineering has been run.")
    
    with tab5:
        st.header("🎯 ML Model Applications")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("🔮 Churn Prediction Model")
            st.markdown("""
            **Key Features Used:**
            - `days_since_last_transaction` (most important)
            - `monthly_spending_trend`
            - `total_transactions`
            - `avg_transaction_amount`
            - `frequency_volatility`
            
            **Model Logic:**
            - High recency (>30 days) + declining trend = High churn risk
            - Low transaction frequency + high volatility = Medium risk
            - Stable patterns + recent activity = Low risk
            
            **Business Value:**
            - Early identification of at-risk customers
            - Targeted retention campaigns
            - Customer lifetime value optimization
            """)
            
            st.subheader("🏷️ Customer Segmentation")
            st.markdown("""
            **Key Features Used:**
            - Monetary features (spending levels)
            - Category percentage features
            - Behavioral features (loyalty, diversity)
            - Temporal patterns
            
            **Segments:**
            - **Premium**: High spending + high loyalty
            - **Frequent**: High frequency + diverse categories
            - **Occasional**: Low frequency + specific categories
            - **New**: Recent customers + growing patterns
            """)
        
        with col2:
            st.subheader("🚨 Fraud Detection Model")
            st.markdown("""
            **Key Transaction Features:**
            - `amount_vs_avg_ratio` (amount deviation)
            - `days_since_last_transaction` (unusual timing)
            - `merchant_seen_before` (new merchant risk)
            - `location_seen_before` (new location risk)
            - `frequency_last_7_days` (velocity checks)
            
            **Fraud Indicators:**
            - Amount 5x+ larger than average
            - New merchant + new location
            - Unusual time gaps between transactions
            - High velocity (>10 transactions in 24 hours)
            
            **Real-time Scoring:**
            - Risk score 0-100 calculated instantly
            - Automatic blocking for high-risk transactions
            - Manual review for medium-risk transactions
            """)
            
            st.subheader("📊 Feature Importance")
            
            # Mock feature importance data
            importance_data = {
                "Feature": [
                    "days_since_last_transaction",
                    "amount_vs_avg_ratio", 
                    "total_transactions",
                    "merchant_seen_before",
                    "avg_transaction_amount",
                    "location_seen_before",
                    "frequency_last_30_days",
                    "monthly_spending_trend"
                ],
                "Importance": [0.25, 0.18, 0.15, 0.12, 0.10, 0.08, 0.07, 0.05],
                "Model": ["Churn", "Fraud", "Churn", "Fraud", "Segmentation", "Fraud", "Fraud", "Churn"]
            }
            
            importance_df = pd.DataFrame(importance_data)
            fig = px.bar(
                importance_df, 
                x="Importance", 
                y="Feature",
                color="Model",
                title="Feature Importance Across ML Models",
                orientation='h'
            )
            st.plotly_chart(fig, use_container_width=True)
        
        st.subheader("🔄 Feature Engineering Pipeline")
        st.markdown("""
        **Production Pipeline:**
        1. **Real-time Stream**: New transactions trigger feature calculation
        2. **Batch Processing**: Daily refresh of customer-level features  
        3. **Model Inference**: Features fed to ML models for predictions
        4. **Feature Store**: Cached features for low-latency serving
        5. **Monitoring**: Feature drift detection and model performance tracking
        
        **Performance Metrics:**
        - Feature calculation: <100ms per transaction
        - Model inference: <50ms per prediction
        - Batch processing: 1M+ customers in <30 minutes
        - Feature freshness: <1 hour for customer features
        """)

if __name__ == "__main__":
    main()
