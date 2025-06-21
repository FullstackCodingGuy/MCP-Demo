'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, HelpCircle, Search } from 'lucide-react';

const TroubleshootingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const troubleshootingItems = [
    {
      id: 1,
      category: 'api',
      severity: 'critical',
      title: 'API Server Not Starting',
      problem: 'FastAPI server fails to start or crashes immediately',
      symptoms: [
        'Server exits with error code 1',
        'Port binding errors',
        'Database connection failures',
        'Module import errors'
      ],
      solutions: [
        {
          step: 'Check port availability',
          command: 'lsof -i :8000',
          description: 'Ensure port 8000 is not in use by another process'
        },
        {
          step: 'Verify database connection',
          command: 'psql $DATABASE_URL -c "SELECT 1"',
          description: 'Test database connectivity'
        },
        {
          step: 'Check environment variables',
          command: 'env | grep -E "(DATABASE_URL|REDIS_URL|API_KEY)"',
          description: 'Ensure all required environment variables are set'
        },
        {
          step: 'Validate Python dependencies',
          command: 'pip check',
          description: 'Check for dependency conflicts'
        }
      ],
      relatedDocs: ['/documentation/implementation', '/api-documentation']
    },
    {
      id: 2,
      category: 'ml',
      severity: 'high',
      title: 'ML Model Loading Failed',
      problem: 'Machine learning models fail to load or return errors',
      symptoms: [
        'Model not found errors',
        'Pickle deserialization errors',
        'Version compatibility issues',
        'Memory allocation errors'
      ],
      solutions: [
        {
          step: 'Verify model files exist',
          command: 'ls -la models/',
          description: 'Check if model files are present in the models directory'
        },
        {
          step: 'Check model file permissions',
          command: 'ls -la models/*.joblib',
          description: 'Ensure model files are readable'
        },
        {
          step: 'Test model loading manually',
          command: 'python -c "import joblib; model = joblib.load(\'models/churn_model.joblib\')"',
          description: 'Test model loading in Python'
        },
        {
          step: 'Check available memory',
          command: 'free -h',
          description: 'Ensure sufficient memory for model loading'
        }
      ],
      relatedDocs: ['/model-insights', '/feature-engineering']
    },
    {
      id: 3,
      category: 'database',
      severity: 'critical',
      title: 'Database Connection Issues',
      problem: 'Cannot connect to PostgreSQL database',
      symptoms: [
        'Connection timeout errors',
        'Authentication failures',
        'SSL connection errors',
        'Database does not exist errors'
      ],
      solutions: [
        {
          step: 'Test database connectivity',
          command: 'pg_isready -h localhost -p 5432',
          description: 'Check if PostgreSQL is running and accepting connections'
        },
        {
          step: 'Verify connection string',
          command: 'echo $DATABASE_URL',
          description: 'Check the database URL format'
        },
        {
          step: 'Test authentication',
          command: 'psql $DATABASE_URL -c "SELECT current_user"',
          description: 'Verify database credentials'
        },
        {
          step: 'Check database exists',
          command: 'psql $DATABASE_URL -c "SELECT datname FROM pg_database WHERE datname = \'fintech\'"',
          description: 'Ensure the database exists'
        }
      ],
      relatedDocs: ['/documentation/implementation', '/documentation/deployment']
    },
    {
      id: 4,
      category: 'performance',
      severity: 'medium',
      title: 'Slow API Response Times',
      problem: 'API endpoints are responding slowly (>2 seconds)',
      symptoms: [
        'High response times in logs',
        'Timeout errors from clients',
        'High CPU usage',
        'Database query bottlenecks'
      ],
      solutions: [
        {
          step: 'Check API performance metrics',
          command: 'curl -w "@curl-format.txt" -s -o /dev/null http://localhost:8000/health',
          description: 'Measure API response times'
        },
        {
          step: 'Monitor database queries',
          command: 'tail -f /var/log/postgresql/postgresql.log | grep "duration:"',
          description: 'Identify slow database queries'
        },
        {
          step: 'Check system resources',
          command: 'top -p $(pgrep -f "python.*start_api.py")',
          description: 'Monitor CPU and memory usage'
        },
        {
          step: 'Enable query optimization',
          command: 'psql $DATABASE_URL -c "ANALYZE;"',
          description: 'Update database statistics for query optimization'
        }
      ],
      relatedDocs: ['/documentation/deployment', '/model-insights']
    },
    {
      id: 5,
      category: 'dashboard',
      severity: 'medium',
      title: 'Dashboard Not Loading',
      problem: 'Next.js dashboard fails to load or shows errors',
      symptoms: [
        'White screen or blank page',
        'JavaScript errors in browser console',
        'API connection failures',
        'Build or compilation errors'
      ],
      solutions: [
        {
          step: 'Check Next.js development server',
          command: 'cd fintech-dashboard && npm run dev',
          description: 'Start the development server and check for errors'
        },
        {
          step: 'Verify API connection',
          command: 'curl http://localhost:8000/health',
          description: 'Ensure the API server is accessible'
        },
        {
          step: 'Check browser console',
          command: 'Open browser DevTools (F12) and check Console tab',
          description: 'Look for JavaScript errors or network failures'
        },
        {
          step: 'Clear browser cache',
          command: 'Ctrl+Shift+R (or Cmd+Shift+R on Mac)',
          description: 'Hard refresh to clear cached resources'
        }
      ],
      relatedDocs: ['/documentation/implementation']
    },
    {
      id: 6,
      category: 'security',
      severity: 'high',
      title: 'Authentication Failures',
      problem: 'API authentication is failing or tokens are invalid',
      symptoms: [
        '401 Unauthorized errors',
        'Invalid token errors',
        'Token expiration issues',
        'CORS errors in browser'
      ],
      solutions: [
        {
          step: 'Verify API key',
          command: 'echo $API_KEY',
          description: 'Check if API key is properly set'
        },
        {
          step: 'Test authentication endpoint',
          command: 'curl -H "Authorization: Bearer $API_KEY" http://localhost:8000/auth/verify',
          description: 'Test API key validation'
        },
        {
          step: 'Check CORS configuration',
          command: 'curl -H "Origin: http://localhost:3000" -I http://localhost:8000/health',
          description: 'Verify CORS headers are present'
        },
        {
          step: 'Generate new API key',
          command: 'python -c "import secrets; print(secrets.token_urlsafe(32))"',
          description: 'Generate a new secure API key'
        }
      ],
      relatedDocs: ['/api-documentation', '/documentation/deployment']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', count: troubleshootingItems.length },
    { value: 'api', label: 'API Issues', count: troubleshootingItems.filter(item => item.category === 'api').length },
    { value: 'ml', label: 'ML Models', count: troubleshootingItems.filter(item => item.category === 'ml').length },
    { value: 'database', label: 'Database', count: troubleshootingItems.filter(item => item.category === 'database').length },
    { value: 'performance', label: 'Performance', count: troubleshootingItems.filter(item => item.category === 'performance').length },
    { value: 'dashboard', label: 'Dashboard', count: troubleshootingItems.filter(item => item.category === 'dashboard').length },
    { value: 'security', label: 'Security', count: troubleshootingItems.filter(item => item.category === 'security').length }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium': return <HelpCircle className="h-5 w-5 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default: return <HelpCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredItems = troubleshootingItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Troubleshooting Guide</h1>
          <p className="text-gray-600">Common issues and solutions for the Fintech Inference Service</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues, symptoms, or solutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredItems.length} of {troubleshootingItems.length} troubleshooting guides
          </p>
        </div>

        {/* Troubleshooting Items */}
        <div className="space-y-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(item.severity)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 mt-1">{item.problem}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(item.severity)}`}>
                    {item.severity.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Symptoms */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">🚨 Symptoms</h4>
                    <ul className="space-y-2">
                      {item.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700">{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">✅ Solutions</h4>
                    <div className="space-y-4">
                      {item.solutions.map((solution, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <h5 className="font-medium text-gray-900">{solution.step}</h5>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{solution.description}</p>
                          {solution.command && (
                            <div className="bg-gray-900 text-gray-100 p-2 rounded text-sm font-mono">
                              {solution.command}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Related Documentation */}
                {item.relatedDocs && item.relatedDocs.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">📖 Related Documentation</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.relatedDocs.map((doc, index) => (
                        <a
                          key={index}
                          href={doc}
                          className="inline-flex items-center px-3 py-1 rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors text-sm"
                        >
                          {doc.split('/').pop()?.replace('-', ' ') || doc}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No troubleshooting guides found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Quick Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🆘 Still Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-800">
            <div>
              <h4 className="font-medium mb-1">Check System Status</h4>
              <p className="text-sm">Visit the <a href="/model-insights" className="underline">Model Insights</a> page to check system health</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">API Documentation</h4>
              <p className="text-sm">Review the <a href="/api-documentation" className="underline">API Documentation</a> for endpoint details</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Contact Support</h4>
              <p className="text-sm">Email: support@fintech-inference.com<br />Slack: #fintech-support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingPage;
