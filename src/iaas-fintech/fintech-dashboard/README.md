# FinTechBank Dashboard

A modern, enterprise-grade dashboard built with Next.js for the Fintech Inference Service. This application provides comprehensive analytics, customer management, and AI-powered insights for financial services.

## Features

### 🏦 Core Analytics
- **Executive Dashboard**: Key metrics, charts, and high-level insights
- **Customer Analytics**: Deep dive into customer behavior patterns
- **Customer Management**: Comprehensive customer profile management with search, filtering, and pagination

### 🤖 AI & Machine Learning
- **Churn Prediction**: ML-powered customer churn probability prediction
- **Fraud Detection**: Real-time fraud detection and prevention
- **Customer Segmentation**: Intelligent customer segmentation analysis
- **Model Insights**: AI model performance and feature importance visualization

### 🔧 Technical Tools
- **Feature Engineering**: Data preprocessing and feature creation tools
- **API Documentation**: Interactive API documentation with testing capabilities

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Headless UI
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory
```bash
cd src/iaas-fintech/fintech-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── overview/           # Executive dashboard
│   ├── customer-management/ # Customer management interface
│   ├── churn-prediction/   # ML churn prediction tools
│   ├── feature-engineering/ # Feature engineering interface
│   └── api-documentation/  # API docs and testing
├── components/             # Reusable React components
│   └── Navigation.tsx      # Main navigation component
├── config/                 # Configuration files
│   └── navigation.ts       # Navigation structure and routes
├── lib/                    # Utility libraries
│   ├── api.ts             # API client configuration
│   └── utils.ts           # Helper functions and data generation
└── types/                  # TypeScript type definitions
    └── index.ts           # Interface definitions
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Key Features

### Navigation
- Modern header-based navigation with dropdown menus
- Responsive design with hover states
- Active page highlighting

### Dashboard Pages
- **Overview**: Executive metrics with charts and KPIs
- **Customer Management**: Full CRUD interface with advanced filtering
- **Churn Prediction**: Interactive ML prediction tools
- **Feature Engineering**: Data pipeline visualization and management
- **API Documentation**: Interactive API explorer

### Data Visualization
- Interactive charts using Recharts
- Real-time data updates
- Responsive chart layouts

Built with ❤️ for enterprise financial services
