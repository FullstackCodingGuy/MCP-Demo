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

# Custom CSS for modern navigation
st.markdown("""
<style>
    /* Import modern fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    
    /* Hide default Streamlit elements */
    .css-1d391kg {
        padding-top: 0rem;
    }
    
    /* Sidebar container */
    .css-1aumxhk {
        background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%);
        border-right: 3px solid #475569;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
    }
    
    /* Remove default styling */
    .css-1v0mbdj > .css-1aumxhk > .css-1aumxhk {
        background: transparent;
    }
    
    /* Hide default selectbox */
    .stSelectbox {
        display: none !important;
    }
    
    /* Modern brand header */
    .brand-header {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        padding: 1.8rem 1.2rem;
        margin: -1rem -1rem 2rem -1rem;
        text-align: center;
        border-radius: 0 0 20px 20px;
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        position: relative;
        overflow: hidden;
    }
    
    .brand-header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
        transform: rotate(30deg);
        animation: shine 4s infinite;
    }
    
    @keyframes shine {
        0% { transform: translateX(-100%) translateY(-100%) rotate(30deg); }
        100% { transform: translateX(100%) translateY(100%) rotate(30deg); }
    }
    
    .brand-title {
        font-family: 'Inter', sans-serif;
        font-size: 1.5rem;
        font-weight: 800;
        margin: 0;
        position: relative;
        z-index: 2;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .brand-subtitle {
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        font-weight: 400;
        opacity: 0.95;
        margin: 0.6rem 0 0 0;
        position: relative;
        z-index: 2;
    }
    
    /* Navigation sections */
    .nav-section {
        color: #94a3b8;
        font-family: 'Inter', sans-serif;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        margin: 2.5rem 0 1.2rem 0;
        padding: 0 0.8rem;
        position: relative;
    }
    
    .nav-section::after {
        content: '';
        position: absolute;
        bottom: -0.6rem;
        left: 0.8rem;
        right: 0.8rem;
        height: 2px;
        background: linear-gradient(90deg, #475569 0%, transparent 100%);
        border-radius: 1px;
    }
    
    /* Navigation items */
    .nav-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 1rem 1.2rem;
        margin: 0.4rem 0;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: #e2e8f0;
        text-decoration: none;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        font-size: 0.95rem;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    
    .nav-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.15), transparent);
        transition: left 0.6s ease;
    }
    
    .nav-item:hover::before {
        left: 100%;
    }
    
    .nav-item:hover {
        background: rgba(59, 130, 246, 0.12);
        border-color: rgba(59, 130, 246, 0.4);
        color: #93c5fd;
        transform: translateX(6px) scale(1.02);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.25);
    }
    
    .nav-item.active {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(29, 78, 216, 0.25) 100%);
        border-color: #3b82f6;
        color: #93c5fd;
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
        transform: translateX(4px);
    }
    
    .nav-icon {
        margin-right: 1rem;
        font-size: 1.2rem;
        width: 1.4rem;
        text-align: center;
        flex-shrink: 0;
        opacity: 0.9;
    }
    
    .nav-text {
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    /* Status panel */
    .status-panel {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 16px;
        padding: 1.5rem;
        margin: 2.5rem 0;
        color: #e2e8f0;
        font-family: 'Inter', sans-serif;
        backdrop-filter: blur(10px);
    }
    
    .status-title {
        font-weight: 700;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        color: #cbd5e1;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.8rem 0;
        font-size: 0.85rem;
        font-weight: 500;
    }
    
    .status-indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-left: 0.5rem;
        box-shadow: 0 0 6px currentColor;
    }
    
    .status-online { 
        background-color: #10b981; 
        box-shadow: 0 0 8px #10b981;
    }
    .status-warning { 
        background-color: #f59e0b; 
        box-shadow: 0 0 8px #f59e0b;
    }
    .status-offline { 
        background-color: #ef4444; 
        box-shadow: 0 0 8px #ef4444;
    }
    
    /* Enhanced metric cards */
    .metric-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        padding: 1.8rem;
        border-radius: 16px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
        font-family: 'Inter', sans-serif;
    }
    
    .metric-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        border-color: rgba(59, 130, 246, 0.3);
    }
    
    .high-risk {
        border-left: 5px solid #dc2626;
    }
    .medium-risk {
        border-left: 5px solid #f59e0b;
    }
    .low-risk {
        border-left: 5px solid #059669;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .nav-item {
            padding: 0.9rem 1rem;
            font-size: 0.9rem;
        }
        
        .nav-icon {
            margin-right: 0.8rem;
            font-size: 1.1rem;
        }
        
        .brand-title {
            font-size: 1.3rem;
        }
        
        .brand-subtitle {
            font-size: 0.8rem;
        }
    }
</style>
""", unsafe_allow_html=True)

# API Configuration
API_BASE_URL = "http://localhost:8000"

# Initialize session state for navigation
if 'current_page' not in st.session_state:
    st.session_state.current_page = 'Overview'

def render_modern_sidebar():
    """Render modern sidebar navigation"""
    with st.sidebar:
        # Brand header
        st.markdown("""
        <div class="brand-header">
            <div class="brand-title">🏦 FinTech AI</div>
            <div class="brand-subtitle">Enterprise Intelligence Platform</div>
        </div>
        """, unsafe_allow_html=True)
        
        # Navigation structure
        navigation_sections = {
            "CORE ANALYTICS": [
                {"name": "Overview", "icon": "📊", "key": "Overview"},
                {"name": "Customer Analytics", "icon": "📈", "key": "Customer Analytics"},
                {"name": "Customer Management", "icon": "👥", "key": "👥 Customer Management"}
            ],
            "AI & MACHINE LEARNING": [
                {"name": "Churn Prediction", "icon": "🔮", "key": "🔮 Churn Prediction"},
                {"name": "Fraud Detection", "icon": "🛡️", "key": "Fraud Detection"},
                {"name": "Customer Segmentation", "icon": "🎯", "key": "Segmentation"},
                {"name": "Model Insights", "icon": "🧠", "key": "Model Insights"}
            ],
            "TECHNICAL": [
                {"name": "Feature Engineering", "icon": "🔧", "key": "🔧 Feature Engineering"},
                {"name": "API Documentation", "icon": "🔌", "key": "🔌 API Documentation"}
            ]
        }
        
        # Render navigation sections
        for section_title, items in navigation_sections.items():
            st.markdown(f'<div class="nav-section">{section_title}</div>', unsafe_allow_html=True)
            
            for item in items:
                is_active = st.session_state.current_page == item["key"]
                active_class = "active" if is_active else ""
                
                # Create navigation button
                if st.button(
                    f"{item['icon']} {item['name']}", 
                    key=f"nav_{item['key']}", 
                    use_container_width=True,
                    type="primary" if is_active else "secondary"
                ):
                    st.session_state.current_page = item["key"]
                    st.rerun()
        
        # Status panel
        st.markdown("""
        <div class="status-panel">
            <div class="status-title">System Status</div>
            <div class="status-item">
                <span>API Server</span>
                <span class="status-indicator status-online"></span>
            </div>
            <div class="status-item">
                <span>ML Models</span>
                <span class="status-indicator status-online"></span>
            </div>
            <div class="status-item">
                <span>Database</span>
                <span class="status-indicator status-warning"></span>
            </div>
            <div class="status-item">
                <span>Cache</span>
                <span class="status-indicator status-online"></span>
            </div>
        </div>
        """, unsafe_allow_html=True)

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

# Placeholder functions
def show_feature_engineering_placeholder():
    """Show feature engineering placeholder page"""
    st.header("🔧 Feature Engineering")
    st.info("This page provides documentation and tools for feature engineering processes.")
    
    st.subheader("📋 Available Features")
    
    features_info = {
        "Customer Features": [
            "Days since last transaction",
            "Average transaction amount",
            "Total transactions count",
            "Customer lifetime value"
        ],
        "Transaction Features": [
            "Transaction frequency patterns",
            "Spending volatility",
            "Merchant diversity",
            "Geographic distribution"
        ],
        "Behavioral Features": [
            "Weekend transaction ratio",
            "Night transaction ratio", 
            "Payment method preferences",
            "Session duration patterns"
        ]
    }
    
    col1, col2, col3 = st.columns(3)
    
    for i, (category, features) in enumerate(features_info.items()):
        with [col1, col2, col3][i]:
            st.markdown(f"**{category}**")
            for feature in features:
                st.markdown(f"• {feature}")

def show_api_docs_placeholder():
    """Show API documentation placeholder page"""
    st.header("🔌 API Documentation")
    st.info("Comprehensive documentation for the Fintech Inference Service API.")
    
    st.subheader("📖 Available Endpoints")
    
    endpoints = [
        {
            "method": "GET",
            "endpoint": "/health",
            "description": "Health check endpoint",
            "response": "System status information"
        },
        {
            "method": "POST", 
            "endpoint": "/predict/churn",
            "description": "Predict customer churn probability",
            "response": "Churn probability score"
        },
        {
            "method": "POST",
            "endpoint": "/predict/fraud", 
            "description": "Detect fraudulent transactions",
            "response": "Fraud risk assessment"
        },
        {
            "method": "GET",
            "endpoint": "/customers/{id}",
            "description": "Get customer information",
            "response": "Customer profile data"
        }
    ]
    
    for endpoint in endpoints:
        with st.expander(f"{endpoint['method']} {endpoint['endpoint']}"):
            st.write(f"**Description:** {endpoint['description']}")
            st.write(f"**Response:** {endpoint['response']}")
            st.code(f"""
# Example usage
import requests

response = requests.{endpoint['method'].lower()}(
    "http://localhost:8000{endpoint['endpoint']}"
)
print(response.json())
            """, language="python")

def show_churn_prediction(data):
    """Show churn prediction page with built-in functionality"""
    st.header("🔮 Churn Prediction")
    
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

# Main dashboard
def main():
    st.title("🏦 Fintech Inference Dashboard")
    st.markdown("AI-powered insights for banking and fintech applications")
    
    # Sidebar
    render_modern_sidebar()
    
    page = st.session_state.current_page
    
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
            # Fallback to customer analytics
            show_customer_analytics(data)
    elif page == "🔧 Feature Engineering":
        # Import and run feature engineering documentation page
        try:
            import sys
            import os
            sys.path.append(os.path.join(os.path.dirname(__file__), 'pages'))
            from feature_engineering import main as feature_engineering_main
            feature_engineering_main()
        except Exception as e:
            st.error(f"Error loading feature engineering page: {e}")
            st.info("Please ensure the feature data files are available")
            # Show placeholder content
            show_feature_engineering_placeholder()
    elif page == "🔮 Churn Prediction":
        # Import and run churn prediction documentation page
        try:
            import sys
            import os
            sys.path.append(os.path.join(os.path.dirname(__file__), 'pages'))
            from churn_prediction import main as churn_prediction_main
            churn_prediction_main()
        except Exception as e:
            st.error(f"Error loading churn prediction page: {e}")
            st.info("Please ensure the API server is running for interactive features")
            # Fallback to built-in churn prediction
            show_churn_prediction(data)
    elif page == "🔌 API Documentation":
        # Import and run API documentation page
        try:
            import sys
            import os
            sys.path.append(os.path.join(os.path.dirname(__file__), 'pages'))
            from api_documentation import main as api_docs_main
            api_docs_main()
        except Exception as e:
            st.error(f"Error loading API documentation page: {e}")
            st.info("Please ensure the API server is running for live endpoint testing")
            # Show placeholder content
            show_api_docs_placeholder()
    elif page == "Customer Analytics":
        show_customer_analytics(data)
    elif page == "Fraud Detection":
        show_fraud_detection()
    elif page == "Segmentation":
        show_segmentation(data)
    elif page == "Model Insights":
        show_model_insights()
    else:
        # Default to overview
        show_overview(data)

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
