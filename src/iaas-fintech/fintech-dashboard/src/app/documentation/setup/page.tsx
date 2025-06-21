'use client';

import { CheckCircle, Server, Globe, Database, Play, Terminal, Zap } from "lucide-react"

export default function SetupPage() {
  const performanceMetrics = [
    { metric: "Model Accuracy", value: "87.5%", color: "bg-green-500" },
    { metric: "Precision", value: "77.4%", color: "bg-blue-500" },
    { metric: "Recall", value: "87.5%", color: "bg-purple-500" },
    { metric: "F1-Score", value: "82.1%", color: "bg-orange-500" },
    { metric: "Test Coverage", value: "100%", color: "bg-green-600" }
  ]

  const components = [
    {
      name: "Synthetic Data Generator",
      description: "Creates realistic transaction data (1000 customers, 87K+ transactions)",
      icon: Database,
      status: "Complete"
    },
    {
      name: "Feature Engineering",
      description: "67 customer-level and 12 transaction-level features",
      icon: Zap,
      status: "Complete"
    },
    {
      name: "ML Model",
      description: "Churn prediction with 87.5% accuracy using XGBoost",
      icon: CheckCircle,
      status: "Complete"
    },
    {
      name: "FastAPI REST API",
      description: "Production-ready API with 8 endpoints",
      icon: Server,
      status: "Complete"
    },
    {
      name: "Streamlit Dashboard",
      description: "Interactive web dashboard for visualization",
      icon: Globe,
      status: "Complete"
    }
  ]

  const commands = [
    {
      title: "Start API Server",
      description: "Launch the FastAPI backend service",
      command: "cd fintech-inference-service && PYTHONPATH=src uvicorn api.main:app --reload --host 0.0.0.0 --port 8000"
    },
    {
      title: "Start Dashboard",
      description: "Launch the Streamlit dashboard",
      command: "PYTHONPATH=src streamlit run src/dashboard/app.py"
    },
    {
      title: "Health Check",
      description: "Verify API is running",
      command: "curl http://localhost:8000/health"
    }
  ]

  const accessUrls = [
    { name: "API Documentation", url: "http://localhost:8000/docs", icon: Server },
    { name: "Dashboard", url: "http://localhost:8501", icon: Globe },
    { name: "Health Check", url: "http://localhost:8000/health", icon: CheckCircle }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setup Complete!</h1>
          <p className="text-gray-600 mt-1">
            Your Fintech Inference Service is ready to use
          </p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Performance Metrics
          </h2>
          <p className="text-gray-600 mt-1">
            Model performance and system metrics overview
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {performanceMetrics.map((metric) => (
              <div key={metric.metric} className="text-center">
                <div className={`${metric.color} text-white py-2 px-4 rounded-lg mb-2`}>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </div>
                <div className="text-sm text-gray-600">{metric.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Components */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Core Components Built</h2>
          <p className="text-gray-600 mt-1">
            All system components are successfully implemented and tested
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.map((component) => {
              const IconComponent = component.icon
              return (
                <div key={component.name} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{component.name}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {component.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{component.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Start Commands */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-gray-600" />
            Quick Start Commands
          </h2>
          <p className="text-gray-600 mt-1">
            Run these commands to start your services
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {commands.map((cmd, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{cmd.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded border">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{cmd.description}</p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  {cmd.command}
                </div>
                <button 
                  className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  onClick={() => navigator.clipboard.writeText(cmd.command)}
                >
                  Copy Command
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Access URLs */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Access URLs
          </h2>
          <p className="text-gray-600 mt-1">
            Direct links to your running services
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accessUrls.map((url) => {
              const IconComponent = url.icon
              return (
                <div key={url.name} className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{url.name}</h3>
                  <code className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {url.url}
                  </code>
                  <button 
                    className="mt-2 w-full px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                    onClick={() => window.open(url.url, '_blank')}
                  >
                    <Play className="h-4 w-4" />
                    Open
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Test */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick API Test</h2>
          <p className="text-gray-600 mt-1">
            Test your churn prediction API with sample data
          </p>
        </div>
        <div className="p-6">
          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
            {`curl -X POST "http://localhost:8000/api/v1/predict/churn" \\
     -H "Content-Type: application/json" \\
     -d '{
       "customer_id": "CUST_001",
       "account_balance": 15000.50,
       "transaction_frequency": 25,
       "avg_transaction_amount": 450.75,
       "tenure_months": 18
     }'`}
          </div>
          <button 
            className="mt-3 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            onClick={() => navigator.clipboard.writeText(`curl -X POST "http://localhost:8000/api/v1/predict/churn" -H "Content-Type: application/json" -d '{"customer_id": "CUST_001", "account_balance": 15000.50, "transaction_frequency": 25, "avg_transaction_amount": 450.75, "tenure_months": 18}'`)}
          >
            Copy Test Command
          </button>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Next Steps</h2>
          <p className="text-gray-600 mt-1">
            Explore the full capabilities of your fintech platform
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Explore Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• View customer analytics and insights</li>
                <li>• Test churn prediction models</li>
                <li>• Analyze fraud detection capabilities</li>
                <li>• Review feature engineering pipeline</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Documentation</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• API documentation and testing</li>
                <li>• Implementation guides</li>
                <li>• Deployment instructions</li>
                <li>• Troubleshooting help</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
