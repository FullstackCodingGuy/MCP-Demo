"""
Customer Management and Analytics Page
"""

import streamlit as st
import pandas as pd
import requests
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from datetime import datetime, timedelta
import json

# Page configuration
st.set_page_config(
    page_title="Customer Management - Fintech Inference Service",
    page_icon="👥",
    layout="wide"
)

def get_api_base_url():
    """Get the API base URL"""
    return "http://localhost:8000/api/v1"

def fetch_customers(page=1, page_size=50, search="", age_min=None, age_max=None, location=""):
    """Fetch customers from API"""
    try:
        params = {
            "page": page,
            "page_size": page_size
        }
        if search:
            params["search"] = search
        if age_min:
            params["age_min"] = age_min
        if age_max:
            params["age_max"] = age_max
        if location:
            params["location"] = location
            
        response = requests.get(f"{get_api_base_url()}/customers", params=params)
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Error fetching customers: {response.status_code}")
            return None
    except Exception as e:
        st.error(f"Error connecting to API: {e}")
        return None

def fetch_customer_detail(customer_id):
    """Fetch detailed customer information"""
    try:
        response = requests.get(f"{get_api_base_url()}/customers/{customer_id}")
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Error fetching customer details: {response.status_code}")
            return None
    except Exception as e:
        st.error(f"Error connecting to API: {e}")
        return None

def fetch_customer_transactions(customer_id, page=1, page_size=100, category="", date_from="", date_to=""):
    """Fetch customer transactions"""
    try:
        params = {
            "page": page,
            "page_size": page_size
        }
        if category:
            params["category"] = category
        if date_from:
            params["date_from"] = date_from
        if date_to:
            params["date_to"] = date_to
            
        response = requests.get(f"{get_api_base_url()}/customers/{customer_id}/transactions", params=params)
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Error fetching transactions: {response.status_code}")
            return None
    except Exception as e:
        st.error(f"Error connecting to API: {e}")
        return None

def fetch_customer_analytics():
    """Fetch customer analytics"""
    try:
        response = requests.get(f"{get_api_base_url()}/analytics/customers")
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Error fetching analytics: {response.status_code}")
            return None
    except Exception as e:
        st.error(f"Error connecting to API: {e}")
        return None

def fetch_transaction_analytics(days=30):
    """Fetch transaction analytics"""
    try:
        response = requests.get(f"{get_api_base_url()}/analytics/transactions", params={"days": days})
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Error fetching transaction analytics: {response.status_code}")
            return None
    except Exception as e:
        st.error(f"Error connecting to API: {e}")
        return None

def display_customer_overview():
    """Display customer analytics overview"""
    st.header("📊 Customer Analytics Overview")
    
    analytics = fetch_customer_analytics()
    if not analytics:
        st.error("Unable to load customer analytics")
        return
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            "Total Customers",
            f"{analytics['demographics']['total_customers']:,}"
        )
    
    with col2:
        st.metric(
            "Total Transactions",
            f"{analytics['transactions']['total_transactions']:,}"
        )
    
    with col3:
        st.metric(
            "Total Volume",
            f"${analytics['transactions']['total_volume']:,.2f}"
        )
    
    with col4:
        st.metric(
            "Fraud Rate",
            f"{analytics['transactions']['fraud_rate']:.2f}%"
        )
    
    # Charts row 1
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Customer Age Distribution")
        age_dist = analytics['demographics']['age_distribution']
        fig = go.Figure(data=[go.Bar(
            x=['Min', 'Q1', 'Median', 'Q3', 'Max'],
            y=[age_dist['min'], age_dist['25%'], age_dist['50%'], age_dist['75%'], age_dist['max']]
        )])
        fig.update_layout(title="Age Statistics", height=300)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.subheader("Account Type Distribution")
        account_types = analytics['demographics']['account_type_distribution']
        fig = px.pie(
            values=list(account_types.values()),
            names=list(account_types.keys()),
            title="Account Types"
        )
        fig.update_layout(height=300)
        st.plotly_chart(fig, use_container_width=True)
    
    # Charts row 2
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Top Locations")
        locations = analytics['demographics']['location_distribution']
        fig = px.bar(
            x=list(locations.values())[:10],
            y=list(locations.keys())[:10],
            orientation='h',
            title="Customer Distribution by Location"
        )
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.subheader("Credit Score Distribution")
        credit_dist = analytics['demographics']['credit_score_distribution']
        fig = px.bar(
            x=list(credit_dist.keys()),
            y=list(credit_dist.values()),
            title="Credit Score Categories"
        )
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    # Customer activity metrics
    st.subheader("🎯 Customer Activity Insights")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(
            "Avg Transactions/Customer",
            f"{analytics['customer_activity']['avg_transactions_per_customer']:.1f}"
        )
    
    activity_dist = analytics['customer_activity']['customer_activity_distribution']
    with col2:
        st.metric("High Activity Customers", f"{activity_dist['high']:,}")
    
    with col3:
        st.metric("Low Activity Customers", f"{activity_dist['low']:,}")
    
    # Top customers
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Top Customers by Volume")
        top_volume = analytics['customer_activity']['top_customers_by_volume']
        df_volume = pd.DataFrame(top_volume)
        df_volume['total_amount'] = df_volume['total_amount'].apply(lambda x: f"${x:,.2f}")
        st.dataframe(df_volume, use_container_width=True, hide_index=True)
    
    with col2:
        st.subheader("Top Customers by Frequency")
        top_freq = analytics['customer_activity']['top_customers_by_frequency']
        df_freq = pd.DataFrame(top_freq)
        st.dataframe(df_freq, use_container_width=True, hide_index=True)

def display_customers_list():
    """Display searchable customers list"""
    st.header("👥 Customer Directory")
    
    # Search and filter controls
    col1, col2, col3, col4 = st.columns([3, 1, 1, 2])
    
    with col1:
        search_term = st.text_input("🔍 Search customers", placeholder="Enter customer ID or name...")
    
    with col2:
        age_min = st.number_input("Min Age", min_value=18, max_value=100, value=18)
    
    with col3:
        age_max = st.number_input("Max Age", min_value=18, max_value=100, value=100)
    
    with col4:
        location_filter = st.text_input("Location", placeholder="Filter by location...")
    
    # Page size selection
    page_size = st.selectbox("Customers per page", [25, 50, 100, 200], index=1)
    
    # Initialize session state for pagination
    if 'customer_page' not in st.session_state:
        st.session_state.customer_page = 1
    
    # Fetch customers
    customers_data = fetch_customers(
        page=st.session_state.customer_page,
        page_size=page_size,
        search=search_term,
        age_min=age_min if age_min != 18 else None,
        age_max=age_max if age_max != 100 else None,
        location=location_filter
    )
    
    if not customers_data:
        st.error("Unable to load customers")
        return
    
    customers = customers_data['customers']
    pagination = customers_data['pagination']
    
    # Display pagination info
    st.write(f"Showing {len(customers)} of {pagination['total_customers']} customers (Page {pagination['page']} of {pagination['total_pages']})")
    
    # Pagination controls
    col1, col2, col3, col4, col5 = st.columns([1, 1, 2, 1, 1])
    
    with col1:
        if st.button("⏮️ First", disabled=not pagination['has_prev']):
            st.session_state.customer_page = 1
            st.rerun()
    
    with col2:
        if st.button("⬅️ Previous", disabled=not pagination['has_prev']):
            st.session_state.customer_page -= 1
            st.rerun()
    
    with col3:
        new_page = st.number_input(
            "Page", 
            min_value=1, 
            max_value=pagination['total_pages'], 
            value=pagination['page'],
            key="page_input"
        )
        if new_page != pagination['page']:
            st.session_state.customer_page = new_page
            st.rerun()
    
    with col4:
        if st.button("➡️ Next", disabled=not pagination['has_next']):
            st.session_state.customer_page += 1
            st.rerun()
    
    with col5:
        if st.button("⏭️ Last", disabled=not pagination['has_next']):
            st.session_state.customer_page = pagination['total_pages']
            st.rerun()
    
    # Display customers table
    if customers:
        df = pd.DataFrame(customers)
        
        # Format columns for better display
        if 'annual_income' in df.columns:
            df['annual_income'] = df['annual_income'].apply(lambda x: f"${x:,.0f}")
        if 'total_amount' in df.columns:
            df['total_amount'] = df['total_amount'].apply(lambda x: f"${x:,.2f}")
        if 'avg_transaction_amount' in df.columns:
            df['avg_transaction_amount'] = df['avg_transaction_amount'].apply(lambda x: f"${x:.2f}")
        
        # Select columns to display
        display_columns = [
            'customer_id', 'name', 'age', 'location', 'account_type', 
            'credit_score', 'annual_income'
        ]
        
        # Add transaction columns if available
        if 'total_transactions' in df.columns:
            display_columns.extend(['total_transactions', 'total_amount', 'churn_risk'])
        
        # Filter columns that exist
        display_columns = [col for col in display_columns if col in df.columns]
        
        # Display the table with clickable rows
        event = st.dataframe(
            df[display_columns],
            use_container_width=True,
            hide_index=True,
            on_select="rerun",
            selection_mode="single-row"
        )
        
        # Handle row selection
        if event.selection and len(event.selection['rows']) > 0:
            selected_row = event.selection['rows'][0]
            selected_customer = customers[selected_row]
            st.session_state.selected_customer_id = selected_customer['customer_id']
            st.session_state.show_customer_detail = True
    else:
        st.info("No customers found matching your criteria.")

def display_customer_detail():
    """Display detailed customer information"""
    if 'selected_customer_id' not in st.session_state:
        st.info("Please select a customer from the list to view details.")
        return
    
    customer_id = st.session_state.selected_customer_id
    
    # Back button
    if st.button("⬅️ Back to Customer List"):
        st.session_state.show_customer_detail = False
        st.rerun()
    
    st.header(f"📋 Customer Details: {customer_id}")
    
    # Fetch customer details
    customer_data = fetch_customer_detail(customer_id)
    if not customer_data:
        st.error("Unable to load customer details")
        return
    
    customer = customer_data['customer']
    features = customer_data['features']
    transaction_summary = customer_data['transaction_summary']
    
    # Customer basic info
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.subheader("📱 Basic Information")
        st.write(f"**Name:** {customer['name']}")
        st.write(f"**Age:** {customer['age']}")
        st.write(f"**Location:** {customer['location']}")
        st.write(f"**Email:** {customer['email']}")
        st.write(f"**Phone:** {customer['phone']}")
    
    with col2:
        st.subheader("💳 Account Information")
        st.write(f"**Account Type:** {customer['account_type']}")
        st.write(f"**Credit Score:** {customer['credit_score']}")
        st.write(f"**Annual Income:** ${customer['annual_income']:,.2f}")
        st.write(f"**Join Date:** {customer['join_date']}")
    
    with col3:
        st.subheader("📊 Transaction Summary")
        st.metric("Total Transactions", transaction_summary['total_transactions'])
        st.metric("Total Amount", f"${transaction_summary['total_amount']:,.2f}")
        st.metric("Average Amount", f"${transaction_summary['avg_amount']:.2f}")
    
    # Customer features (if available)
    if features:
        st.subheader("🎯 Customer Features & Risk Profile")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Days Since Last Transaction", int(features.get('days_since_last_transaction', 0)))
        
        with col2:
            st.metric("Customer Lifetime (Days)", int(features.get('customer_lifetime_days', 0)))
        
        with col3:
            st.metric("Unique Merchants", int(features.get('unique_merchants', 0)))
        
        with col4:
            churn_risk = "High" if features.get('days_since_last_transaction', 0) > 60 else "Low"
            st.metric("Churn Risk", churn_risk)
    
    # Transaction categories
    if transaction_summary['top_categories']:
        st.subheader("🛍️ Top Transaction Categories")
        categories_df = pd.DataFrame(
            list(transaction_summary['top_categories'].items()),
            columns=['Category', 'Count']
        )
        
        fig = px.bar(
            categories_df,
            x='Count',
            y='Category',
            orientation='h',
            title="Transaction Count by Category"
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Monthly spending trend
    if transaction_summary['monthly_spending']:
        st.subheader("📈 Monthly Spending Trend")
        monthly_data = {str(k): v for k, v in transaction_summary['monthly_spending'].items()}
        
        fig = px.line(
            x=list(monthly_data.keys()),
            y=list(monthly_data.values()),
            title="Monthly Spending Pattern"
        )
        fig.update_layout(xaxis_title="Month", yaxis_title="Amount ($)")
        st.plotly_chart(fig, use_container_width=True)
    
    # Recent transactions
    st.subheader("💳 Recent Transactions")
    
    # Transaction filters
    col1, col2, col3 = st.columns(3)
    
    with col1:
        category_filter = st.selectbox(
            "Filter by Category",
            ["All"] + list(transaction_summary['top_categories'].keys()) if transaction_summary['top_categories'] else ["All"]
        )
    
    with col2:
        date_from = st.date_input("From Date", value=datetime.now() - timedelta(days=30))
    
    with col3:
        date_to = st.date_input("To Date", value=datetime.now())
    
    # Fetch transactions
    transactions_data = fetch_customer_transactions(
        customer_id,
        category=category_filter if category_filter != "All" else "",
        date_from=date_from.isoformat(),
        date_to=date_to.isoformat()
    )
    
    if transactions_data and transactions_data['transactions']:
        transactions_df = pd.DataFrame(transactions_data['transactions'])
        
        # Format for display
        transactions_df['transaction_date'] = pd.to_datetime(transactions_df['transaction_date']).dt.strftime('%Y-%m-%d %H:%M')
        transactions_df['amount'] = transactions_df['amount'].apply(lambda x: f"${x:.2f}")
        
        # Add fraud indicator
        transactions_df['fraud_status'] = transactions_df['is_fraud'].apply(lambda x: "🚨 Fraud" if x else "✅ Normal")
        
        display_columns = [
            'transaction_date', 'amount', 'category', 'merchant', 
            'payment_method', 'fraud_status'
        ]
        
        st.dataframe(
            transactions_df[display_columns],
            use_container_width=True,
            hide_index=True
        )
    else:
        st.info("No transactions found for the selected period and filters.")

def display_transaction_analytics():
    """Display transaction analytics and trends"""
    st.header("📈 Transaction Analytics")
    
    # Time period selector
    days = st.selectbox("Analysis Period", [7, 30, 60, 90, 180, 365], index=1)
    
    analytics = fetch_transaction_analytics(days)
    if not analytics:
        st.error("Unable to load transaction analytics")
        return
    
    summary = analytics['summary']
    
    # Key metrics
    st.subheader("📊 Summary Metrics")
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        st.metric("Total Transactions", f"{summary['total_transactions']:,}")
    
    with col2:
        st.metric("Total Volume", f"${summary['total_volume']:,.2f}")
    
    with col3:
        st.metric("Avg Transaction", f"${summary['avg_transaction_amount']:.2f}")
    
    with col4:
        st.metric("Fraud Rate", f"{summary['fraud_rate']:.2f}%")
    
    with col5:
        st.metric("Unique Customers", f"{summary['unique_customers']:,}")
    
    # Daily trends
    if analytics['daily_trends']:
        st.subheader("📅 Daily Transaction Trends")
        daily_df = pd.DataFrame(analytics['daily_trends'])
        daily_df['date'] = pd.to_datetime(daily_df['date'])
        
        fig = make_subplots(
            rows=2, cols=1,
            subplot_titles=('Transaction Volume ($)', 'Transaction Count'),
            vertical_spacing=0.1
        )
        
        fig.add_trace(
            go.Scatter(x=daily_df['date'], y=daily_df['total_amount'], name='Volume'),
            row=1, col=1
        )
        
        fig.add_trace(
            go.Scatter(x=daily_df['date'], y=daily_df['transaction_count'], name='Count'),
            row=2, col=1
        )
        
        fig.update_layout(height=500, showlegend=False)
        st.plotly_chart(fig, use_container_width=True)
    
    # Category and time pattern analysis
    col1, col2 = st.columns(2)
    
    with col1:
        if analytics['category_breakdown']:
            st.subheader("🛍️ Category Breakdown")
            category_df = pd.DataFrame(analytics['category_breakdown'])
            
            fig = px.bar(
                category_df,
                x='total_amount',
                y='category',
                orientation='h',
                title="Transaction Volume by Category"
            )
            st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        if analytics['time_patterns']['hourly']:
            st.subheader("🕐 Hourly Transaction Pattern")
            hourly_data = analytics['time_patterns']['hourly']
            
            fig = px.bar(
                x=list(hourly_data.keys()),
                y=list(hourly_data.values()),
                title="Transactions by Hour of Day"
            )
            fig.update_layout(xaxis_title="Hour", yaxis_title="Transaction Count")
            st.plotly_chart(fig, use_container_width=True)
    
    # Top merchants and payment methods
    col1, col2 = st.columns(2)
    
    with col1:
        if analytics['top_merchants']:
            st.subheader("🏪 Top Merchants")
            merchants_df = pd.DataFrame(
                list(analytics['top_merchants'].items()),
                columns=['Merchant', 'Transactions']
            )
            st.dataframe(merchants_df, use_container_width=True, hide_index=True)
    
    with col2:
        if analytics['payment_methods']:
            st.subheader("💳 Payment Methods")
            payment_df = pd.DataFrame(
                list(analytics['payment_methods'].items()),
                columns=['Payment Method', 'Count']
            )
            
            fig = px.pie(
                payment_df,
                values='Count',
                names='Payment Method',
                title="Payment Method Distribution"
            )
            st.plotly_chart(fig, use_container_width=True)

def main():
    """Main function for customer management page"""
    st.title("👥 Customer Management & Analytics")
    st.markdown("---")
    
    # Navigation tabs
    tab1, tab2, tab3, tab4 = st.tabs([
        "📊 Analytics Overview",
        "👥 Customer Directory", 
        "📋 Customer Details",
        "📈 Transaction Analytics"
    ])
    
    with tab1:
        display_customer_overview()
    
    with tab2:
        display_customers_list()
    
    with tab3:
        if st.session_state.get('show_customer_detail', False):
            display_customer_detail()
        else:
            st.info("👆 Select a customer from the Customer Directory tab to view detailed information.")
    
    with tab4:
        display_transaction_analytics()

if __name__ == "__main__":
    main()
