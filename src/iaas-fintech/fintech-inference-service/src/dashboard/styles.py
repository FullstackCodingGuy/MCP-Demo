"""
CSS styles for the Fintech Inference Service Dashboard
Contains all styling for modern navigation and UI components
"""

NAVIGATION_CSS = """
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
    
    /* Breadcrumb styling */
    .breadcrumb {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-family: 'Inter', sans-serif;
        font-size: 0.85rem;
        font-weight: 500;
        margin-bottom: 1rem;
        border: 1px solid rgba(59, 130, 246, 0.2);
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
"""

def get_navigation_css():
    """Get the navigation CSS styles"""
    return NAVIGATION_CSS
