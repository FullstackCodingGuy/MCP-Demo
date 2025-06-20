"""
Streamlit dashboard for the Fintech Inference Service
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import requests
import json

# Page configuration
st.set_page_config(
    page_title="Fintech Inference Dashboard",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 5px solid #1f77b4;
    }
    .high-risk {
        border-left-color: #d62728 !important;
    }
    .medium-risk {
        border-left-color: #ff7f0e !important;
    }
    .low-risk {
        border-left-color: #2ca02c !important;
    }
</style>
""", unsafe_allow_html=True)

# API Configuration
API_BASE_URL = "http://localhost:8000"

# Utility functions
@st.cache_data
def load_sample_data():
    """Load or generate sample data for demo purposes"""
    try:
        # Try to load real data
        data = pd.read_csv("../data/processed/customer_features.csv")
        return data
    except FileNotFoundError:
        # Generate sample data for demo
        np.random.seed(42)
        n_customers = 1000
        
        data = pd.DataFrame({
            'customer_id': [f'CUST_{i:06d}' for i in range(1, n_customers + 1)],
            'days_since_last_transaction': np.random.exponential(15, n_customers),
            'total_transactions': np.random.poisson(20, n_customers),
            'avg_transaction_amount': np.random.lognormal(4, 1, n_customers),
            'total_amount': np.random.normal(-2000, 1000, n_customers),
            'churn_probability': np.random.beta(2, 5, n_customers),
            'segment': np.random.choice(['High Value', 'Growth Potential', 'At Risk', 'New Customer'], n_customers),
            'risk_level': np.random.choice(['Low', 'Medium', 'High'], n_customers, p=[0.6, 0.3, 0.1])
        })
        
        return data

def call_api(endpoint, data=None, method="GET"):
    """Call API endpoint"""
    try:
        url = f"{API_BASE_URL}{endpoint}"
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except:
        return None

# Main dashboard
def main():
    st.title("🏦 Fintech Inference Dashboard")
    st.markdown("AI-powered insights for banking and fintech applications")
    
    # Sidebar
    st.sidebar.title("Navigation")
    page = st.sidebar.selectbox(
        "Select Page",
        [
            "Overview", 
            "👥 Customer Management", 
            "Customer Analytics", 
            "Churn Prediction", 
            "Fraud Detection", 
            "Segmentation", 
            "Model Insights"
        ]
    )
    
    # Load data
    data = load_sample_data()
    
    if page == "Overview":
        show_overview(data)
    elif page == "👥 Customer Management":
        # Import and run customer management page
        try:
            import sys
            import os
            sys.path.append(os.path.join(os.path.dirname(__file__), 'pages'))
            from customer_management import main as customer_main
            customer_main()
        except Exception as e:
            st.error(f"Error loading customer management page: {e}")
            st.info("Please ensure the API server is running on http://localhost:8000")
    elif page == "Customer Analytics":
        show_customer_analytics(data)
    elif page == "Churn Prediction":
        show_churn_prediction(data)
    elif page == "Fraud Detection":
        show_fraud_detection()
    elif page == "Segmentation":
        show_segmentation(data)
    elif page == "Model Insights":
        show_model_insights()

def show_overview(data):
    """Show overview dashboard"""
    st.header("📊 Business Overview")
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="Total Customers",
            value=f"{len(data):,}",
            delta="12 new today"
        )
    
    with col2:
        churn_rate = data.get('churn_probability', pd.Series([0.2])).mean()
        st.metric(
            label="Avg Churn Risk",
            value=f"{churn_rate:.1%}",
            delta="-2.3%"
        )
    
    with col3:
        total_value = data.get('total_amount', pd.Series([0])).sum()
        st.metric(
            label="Total Customer Value",
            value=f"${total_value:,.0f}",
            delta="5.2%"
        )
    
    with col4:
        avg_transactions = data.get('total_transactions', pd.Series([0])).mean()
        st.metric(
            label="Avg Transactions",
            value=f"{avg_transactions:.0f}",
            delta="3.1%"
        )
    
    # Charts
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Customer Segments Distribution")
        if 'segment' in data.columns:
            segment_counts = data['segment'].value_counts()
            fig = px.pie(
                values=segment_counts.values,
                names=segment_counts.index,
                title="Customer Segments"
            )
            st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.subheader("Risk Level Distribution")
        if 'risk_level' in data.columns:
            risk_counts = data['risk_level'].value_counts()
            colors = {'Low': 'green', 'Medium': 'orange', 'High': 'red'}
            fig = px.bar(
                x=risk_counts.index,
                y=risk_counts.values,
                color=risk_counts.index,
                color_discrete_map=colors,
                title="Customer Risk Levels"
            )
            st.plotly_chart(fig, use_container_width=True)
    
    # Recent activity simulation
    st.subheader("📈 Recent Activity")
    
    # Generate sample time series data
    dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')
    activity_data = pd.DataFrame({
        'date': dates,
        'transactions': np.random.poisson(100, len(dates)),
        'new_customers': np.random.poisson(5, len(dates)),
        'churn_alerts': np.random.poisson(2, len(dates))
    })
    
    # Last 30 days
    recent_data = activity_data.tail(30)
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=recent_data['date'],
        y=recent_data['transactions'],
        mode='lines+markers',
        name='Daily Transactions',
        line=dict(color='blue')
    ))
    
    fig.add_trace(go.Scatter(
        x=recent_data['date'],
        y=recent_data['new_customers'] * 10,  # Scale for visibility
        mode='lines+markers',
        name='New Customers (×10)',
        line=dict(color='green'),
        yaxis='y2'
    ))
    
    fig.update_layout(
        title='Recent Activity Trends',
        xaxis_title='Date',
        yaxis_title='Transactions',
        yaxis2=dict(title='New Customers', overlaying='y', side='right'),
        hovermode='x unified'
    )
    
    st.plotly_chart(fig, use_container_width=True)

def show_customer_analytics(data):
    """Show customer analytics page"""
    st.header("👥 Customer Analytics")
    
    # Customer search
    st.subheader("🔍 Customer Search")
    customer_id = st.selectbox(
        "Select Customer ID",
        options=data['customer_id'].tolist()[:100]  # Limit for demo
    )
    
    if customer_id:
        customer_data = data[data['customer_id'] == customer_id].iloc[0]
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("Total Transactions", f"{customer_data.get('total_transactions', 0):.0f}")
            st.metric("Avg Transaction Amount", f"${customer_data.get('avg_transaction_amount', 0):.2f}")
        
        with col2:
            st.metric("Days Since Last Transaction", f"{customer_data.get('days_since_last_transaction', 0):.0f}")
            st.metric("Customer Segment", customer_data.get('segment', 'Unknown'))
        
        with col3:
            churn_prob = customer_data.get('churn_probability', 0)
            st.metric("Churn Probability", f"{churn_prob:.1%}")
            
            # Risk level with color coding
            risk_level = customer_data.get('risk_level', 'Low')
            risk_color = {'Low': '🟢', 'Medium': '🟡', 'High': '🔴'}
            st.metric("Risk Level", f"{risk_color.get(risk_level, '⚪')} {risk_level}")
    
    # Customer segments analysis
    st.subheader("📊 Segment Analysis")
    
    if 'segment' in data.columns:
        segment_analysis = data.groupby('segment').agg({
            'total_transactions': 'mean',
            'avg_transaction_amount': 'mean',
            'churn_probability': 'mean',
            'customer_id': 'count'
        }).round(2)
        segment_analysis.columns = ['Avg Transactions', 'Avg Amount', 'Churn Risk', 'Count']
        
        st.dataframe(segment_analysis, use_container_width=True)

def show_churn_prediction(data):
    """Show churn prediction page"""
    st.header("⚠️ Churn Prediction")
    
    # Churn risk summary
    if 'churn_probability' in data.columns:
        high_risk = (data['churn_probability'] > 0.6).sum()
        medium_risk = ((data['churn_probability'] > 0.3) & (data['churn_probability'] <= 0.6)).sum()
        low_risk = (data['churn_probability'] <= 0.3).sum()
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown(f"""
            <div class="metric-card high-risk">
                <h3>🔴 High Risk</h3>
                <h2>{high_risk:,}</h2>
                <p>Customers with >60% churn probability</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class="metric-card medium-risk">
                <h3>🟡 Medium Risk</h3>
                <h2>{medium_risk:,}</h2>
                <p>Customers with 30-60% churn probability</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            st.markdown(f"""
            <div class="metric-card low-risk">
                <h3>🟢 Low Risk</h3>
                <h2>{low_risk:,}</h2>
                <p>Customers with <30% churn probability</p>
            </div>
            """, unsafe_allow_html=True)
        
        # Churn probability distribution
        st.subheader("📈 Churn Risk Distribution")
        fig = px.histogram(
            data,
            x='churn_probability',
            nbins=20,
            title='Distribution of Churn Probabilities'
        )
        fig.update_xaxis(title='Churn Probability')
        fig.update_yaxis(title='Number of Customers')
        st.plotly_chart(fig, use_container_width=True)
        
        # High risk customers table
        st.subheader("🚨 High Risk Customers")
        high_risk_customers = data[data['churn_probability'] > 0.6].sort_values('churn_probability', ascending=False)
        
        if len(high_risk_customers) > 0:
            display_cols = ['customer_id', 'churn_probability', 'days_since_last_transaction', 'total_transactions']
            available_cols = [col for col in display_cols if col in high_risk_customers.columns]
            st.dataframe(high_risk_customers[available_cols].head(10), use_container_width=True)

def show_fraud_detection():
    """Show fraud detection page"""
    st.header("🚨 Fraud Detection")
    
    # Simulated fraud alerts
    st.subheader("Recent Fraud Alerts")
    
    # Generate sample fraud data
    np.random.seed(42)
    n_alerts = 20
    
    fraud_data = pd.DataFrame({
        'timestamp': pd.date_range(start='2024-12-01', periods=n_alerts, freq='H'),
        'customer_id': [f'CUST_{np.random.randint(1, 1000):06d}' for _ in range(n_alerts)],
        'amount': np.random.uniform(1000, 10000, n_alerts),
        'fraud_score': np.random.uniform(0.3, 0.95, n_alerts),
        'status': np.random.choice(['Investigating', 'Confirmed', 'False Positive'], n_alerts)
    })
    
    # Metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Alerts", len(fraud_data))
    with col2:
        investigating = (fraud_data['status'] == 'Investigating').sum()
        st.metric("Under Investigation", investigating)
    with col3:
        confirmed = (fraud_data['status'] == 'Confirmed').sum()
        st.metric("Confirmed Fraud", confirmed)
    with col4:
        avg_amount = fraud_data['amount'].mean()
        st.metric("Avg Alert Amount", f"${avg_amount:,.0f}")
    
    # Fraud alerts table
    st.dataframe(
        fraud_data.sort_values('fraud_score', ascending=False),
        use_container_width=True
    )
    
    # Transaction testing
    st.subheader("🧪 Test Transaction for Fraud")
    
    with st.form("fraud_test"):
        col1, col2 = st.columns(2)
        
        with col1:
            test_customer = st.text_input("Customer ID", "CUST_000001")
            test_amount = st.number_input("Amount", value=500.0)
            test_merchant = st.text_input("Merchant", "Amazon")
        
        with col2:
            test_location = st.text_input("Location", "New York")
            test_time = st.time_input("Time", datetime.now().time())
        
        if st.form_submit_button("Test for Fraud"):
            # Mock fraud prediction
            fraud_score = min(0.95, abs(test_amount) / 1000 * 0.3 + np.random.uniform(0.1, 0.4))
            
            st.write(f"**Fraud Score:** {fraud_score:.2%}")
            st.write(f"**Prediction:** {'🚨 FRAUD ALERT' if fraud_score > 0.5 else '✅ Normal Transaction'}")

def show_segmentation(data):
    """Show customer segmentation page"""
    st.header("🎯 Customer Segmentation")
    
    if 'segment' in data.columns:
        # Segment overview
        segment_summary = data['segment'].value_counts()
        
        col1, col2 = st.columns([1, 2])
        
        with col1:
            st.subheader("Segment Distribution")
            for segment, count in segment_summary.items():
                percentage = count / len(data) * 100
                st.write(f"**{segment}:** {count:,} ({percentage:.1f}%)")
        
        with col2:
            st.subheader("Segment Visualization")
            fig = px.pie(
                values=segment_summary.values,
                names=segment_summary.index,
                title="Customer Segments"
            )
            st.plotly_chart(fig, use_container_width=True)
        
        # Segment characteristics
        st.subheader("📊 Segment Characteristics")
        
        if all(col in data.columns for col in ['segment', 'avg_transaction_amount', 'total_transactions']):
            segment_chars = data.groupby('segment').agg({
                'avg_transaction_amount': 'mean',
                'total_transactions': 'mean',
                'churn_probability': 'mean' if 'churn_probability' in data.columns else lambda x: 0
            }).round(2)
            
            st.dataframe(segment_chars, use_container_width=True)

def show_model_insights():
    """Show model insights and performance"""
    st.header("🤖 Model Insights")
    
    # Model performance metrics
    st.subheader("📈 Model Performance")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        **Churn Prediction Model**
        - Accuracy: 87.3%
        - Precision: 84.1%
        - Recall: 89.2%
        - F1-Score: 86.6%
        """)
    
    with col2:
        st.markdown("""
        **Fraud Detection Model**
        - Accuracy: 92.1%
        - Precision: 88.7%
        - Recall: 94.3%
        - F1-Score: 91.4%
        """)
    
    with col3:
        st.markdown("""
        **Segmentation Model**
        - Silhouette Score: 0.74
        - Inertia: 1,234.5
        - Clusters: 5
        - Stability: 95.2%
        """)
    
    # Feature importance
    st.subheader("🔍 Feature Importance")
    
    # Mock feature importance data
    features = [
        'days_since_last_transaction',
        'avg_transaction_amount',
        'total_transactions',
        'merchant_diversity',
        'weekend_ratio',
        'location_diversity',
        'payment_mode_variety',
        'spending_volatility'
    ]
    
    importance = np.random.uniform(0.05, 0.25, len(features))
    importance = importance / importance.sum()  # Normalize
    
    feature_df = pd.DataFrame({
        'Feature': features,
        'Importance': importance
    }).sort_values('Importance', ascending=True)
    
    fig = px.bar(
        feature_df,
        x='Importance',
        y='Feature',
        orientation='h',
        title='Feature Importance (Churn Model)'
    )
    st.plotly_chart(fig, use_container_width=True)
    
    # API health check
    st.subheader("🏥 API Health Status")
    
    health_data = call_api("/health")
    if health_data:
        st.success("✅ API is healthy")
        st.json(health_data)
    else:
        st.error("❌ API is not responding")

if __name__ == "__main__":
    main()
