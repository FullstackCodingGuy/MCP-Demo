'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Code, CheckCircle, AlertCircle, Play } from 'lucide-react';

const ImplementationGuidePage = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['setup']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: 'setup',
      title: '🚀 Quick Setup Guide',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Prerequisites</h4>
            <ul className="space-y-1 text-blue-800">
              <li>• Python 3.8+</li>
              <li>• Docker & Docker Compose</li>
              <li>• Node.js 18+ (for dashboard)</li>
              <li>• PostgreSQL 13+ (optional)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Step 1: Clone Repository</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <code>{`git clone https://github.com/your-org/fintech-inference-service.git
cd fintech-inference-service`}</code>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Step 2: Environment Setup</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <code>{`# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt`}</code>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Step 3: Configuration</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <code>{`# Copy environment template
cp .env.example .env

# Edit configuration
nano .env`}</code>
            </div>
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Update database URL, API keys, and model paths in the .env file
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Step 4: Database Setup</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <code>{`# Run migrations
python manage.py migrate

# Load sample data (optional)
python manage.py loaddata sample_data.json`}</code>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Step 5: Start Services</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <code>{`# Start API server
python start_api.py

# In another terminal, start dashboard
cd fintech-dashboard
npm install
npm run dev`}</code>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'architecture',
      title: '🏗️ System Architecture',
      content: (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Component Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">API Service</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• FastAPI backend</li>
                  <li>• RESTful endpoints</li>
                  <li>• ML model serving</li>
                  <li>• Data validation</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Dashboard</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Next.js frontend</li>
                  <li>• Interactive visualizations</li>
                  <li>• Real-time monitoring</li>
                  <li>• User management</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">ML Pipeline</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Feature engineering</li>
                  <li>• Model training</li>
                  <li>• Batch prediction</li>
                  <li>• Model evaluation</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Data Layer</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• PostgreSQL database</li>
                  <li>• Redis cache</li>
                  <li>• File storage</li>
                  <li>• Data validation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Data Flow</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Data Ingestion</p>
                  <p className="text-sm text-gray-600">Customer and transaction data is ingested through APIs or batch uploads</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Feature Engineering</p>
                  <p className="text-sm text-gray-600">Raw data is processed and transformed into ML-ready features</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Model Inference</p>
                  <p className="text-sm text-gray-600">ML models generate predictions and risk scores</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium">Business Logic</p>
                  <p className="text-sm text-gray-600">Results are processed through business rules and thresholds</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                <div>
                  <p className="font-medium">Action & Response</p>
                  <p className="text-sm text-gray-600">Final decisions are returned via API or dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'configuration',
      title: '⚙️ Configuration Management',
      content: (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Environment Variables</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium">Variable</th>
                    <th className="text-left py-2 px-4 font-medium">Description</th>
                    <th className="text-left py-2 px-4 font-medium">Default</th>
                    <th className="text-left py-2 px-4 font-medium">Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">DATABASE_URL</td>
                    <td className="py-2 px-4 text-sm">PostgreSQL connection string</td>
                    <td className="py-2 px-4 text-sm">sqlite:///db.sqlite3</td>
                    <td className="py-2 px-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Yes</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">REDIS_URL</td>
                    <td className="py-2 px-4 text-sm">Redis cache connection</td>
                    <td className="py-2 px-4 text-sm">redis://localhost:6379</td>
                    <td className="py-2 px-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">No</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">ML_MODEL_PATH</td>
                    <td className="py-2 px-4 text-sm">Path to ML model files</td>
                    <td className="py-2 px-4 text-sm">./models/</td>
                    <td className="py-2 px-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Yes</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">API_KEY</td>
                    <td className="py-2 px-4 text-sm">API authentication key</td>
                    <td className="py-2 px-4 text-sm">-</td>
                    <td className="py-2 px-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Yes</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">LOG_LEVEL</td>
                    <td className="py-2 px-4 text-sm">Logging level</td>
                    <td className="py-2 px-4 text-sm">INFO</td>
                    <td className="py-2 px-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">No</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Model Configuration</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <code>{`# config/models.yaml
models:
  churn_prediction:
    path: "models/churn_model.joblib"
    threshold: 0.5
    features:
      - days_since_last_transaction
      - avg_transaction_amount
      - total_transactions
    
  fraud_detection:
    path: "models/fraud_model.joblib"
    threshold: 0.8
    features:
      - transaction_velocity
      - geographic_distance
      - amount_deviation`}</code>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'testing',
      title: '🧪 Testing & Validation',
      content: (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Test Suite</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Unit Tests</h5>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <code>{`# Run unit tests
pytest tests/unit/

# With coverage
pytest tests/unit/ --cov=src --cov-report=html`}</code>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Integration Tests</h5>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <code>{`# Test API endpoints
pytest tests/integration/test_api.py

# Test ML pipeline
pytest tests/integration/test_ml_pipeline.py`}</code>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Load Testing</h5>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <code>{`# Install locust
pip install locust

# Run load tests
locust -f tests/load/locustfile.py --host=http://localhost:8000`}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Validation Checklist</h4>
            <div className="space-y-3">
              {[
                'All unit tests passing',
                'Integration tests passing',
                'API endpoints responding correctly',
                'ML models loading successfully',
                'Database connections working',
                'Redis cache functional',
                'Environment variables set',
                'Logging configured properly',
                'Security headers in place',
                'Rate limiting working'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'monitoring',
      title: '📊 Monitoring & Observability',
      content: (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Health Checks</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">API Health</h5>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm">
                  <code>GET /health</code>
                </div>
                <p className="text-sm text-gray-600 mt-2">Basic health check endpoint</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Deep Health</h5>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm">
                  <code>GET /health/deep</code>
                </div>
                <p className="text-sm text-gray-600 mt-2">Comprehensive system check</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Metrics Collection</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Application Metrics</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Request count and latency</li>
                  <li>• Error rates by endpoint</li>
                  <li>• ML model inference time</li>
                  <li>• Database query performance</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Business Metrics</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Prediction accuracy over time</li>
                  <li>• False positive/negative rates</li>
                  <li>• Customer churn predictions</li>
                  <li>• Fraud detection alerts</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Alerting Rules</h4>
            <div className="space-y-3">
              {[
                { severity: 'Critical', condition: 'API response time > 5s', action: 'Page on-call engineer' },
                { severity: 'Warning', condition: 'Error rate > 5%', action: 'Send Slack notification' },
                { severity: 'Info', condition: 'Model accuracy drops > 2%', action: 'Email ML team' },
                { severity: 'Critical', condition: 'Database connection failed', action: 'Page on-call engineer' }
              ].map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-sm font-medium">{alert.condition}</span>
                  </div>
                  <span className="text-sm text-gray-600">{alert.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Implementation Guide</h1>
          <p className="text-gray-600">Complete step-by-step implementation guide for the Fintech Inference Service</p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-900">{section.title}</span>
                {expandedSections.includes(section.id) ? 
                  <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                }
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                {expandedSections.includes(section.id) ? 
                  <ChevronDown className="h-5 w-5 text-gray-500" /> : 
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                }
              </button>
              
              {expandedSections.includes(section.id) && (
                <div className="px-6 pb-6 border-t">
                  <div className="pt-6">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🎯 Next Steps</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Review the <a href="/documentation/deployment" className="underline">Deployment Guide</a> for production setup</li>
            <li>• Check out the <a href="/api-documentation" className="underline">API Documentation</a> for integration details</li>
            <li>• Explore the <a href="/documentation/troubleshooting" className="underline">Troubleshooting Guide</a> for common issues</li>
            <li>• Visit the <a href="/model-insights" className="underline">Model Insights</a> page to monitor performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImplementationGuidePage;
