export interface NavigationItem {
  name: string;
  icon: string;
  key: string;
  description: string;
  href: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const NAVIGATION_CONFIG: NavigationSection[] = [
  {
    title: "CORE ANALYTICS",
    items: [
      {
        name: "Overview",
        icon: "📊",
        key: "overview",
        description: "Executive dashboard with key metrics and insights",
        href: "/overview"
      },
      {
        name: "Customer Analytics",
        icon: "📈",
        key: "customer-analytics",
        description: "Deep dive into customer behavior and patterns",
        href: "/customer-analytics"
      },
      {
        name: "Customer Management",
        icon: "👥",
        key: "customer-management",
        description: "Manage customer profiles and relationships",
        href: "/customer-management"
      }
    ]
  },
  {
    title: "AI & MACHINE LEARNING",
    items: [
      {
        name: "Churn Prediction",
        icon: "🔮",
        key: "churn-prediction",
        description: "Predict customer churn probability using ML models",
        href: "/churn-prediction"
      },
      {
        name: "Fraud Detection",
        icon: "🛡️",
        key: "fraud-detection",
        description: "Real-time fraud detection and prevention",
        href: "/fraud-detection"
      },
      {
        name: "Customer Segmentation",
        icon: "🎯",
        key: "segmentation",
        description: "Intelligent customer segmentation analysis",
        href: "/segmentation"
      },
      {
        name: "Model Insights",
        icon: "🧠",
        key: "model-insights",
        description: "AI model performance and feature importance",
        href: "/model-insights"
      }
    ]
  },
  {
    title: "TECHNICAL",
    items: [
      {
        name: "Feature Engineering",
        icon: "🔧",
        key: "feature-engineering",
        description: "Data preprocessing and feature creation tools",
        href: "/feature-engineering"
      },
      {
        name: "API Documentation",
        icon: "🔌",
        key: "api-documentation",
        description: "Interactive API documentation and testing",
        href: "/api-documentation"
      }
    ]
  }
];

export const BRAND_CONFIG = {
  title: "FinTech",
  accent: "Bank",
  subtitle: "AI Analytics Platform"
};
