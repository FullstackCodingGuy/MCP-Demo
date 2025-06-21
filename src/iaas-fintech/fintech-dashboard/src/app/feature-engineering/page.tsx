'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Settings, Database, TrendingUp, Zap, Code, Play, Download, ChevronDown, ChevronRight, Clock, DollarSign, Activity, Target, Calendar, User, CreditCard, MapPin, TrendingDown } from 'lucide-react';

interface FeatureDetail {
  name: string;
  description: string;
  mlApplication: string;
}

interface FeatureCategory {
  title: string;
  count: number;
  description: string;
  businessImpact: string;
  example: string;
  features: FeatureDetail[];
  icon: React.ComponentType<any>;
  color: string;
}

const CUSTOMER_FEATURE_CATEGORIES: Record<string, FeatureCategory> = {
  recency: {
    title: "Recency Features",
    count: 3,
    description: "Time-based features measuring customer activity recency",
    businessImpact: "Critical for churn prediction and customer retention strategies",
    example: "Customer with 45 days since last transaction has higher churn risk",
    icon: Clock,
    color: "bg-red-500",
    features: [
      {
        name: "days_since_last_transaction",
        description: "Days since the customer's most recent transaction",
        mlApplication: "Churn prediction - customers with high values likely to churn"
      },
      {
        name: "days_since_first_transaction", 
        description: "Total days since customer's first transaction",
        mlApplication: "Customer lifetime and loyalty measurement"
      },
      {
        name: "customer_lifetime_days",
        description: "Active period from first to last transaction",
        mlApplication: "Customer engagement duration"
      }
    ]
  },
  frequency: {
    title: "Frequency Features",
    count: 8,
    description: "Transaction frequency and diversity metrics",
    businessImpact: "Customer segmentation and engagement level assessment",
    example: "High-frequency customers (>50 transactions/month) are premium segments",
    icon: Activity,
    color: "bg-blue-500",
    features: [
      {
        name: "total_transactions",
        description: "Total number of transactions by customer",
        mlApplication: "Activity level indicator"
      },
      {
        name: "unique_merchants",
        description: "Number of different merchants visited",
        mlApplication: "Shopping diversity"
      },
      {
        name: "unique_categories",
        description: "Number of different spending categories",
        mlApplication: "Spending diversity"
      },
      {
        name: "unique_locations",
        description: "Number of different transaction locations",
        mlApplication: "Geographic diversity"
      },
      {
        name: "avg_transactions_per_day",
        description: "Average daily transaction frequency",
        mlApplication: "Activity intensity"
      },
      {
        name: "avg_transactions_per_week",
        description: "Average weekly transaction frequency",
        mlApplication: "Weekly activity pattern"
      },
      {
        name: "avg_transactions_per_month",
        description: "Average monthly transaction frequency",
        mlApplication: "Monthly activity pattern"
      },
      {
        name: "avg_transactions_per_year",
        description: "Average annual transaction frequency",
        mlApplication: "Yearly activity pattern"
      }
    ]
  },
  monetary: {
    title: "Monetary Features",
    count: 17,
    description: "Financial behavior and spending pattern analysis",
    businessImpact: "Credit scoring, loan approval, premium service targeting",
    example: "Customer with income_expense_ratio > 1.2 and savings_rate > 20% is low credit risk",
    icon: DollarSign,
    color: "bg-green-500",
    features: [
      {
        name: "total_amount",
        description: "Sum of all transaction amounts",
        mlApplication: "Total customer value"
      },
      {
        name: "avg_transaction_amount",
        description: "Average transaction amount",
        mlApplication: "Typical spending level"
      },
      {
        name: "median_transaction_amount",
        description: "Median transaction amount",
        mlApplication: "Typical spending (outlier-resistant)"
      },
      {
        name: "std_transaction_amount",
        description: "Standard deviation of amounts",
        mlApplication: "Spending consistency"
      },
      {
        name: "min_transaction_amount",
        description: "Smallest transaction amount",
        mlApplication: "Minimum spending threshold"
      },
      {
        name: "max_transaction_amount",
        description: "Largest transaction amount",
        mlApplication: "Maximum spending capacity"
      },
      {
        name: "total_expenses",
        description: "Sum of all negative amounts (expenses)",
        mlApplication: "Total spending"
      },
      {
        name: "avg_expense_amount",
        description: "Average expense amount",
        mlApplication: "Typical expense size"
      },
      {
        name: "max_expense_amount",
        description: "Largest single expense",
        mlApplication: "Major purchase capability"
      },
      {
        name: "expense_transaction_count",
        description: "Number of expense transactions",
        mlApplication: "Spending frequency"
      },
      {
        name: "total_income",
        description: "Sum of all positive amounts (income)",
        mlApplication: "Total earnings"
      },
      {
        name: "avg_income_amount",
        description: "Average income amount",
        mlApplication: "Typical income size"
      },
      {
        name: "max_income_amount",
        description: "Largest income transaction",
        mlApplication: "Income capacity"
      },
      {
        name: "income_transaction_count",
        description: "Number of income transactions",
        mlApplication: "Income frequency"
      },
      {
        name: "net_cash_flow",
        description: "Total income minus total expenses",
        mlApplication: "Financial health"
      },
      {
        name: "income_expense_ratio",
        description: "Ratio of income to expenses",
        mlApplication: "Financial stability"
      },
      {
        name: "savings_rate",
        description: "Net cash flow as percentage of income",
        mlApplication: "Saving behavior"
      }
    ]
  },
  category: {
    title: "Category Features",
    count: 20,
    description: "Spending behavior across different merchant categories",
    businessImpact: "Targeted marketing, category-specific offers, lifestyle segmentation",
    example: "Customer with 40% grocery spending is family-focused, good target for family products",
    icon: Target,
    color: "bg-purple-500",
    features: [
      {
        name: "grocery_total_spend",
        description: "Total spending on groceries",
        mlApplication: "Essential spending"
      },
      {
        name: "grocery_transaction_count",
        description: "Number of grocery transactions",
        mlApplication: "Grocery shopping frequency"
      },
      {
        name: "grocery_avg_amount",
        description: "Average grocery transaction amount",
        mlApplication: "Grocery spending level"
      },
      {
        name: "restaurant_total_spend",
        description: "Total restaurant spending",
        mlApplication: "Dining habits"
      },
      {
        name: "restaurant_transaction_count",
        description: "Restaurant transaction frequency",
        mlApplication: "Dining frequency"
      },
      {
        name: "restaurant_avg_amount",
        description: "Average restaurant spending",
        mlApplication: "Dining spending level"
      },
      {
        name: "gas_total_spend",
        description: "Total fuel spending",
        mlApplication: "Transportation costs"
      },
      {
        name: "gas_transaction_count",
        description: "Number of fuel transactions",
        mlApplication: "Fuel purchase frequency"
      },
      {
        name: "gas_avg_amount",
        description: "Average fuel transaction",
        mlApplication: "Fuel spending pattern"
      },
      {
        name: "retail_total_spend",
        description: "Total retail spending",
        mlApplication: "Shopping behavior"
      },
      {
        name: "retail_transaction_count",
        description: "Retail transaction frequency",
        mlApplication: "Shopping frequency"
      },
      {
        name: "retail_avg_amount",
        description: "Average retail spending",
        mlApplication: "Retail spending level"
      },
      {
        name: "entertainment_total_spend",
        description: "Entertainment spending",
        mlApplication: "Leisure spending"
      },
      {
        name: "entertainment_transaction_count",
        description: "Entertainment frequency",
        mlApplication: "Entertainment habits"
      },
      {
        name: "entertainment_avg_amount",
        description: "Average entertainment spending",
        mlApplication: "Entertainment budget"
      },
      {
        name: "grocery_spend_percentage",
        description: "Grocery as % of total spending",
        mlApplication: "Essential spending ratio"
      },
      {
        name: "restaurant_spend_percentage",
        description: "Restaurant as % of total spending",
        mlApplication: "Dining spending ratio"
      },
      {
        name: "gas_spend_percentage",
        description: "Fuel as % of total spending",
        mlApplication: "Transportation ratio"
      },
      {
        name: "retail_spend_percentage",
        description: "Retail as % of total spending",
        mlApplication: "Shopping ratio"
      },
      {
        name: "entertainment_spend_percentage",
        description: "Entertainment as % of total spending",
        mlApplication: "Leisure ratio"
      }
    ]
  },
  temporal: {
    title: "Temporal Features",
    count: 6,
    description: "Time-based spending patterns and preferences",
    businessImpact: "Promotional timing, customer service scheduling, targeted campaigns",
    example: "Customer with high weekend spending gets weekend-specific promotions",
    icon: Calendar,
    color: "bg-orange-500",
    features: [
      {
        name: "avg_transaction_hour",
        description: "Average hour of transactions",
        mlApplication: "Daily activity pattern"
      },
      {
        name: "most_common_hour",
        description: "Most frequent transaction hour",
        mlApplication: "Peak activity time"
      },
      {
        name: "weekend_transaction_ratio",
        description: "Weekend vs weekday transaction ratio",
        mlApplication: "Weekend activity level"
      },
      {
        name: "most_common_day",
        description: "Most frequent transaction day",
        mlApplication: "Preferred transaction day"
      },
      {
        name: "weekend_weekday_spending_ratio",
        description: "Weekend vs weekday spending ratio",
        mlApplication: "Weekend spending behavior"
      },
      {
        name: "most_frequent_category",
        description: "Most common spending category",
        mlApplication: "Primary spending focus"
      }
    ]
  },
  trend: {
    title: "Trend Features",
    count: 4,
    description: "Spending and activity trends over time",
    businessImpact: "Growth prediction, capacity planning, risk assessment",
    example: "Positive spending trend indicates growing customer value",
    icon: TrendingUp,
    color: "bg-indigo-500",
    features: [
      {
        name: "monthly_spending_trend",
        description: "Monthly spending growth/decline rate",
        mlApplication: "Spending trajectory"
      },
      {
        name: "monthly_frequency_trend",
        description: "Monthly transaction frequency trend",
        mlApplication: "Activity trajectory"
      },
      {
        name: "spending_volatility",
        description: "Variability in monthly spending",
        mlApplication: "Spending consistency"
      },
      {
        name: "frequency_volatility",
        description: "Variability in transaction frequency",
        mlApplication: "Activity consistency"
      }
    ]
  },
  behavioral: {
    title: "Behavioral Features",
    count: 7,
    description: "Customer preferences and loyalty patterns",
    businessImpact: "Loyalty programs, merchant partnerships, personalized services",
    example: "High merchant loyalty score (>0.3) indicates strong brand preference",
    icon: User,
    color: "bg-pink-500",
    features: [
      {
        name: "most_used_payment_mode",
        description: "Preferred payment method",
        mlApplication: "Payment preference"
      },
      {
        name: "payment_mode_diversity",
        description: "Number of different payment methods",
        mlApplication: "Payment flexibility"
      },
      {
        name: "location_diversity",
        description: "Geographic spending diversity",
        mlApplication: "Travel/mobility pattern"
      },
      {
        name: "most_common_location",
        description: "Most frequent transaction location",
        mlApplication: "Primary location"
      },
      {
        name: "merchant_loyalty_score",
        description: "Loyalty to top merchant",
        mlApplication: "Brand loyalty"
      },
      {
        name: "top_merchant",
        description: "Most frequented merchant",
        mlApplication: "Preferred merchant"
      },
      {
        name: "small_transaction_ratio",
        description: "Ratio of small transactions (<$50)",
        mlApplication: "Micro-spending behavior"
      }
    ]
  }
};

const TRANSACTION_FEATURE_CATEGORIES: Record<string, FeatureCategory> = {
  basic: {
    title: "Basic Features",
    count: 2,
    description: "Fundamental transaction attributes for ML models",
    businessImpact: "Basic transaction processing and analysis",
    example: "abs_amount used for transaction size-based fraud detection",
    icon: CreditCard,
    color: "bg-gray-500",
    features: [
      {
        name: "amount",
        description: "Transaction amount (positive/negative)",
        mlApplication: "Financial impact analysis"
      },
      {
        name: "abs_amount",
        description: "Absolute transaction amount",
        mlApplication: "Transaction size analysis"
      }
    ]
  },
  context: {
    title: "Context Features",
    count: 4,
    description: "Historical context for current transaction",
    businessImpact: "Fraud detection, anomaly identification, customer behavior analysis",
    example: "amount_vs_avg_ratio > 5.0 indicates potentially fraudulent large transaction",
    icon: Database,
    color: "bg-yellow-500",
    features: [
      {
        name: "is_first_transaction",
        description: "1 if customer's first transaction, 0 otherwise",
        mlApplication: "New customer identification"
      },
      {
        name: "days_since_last_transaction",
        description: "Days since customer's previous transaction",
        mlApplication: "Activity gap analysis"
      },
      {
        name: "amount_vs_avg_ratio",
        description: "Current amount vs customer's historical average",
        mlApplication: "Spending deviation detection"
      },
      {
        name: "frequency_last_7_days",
        description: "Number of transactions in past 7 days",
        mlApplication: "Recent activity level"
      }
    ]
  },
  historical: {
    title: "Historical Features",
    count: 2,
    description: "Customer's transaction history context",
    businessImpact: "Pattern recognition, customer journey analysis",
    example: "First-time merchant (merchant_seen_before=0) increases fraud risk",
    icon: TrendingDown,
    color: "bg-teal-500",
    features: [
      {
        name: "frequency_last_30_days",
        description: "Number of transactions in past 30 days",
        mlApplication: "Monthly activity pattern"
      },
      {
        name: "merchant_seen_before",
        description: "1 if customer used this merchant before",
        mlApplication: "Merchant familiarity"
      }
    ]
  },
  pattern: {
    title: "Pattern Features",
    count: 2,
    description: "Behavioral pattern recognition",
    businessImpact: "Fraud detection, customer preference analysis",
    example: "New location + new category + large amount = high fraud risk",
    icon: MapPin,
    color: "bg-emerald-500",
    features: [
      {
        name: "category_seen_before",
        description: "1 if customer shopped this category before",
        mlApplication: "Category familiarity"
      },
      {
        name: "location_seen_before",
        description: "1 if customer transacted at this location before",
        mlApplication: "Location familiarity"
      }
    ]
  }
};

export default function FeatureEngineeringPage() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'customer' | 'transaction' | 'examples' | 'ml'>('architecture');
  const [expandedCustomerCategories, setExpandedCustomerCategories] = useState<Set<string>>(new Set());
  const [expandedTransactionCategories, setExpandedTransactionCategories] = useState<Set<string>>(new Set());

  const totalCustomerFeatures = Object.values(CUSTOMER_FEATURE_CATEGORIES).reduce((sum, cat) => sum + cat.count, 0);
  const totalTransactionFeatures = Object.values(TRANSACTION_FEATURE_CATEGORIES).reduce((sum, cat) => sum + cat.count, 0);

  const toggleCustomerCategory = (category: string) => {
    const newExpanded = new Set(expandedCustomerCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCustomerCategories(newExpanded);
  };

  const toggleTransactionCategory = (category: string) => {
    const newExpanded = new Set(expandedTransactionCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedTransactionCategories(newExpanded);
  };

  // Feature importance data for ML models
  const featureImportanceData = [
    { name: 'days_since_last_transaction', importance: 0.25, model: 'Churn' },
    { name: 'amount_vs_avg_ratio', importance: 0.18, model: 'Fraud' },
    { name: 'total_transactions', importance: 0.15, model: 'Churn' },
    { name: 'merchant_seen_before', importance: 0.12, model: 'Fraud' },
    { name: 'avg_transaction_amount', importance: 0.10, model: 'Segmentation' },
    { name: 'location_seen_before', importance: 0.08, model: 'Fraud' },
    { name: 'frequency_last_30_days', importance: 0.07, model: 'Fraud' },
    { name: 'monthly_spending_trend', importance: 0.05, model: 'Churn' }
  ];

  // Performance metrics
  const performanceMetrics = [
    { metric: 'Feature Calculation', value: '<100ms', description: 'Per transaction' },
    { metric: 'Model Inference', value: '<50ms', description: 'Per prediction' },
    { metric: 'Batch Processing', value: '1M+', description: 'Customers in <30min' },
    { metric: 'Feature Freshness', value: '<1 hour', description: 'Customer features' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Settings className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feature Engineering Documentation</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive documentation of all {totalCustomerFeatures + totalTransactionFeatures} features powering our ML models
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customer Features</p>
              <p className="text-2xl font-bold text-blue-600">{totalCustomerFeatures}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transaction Features</p>
              <p className="text-2xl font-bold text-green-600">{totalTransactionFeatures}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Feature Categories</p>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(CUSTOMER_FEATURE_CATEGORIES).length + Object.keys(TRANSACTION_FEATURE_CATEGORIES).length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Status</p>
              <p className="text-lg font-bold text-green-600">Active</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { key: 'architecture', label: '🏗️ Feature Architecture', desc: 'System overview' },
              { key: 'customer', label: `👤 Customer Features (${totalCustomerFeatures})`, desc: 'Behavioral profiles' },
              { key: 'transaction', label: `💳 Transaction Features (${totalTransactionFeatures})`, desc: 'Real-time context' },
              { key: 'examples', label: '📈 Feature Examples', desc: 'Data analysis' },
              { key: 'ml', label: '🎯 ML Applications', desc: 'Model usage' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 min-w-0 px-4 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-75 mt-1">{tab.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Data Flow</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <pre>{`Raw Transaction Data
        ↓
Data Preprocessing
        ↓
Feature Extraction
├── Customer-Level Features (${totalCustomerFeatures})
│   ├── Recency Features (3)
│   ├── Frequency Features (8)
│   ├── Monetary Features (17)
│   ├── Category Features (20)
│   ├── Temporal Features (6)
│   ├── Trend Features (4)
│   └── Behavioral Features (7)
└── Transaction-Level Features (${totalTransactionFeatures})
    ├── Basic Features (2)
    ├── Context Features (4)
    ├── Historical Features (2)
    └── Pattern Features (2)
        ↓
ML Model Training`}</pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Feature Purpose</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <h4 className="font-semibold text-blue-900 mb-2">Customer Features - Aggregated insights about customer behavior:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• <strong>Churn Prediction:</strong> Identify customers likely to leave</li>
                        <li>• <strong>Customer Segmentation:</strong> Group customers by behavior</li>
                        <li>• <strong>Risk Assessment:</strong> Evaluate customer credit risk</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <h4 className="font-semibold text-green-900 mb-2">Transaction Features - Real-time transaction context:</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• <strong>Fraud Detection:</strong> Identify suspicious transactions</li>
                        <li>• <strong>Anomaly Detection:</strong> Spot unusual patterns</li>
                        <li>• <strong>Risk Scoring:</strong> Real-time transaction risk assessment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">⏱️ Feature Generation Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { step: 1, title: "Data Ingestion", desc: "Raw transactions from CSV/database" },
                    { step: 2, title: "Preprocessing", desc: "Clean data, handle missing values, type conversion" },
                    { step: 3, title: "Customer Aggregation", desc: "Group transactions by customer_id" },
                    { step: 4, title: "Feature Calculation", desc: "Apply statistical and behavioral algorithms" },
                    { step: 5, title: "Feature Storage", desc: "Save to processed CSV files for ML models" },
                    { step: 6, title: "Real-time Updates", desc: "Incremental feature updates for new transactions" }
                  ].map((item) => (
                    <div key={item.step} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {item.step}
                        </div>
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🔧 Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.metric} className="text-center p-4 border border-gray-200 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{metric.value}</div>
                      <div className="text-sm font-semibold text-gray-900">{metric.metric}</div>
                      <div className="text-xs text-gray-500">{metric.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customer' && (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">👤 Customer Features ({totalCustomerFeatures} Features)</h3>
                <p className="text-gray-600">Comprehensive behavioral profile for each customer based on transaction history</p>
              </div>

              {Object.entries(CUSTOMER_FEATURE_CATEGORIES).map(([key, category]) => {
                const IconComponent = category.icon;
                const isExpanded = expandedCustomerCategories.has(key);
                
                return (
                  <div key={key} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleCustomerCategory(key)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 ${category.color} text-white rounded-lg`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {category.title} ({category.count})
                          </h4>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Business Impact:</strong> {category.businessImpact}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>Example:</strong> {category.example}
                          </p>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left p-2 font-semibold text-gray-900">Feature</th>
                                <th className="text-left p-2 font-semibold text-gray-900">Description</th>
                                <th className="text-left p-2 font-semibold text-gray-900">ML Application</th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.features.map((feature, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                  <td className="p-2">
                                    <code className="text-xs bg-white px-2 py-1 rounded border">
                                      {feature.name}
                                    </code>
                                  </td>
                                  <td className="p-2 text-gray-700">{feature.description}</td>
                                  <td className="p-2 text-gray-600">{feature.mlApplication}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'transaction' && (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">💳 Transaction Features ({totalTransactionFeatures} Features)</h3>
                <p className="text-gray-600">Real-time contextual features for each individual transaction</p>
              </div>

              {Object.entries(TRANSACTION_FEATURE_CATEGORIES).map(([key, category]) => {
                const IconComponent = category.icon;
                const isExpanded = expandedTransactionCategories.has(key);
                
                return (
                  <div key={key} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleTransactionCategory(key)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 ${category.color} text-white rounded-lg`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {category.title} ({category.count})
                          </h4>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Business Impact:</strong> {category.businessImpact}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>Example:</strong> {category.example}
                          </p>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left p-2 font-semibold text-gray-900">Feature</th>
                                <th className="text-left p-2 font-semibold text-gray-900">Description</th>
                                <th className="text-left p-2 font-semibold text-gray-900">ML Application</th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.features.map((feature, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                  <td className="p-2">
                                    <code className="text-xs bg-white px-2 py-1 rounded border">
                                      {feature.name}
                                    </code>
                                  </td>
                                  <td className="p-2 text-gray-700">{feature.description}</td>
                                  <td className="p-2 text-gray-600">{feature.mlApplication}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">📈 Feature Examples & Analysis</h3>
                <p className="text-gray-600">Sample data and analysis of key features</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">👤 Customer Feature Example</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`{
  "customer_id": "CUST_000001",
  "days_since_last_transaction": 3,      // Recent activity
  "total_transactions": 94,               // High activity
  "avg_transaction_amount": -87.47,      // Regular spending
  "merchant_loyalty_score": 0.34,        // High loyalty
  "weekend_transaction_ratio": 0.28,     // Weekend activity
  "churn_risk": "Low"                    // ML prediction
}`}</pre>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">💳 Transaction Feature Example</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`{
  "transaction_id": "TXN_208998",
  "amount": -49.95,
  "amount_vs_avg_ratio": 0.57,           // Below average
  "days_since_last_transaction": 2,      // Recent
  "merchant_seen_before": 1,             // Familiar merchant
  "fraud_risk": "Low"                    // ML prediction
}`}</pre>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🔗 Feature Correlation Analysis</h4>
                <p className="text-gray-600 mb-4">Understanding relationships between key features</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">High-Impact Feature Correlations</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-red-50 rounded">
                        <span>days_since_last_transaction ↔ churn_risk</span>
                        <span className="font-semibold text-red-600">+0.85</span>
                      </div>
                      <div className="flex justify-between p-2 bg-blue-50 rounded">
                        <span>total_transactions ↔ customer_value</span>
                        <span className="font-semibold text-blue-600">+0.72</span>
                      </div>
                      <div className="flex justify-between p-2 bg-green-50 rounded">
                        <span>merchant_loyalty_score ↔ retention</span>
                        <span className="font-semibold text-green-600">+0.68</span>
                      </div>
                      <div className="flex justify-between p-2 bg-orange-50 rounded">
                        <span>amount_vs_avg_ratio ↔ fraud_risk</span>
                        <span className="font-semibold text-orange-600">+0.61</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Feature Statistics</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Most Important Feature</span>
                        <code className="text-xs bg-white px-2 py-1 rounded">days_since_last_transaction</code>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Most Correlated Pair</span>
                        <span className="text-xs">recency ↔ churn</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Average Feature Importance</span>
                        <span className="font-semibold">12.7%</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Features {'>'}10% Importance</span>
                        <span className="font-semibold">18 features</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ml' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🎯 ML Model Applications</h3>
                <p className="text-gray-600">How features are used across different machine learning models</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    🔮 Churn Prediction Model
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Key Features Used:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <code>days_since_last_transaction</code> (most important)</li>
                        <li>• <code>monthly_spending_trend</code></li>
                        <li>• <code>total_transactions</code></li>
                        <li>• <code>avg_transaction_amount</code></li>
                        <li>• <code>frequency_volatility</code></li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Model Logic:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• High recency ({'>'}30 days) + declining trend = High churn risk</li>
                        <li>• Low transaction frequency + high volatility = Medium risk</li>
                        <li>• Stable patterns + recent activity = Low risk</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Business Value:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Early identification of at-risk customers</li>
                        <li>• Targeted retention campaigns</li>
                        <li>• Customer lifetime value optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Database className="h-5 w-5 text-orange-500" />
                    🚨 Fraud Detection Model
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Key Transaction Features:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <code>amount_vs_avg_ratio</code> (amount deviation)</li>
                        <li>• <code>days_since_last_transaction</code> (unusual timing)</li>
                        <li>• <code>merchant_seen_before</code> (new merchant risk)</li>
                        <li>• <code>location_seen_before</code> (new location risk)</li>
                        <li>• <code>frequency_last_7_days</code> (velocity checks)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Fraud Indicators:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Amount 5x+ larger than average</li>
                        <li>• New merchant + new location</li>
                        <li>• Unusual time gaps between transactions</li>
                        <li>• High velocity ({'>'}10 transactions in 24 hours)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Real-time Scoring:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Risk score 0-100 calculated instantly</li>
                        <li>• Automatic blocking for high-risk transactions</li>
                        <li>• Manual review for medium-risk transactions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    🏷️ Customer Segmentation
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Key Features Used:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Monetary features (spending levels)</li>
                        <li>• Category percentage features</li>
                        <li>• Behavioral features (loyalty, diversity)</li>
                        <li>• Temporal patterns</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Segments:</h5>
                      <div className="space-y-2">
                        <div className="p-2 bg-green-50 rounded text-sm">
                          <strong>Premium:</strong> High spending + high loyalty
                        </div>
                        <div className="p-2 bg-blue-50 rounded text-sm">
                          <strong>Frequent:</strong> High frequency + diverse categories
                        </div>
                        <div className="p-2 bg-yellow-50 rounded text-sm">
                          <strong>Occasional:</strong> Low frequency + specific categories
                        </div>
                        <div className="p-2 bg-purple-50 rounded text-sm">
                          <strong>New:</strong> Recent customers + growing patterns
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Feature Importance Across Models</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={featureImportanceData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="importance" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🔄 Production Pipeline</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Pipeline Steps:</h5>
                    <ol className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">1</span>
                        <div>
                          <strong>Real-time Stream:</strong> New transactions trigger feature calculation
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">2</span>
                        <div>
                          <strong>Batch Processing:</strong> Daily refresh of customer-level features
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">3</span>
                        <div>
                          <strong>Model Inference:</strong> Features fed to ML models for predictions
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">4</span>
                        <div>
                          <strong>Feature Store:</strong> Cached features for low-latency serving
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">5</span>
                        <div>
                          <strong>Monitoring:</strong> Feature drift detection and model performance tracking
                        </div>
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Performance Metrics:</h5>
                    <div className="grid grid-cols-2 gap-4">
                      {performanceMetrics.map((metric) => (
                        <div key={metric.metric} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{metric.value}</div>
                          <div className="text-xs text-gray-600">{metric.metric}</div>
                          <div className="text-xs text-gray-500">{metric.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
