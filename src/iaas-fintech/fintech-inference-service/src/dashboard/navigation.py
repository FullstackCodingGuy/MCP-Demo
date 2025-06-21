"""
Navigation module for the Fintech Inference Service Dashboard
Contains all navigation-related configurations and rendering functions
"""

import streamlit as st

# Navigation configuration
NAVIGATION_CONFIG = {
    "brand": {
        "title": "🏦 FinTech AI",
        "subtitle": "Enterprise Intelligence Platform"
    },
    "sections": {
        "CORE ANALYTICS": [
            {
                "name": "Overview", 
                "icon": "📊", 
                "key": "Overview",
                "description": "Executive dashboard with key metrics and insights"
            },
            {
                "name": "Customer Analytics", 
                "icon": "📈", 
                "key": "Customer Analytics",
                "description": "Deep dive into customer behavior and patterns"
            },
            {
                "name": "Customer Management", 
                "icon": "👥", 
                "key": "👥 Customer Management",
                "description": "Manage customer profiles and relationships"
            }
        ],
        "AI & MACHINE LEARNING": [
            {
                "name": "Churn Prediction", 
                "icon": "🔮", 
                "key": "🔮 Churn Prediction",
                "description": "Predict customer churn probability using ML models"
            },
            {
                "name": "Fraud Detection", 
                "icon": "🛡️", 
                "key": "Fraud Detection",
                "description": "Real-time fraud detection and prevention"
            },
            {
                "name": "Customer Segmentation", 
                "icon": "🎯", 
                "key": "Segmentation",
                "description": "Intelligent customer segmentation analysis"
            },
            {
                "name": "Model Insights", 
                "icon": "🧠", 
                "key": "Model Insights",
                "description": "AI model performance and feature importance"
            }
        ],
        "TECHNICAL": [
            {
                "name": "Feature Engineering", 
                "icon": "🔧", 
                "key": "🔧 Feature Engineering",
                "description": "Data preprocessing and feature creation tools"
            },
            {
                "name": "API Documentation", 
                "icon": "🔌", 
                "key": "🔌 API Documentation",
                "description": "Interactive API documentation and testing"
            }
        ]
    },
    "status_indicators": [
        {"name": "API Server", "status": "online"},
        {"name": "ML Models", "status": "online"},
        {"name": "Database", "status": "warning"},
        {"name": "Cache", "status": "online"}
    ]
}

def initialize_navigation_state():
    """Initialize navigation session state"""
    if 'current_page' not in st.session_state:
        st.session_state.current_page = 'Overview'

def get_navigation_config():
    """Get the navigation configuration"""
    return NAVIGATION_CONFIG

def get_all_page_keys():
    """Get all available page keys"""
    keys = []
    for section_items in NAVIGATION_CONFIG["sections"].values():
        for item in section_items:
            keys.append(item["key"])
    return keys

def get_page_info(page_key):
    """Get information about a specific page"""
    for section_items in NAVIGATION_CONFIG["sections"].values():
        for item in section_items:
            if item["key"] == page_key:
                return item
    return None

def render_brand_header():
    """Render the brand header section"""
    brand = NAVIGATION_CONFIG["brand"]
    return f"""
    <div class="brand-header">
        <div class="brand-title">{brand["title"]}</div>
        <div class="brand-subtitle">{brand["subtitle"]}</div>
    </div>
    """

def render_status_panel():
    """Render the system status panel"""
    status_html = """
    <div class="status-panel">
        <div class="status-title">System Status</div>
    """
    
    for indicator in NAVIGATION_CONFIG["status_indicators"]:
        status_class = f"status-{indicator['status']}"
        status_html += f"""
        <div class="status-item">
            <span>{indicator["name"]}</span>
            <span class="status-indicator {status_class}"></span>
        </div>
        """
    
    status_html += "</div>"
    return status_html

def render_navigation_section(section_title, items):
    """Render a navigation section with its items"""
    # Render section header
    st.markdown(f'<div class="nav-section">{section_title}</div>', unsafe_allow_html=True)
    
    # Render navigation items
    for item in items:
        is_active = st.session_state.current_page == item["key"]
        
        # Create navigation button
        if st.button(
            f"{item['icon']} {item['name']}", 
            key=f"nav_{item['key']}", 
            use_container_width=True,
            type="primary" if is_active else "secondary",
            help=item.get("description", "")
        ):
            st.session_state.current_page = item["key"]
            st.rerun()

def render_modern_sidebar():
    """Render the complete modern sidebar navigation"""
    with st.sidebar:
        # Brand header
        st.markdown(render_brand_header(), unsafe_allow_html=True)
        
        # Navigation sections
        for section_title, items in NAVIGATION_CONFIG["sections"].items():
            render_navigation_section(section_title, items)
        
        # Status panel
        st.markdown(render_status_panel(), unsafe_allow_html=True)

def get_current_page():
    """Get the current page from session state"""
    return st.session_state.get('current_page', 'Overview')

def set_current_page(page_key):
    """Set the current page in session state"""
    if page_key in get_all_page_keys():
        st.session_state.current_page = page_key
        return True
    return False

def get_page_breadcrumb():
    """Get breadcrumb for current page"""
    current_page = get_current_page()
    page_info = get_page_info(current_page)
    
    if page_info:
        # Find which section this page belongs to
        for section_name, items in NAVIGATION_CONFIG["sections"].items():
            if any(item["key"] == current_page for item in items):
                return f"{section_name} > {page_info['name']}"
    
    return current_page
