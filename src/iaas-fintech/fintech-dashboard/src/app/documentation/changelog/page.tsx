'use client';

import { BookOpen, CheckCircle, Zap, Settings, Users, BarChart3, RefreshCw } from "lucide-react"

export default function ChangelogPage() {
  const versions = [
    {
      version: "0.0.9",
      date: "2024-01-15",
      type: "major",
      title: "Navigation Extraction Complete!",
      description: "Successfully extracted all navigation menu items into separate, modular files",
      changes: [
        {
          type: "added",
          icon: Settings,
          title: "Modular Navigation System",
          description: "Complete navigation logic extracted into separate files",
          details: [
            "Created /navigation.py with complete navigation configuration",
            "Added /styles.py with enterprise-grade CSS styling",
            "Generated comprehensive documentation in NAVIGATION_README.md",
            "Updated app.py to use modular navigation components"
          ]
        },
        {
          type: "improved",
          icon: BarChart3,
          title: "Navigation Structure",
          description: "Organized navigation into 3 main sections with 9 pages",
          details: [
            "CORE ANALYTICS: Overview, Customer Analytics, Customer Management",
            "AI & MACHINE LEARNING: Churn Prediction, Fraud Detection, Segmentation, Model Insights",
            "TECHNICAL: Feature Engineering, API Documentation"
          ]
        },
        {
          type: "added",
          icon: Zap,
          title: "Enhanced Features",
          description: "Added modern UI components and functionality",
          details: [
            "Session state management for navigation",
            "Breadcrumb navigation system",
            "Responsive design for mobile devices",
            "Smooth animations and hover effects",
            "Accessibility features and keyboard navigation"
          ]
        }
      ]
    },
    {
      version: "0.0.8",
      date: "2024-01-10",
      type: "minor",
      title: "API Integration & Testing",
      description: "Comprehensive API testing and documentation improvements",
      changes: [
        {
          type: "added",
          icon: CheckCircle,
          title: "Test Suite Enhancement",
          description: "Added 17 comprehensive tests with 100% pass rate",
          details: [
            "API endpoint testing",
            "Model prediction validation",
            "Feature engineering tests",
            "Data processing validation"
          ]
        },
        {
          type: "improved",
          icon: RefreshCw,
          title: "Performance Optimization",
          description: "Improved model accuracy and system performance",
          details: [
            "Model Accuracy: 87.5%",
            "Precision: 77.4%",
            "Recall: 87.5%",
            "F1-Score: 82.1%"
          ]
        }
      ]
    },
    {
      version: "0.0.7",
      date: "2024-01-05",
      type: "major",
      title: "ML Pipeline & Data Processing",
      description: "Complete machine learning pipeline with feature engineering",
      changes: [
        {
          type: "added",
          icon: BarChart3,
          title: "Feature Engineering",
          description: "Comprehensive feature creation and processing",
          details: [
            "67 customer-level features",
            "12 transaction-level features",
            "Automated feature scaling and normalization",
            "Feature importance analysis"
          ]
        },
        {
          type: "added",
          icon: Zap,
          title: "ML Model Training",
          description: "XGBoost model for churn prediction",
          details: [
            "Cross-validation with 5 folds",
            "Hyperparameter tuning",
            "Model persistence and versioning",
            "Performance monitoring"
          ]
        }
      ]
    },
    {
      version: "0.0.6",
      date: "2023-12-28",
      type: "minor",
      title: "Data Generation & Validation",
      description: "Synthetic data generation for realistic testing scenarios",
      changes: [
        {
          type: "added",
          icon: Users,
          title: "Synthetic Data Generator",
          description: "Realistic customer and transaction data generation",
          details: [
            "1000 synthetic customers",
            "87K+ transaction records",
            "Realistic churn patterns",
            "Balanced dataset for training"
          ]
        }
      ]
    },
    {
      version: "0.0.5",
      date: "2023-12-20",
      type: "major",
      title: "Initial System Architecture",
      description: "Core system foundation with API and dashboard",
      changes: [
        {
          type: "added",
          icon: Settings,
          title: "FastAPI Backend",
          description: "Production-ready REST API with 8 endpoints",
          details: [
            "Health check endpoint",
            "Customer management API",
            "Churn prediction API",
            "Feature engineering API",
            "Comprehensive API documentation"
          ]
        },
        {
          type: "added",
          icon: BarChart3,
          title: "Streamlit Dashboard",
          description: "Interactive web dashboard for data visualization",
          details: [
            "Real-time metrics display",
            "Customer analytics pages",
            "ML model insights",
            "Interactive data exploration"
          ]
        }
      ]
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-red-100 text-red-800 border-red-200'
      case 'minor': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'patch': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'added': return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      case 'improved': return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      case 'fixed': return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
      case 'deprecated': return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
      case 'removed': return <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      default: return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
    }
  }

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'added': return 'text-green-700'
      case 'improved': return 'text-blue-700'
      case 'fixed': return 'text-yellow-700'
      case 'deprecated': return 'text-orange-700'
      case 'removed': return 'text-red-700'
      default: return 'text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BookOpen className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Changelog</h1>
          <p className="text-gray-600 mt-1">
            Complete version history and feature updates
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Change Types</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700">Added</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-700">Improved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-700">Fixed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-orange-700">Deprecated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-700">Removed</span>
          </div>
        </div>
      </div>

      {/* Version Timeline */}
      <div className="space-y-6">
        {versions.map((version, index) => (
          <div key={version.version} className="relative">
            {/* Timeline Line */}
            {index < versions.length - 1 && (
              <div className="absolute left-8 top-16 w-0.5 h-full bg-gray-200 -z-10"></div>
            )}
            
            {/* Version Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  {/* Version Badge */}
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Version {version.version}
                        </h2>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getTypeColor(version.type)}`}>
                          {version.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{version.date}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {version.title}
                  </h3>
                  <p className="text-gray-600">{version.description}</p>
                </div>
              </div>
              
              {/* Changes */}
              <div className="p-6">
                <div className="space-y-6">
                  {version.changes.map((change, changeIndex) => {
                    const IconComponent = change.icon
                    return (
                      <div key={changeIndex} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-2">
                            {getChangeTypeIcon(change.type)}
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <IconComponent className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${getChangeTypeColor(change.type)}`}>
                            {change.title}
                          </h4>
                          <p className="text-gray-600 mb-3">{change.description}</p>
                          <ul className="space-y-1">
                            {change.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-gray-400 mt-1">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Development Statistics</h3>
          <p className="text-gray-600 mt-1">
            Project progress and milestone achievements
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Total Versions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87.5%</div>
              <div className="text-sm text-gray-600">Model Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">17</div>
              <div className="text-sm text-gray-600">Tests Passing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-sm text-gray-600">API Endpoints</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
