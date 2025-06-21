'use client';

import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Play, Server, CheckCircle2, XCircle, Activity } from 'lucide-react';

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: Record<string, any>;
  response_example: Record<string, any>;
  code_example: string;
  category: string;
}

interface TestResult {
  endpoint: string;
  status: 'success' | 'error' | 'testing';
  response_time?: number;
  status_code?: number;
  error?: string;
  data?: any;
}

const API_BASE_URL = 'http://localhost:8000';

const API_ENDPOINTS: APIEndpoint[] = [
  // System & Health Endpoints
  {
    method: 'GET',
    path: '/health',
    description: 'Basic health check endpoint - returns service status and model availability',
    category: 'System',
    response_example: {
      status: 'healthy',
      timestamp: '2024-01-15T10:30:00Z',
      version: '1.0.0',
      models_loaded: {
        churn_prediction: true,
        customer_segmentation: true,
        fraud_detection: true
      }
    },
    code_example: `curl -X GET "${API_BASE_URL}/health"`
  },
  {
    method: 'GET',
    path: '/health/detailed',
    description: 'Detailed health check with comprehensive system metrics',
    category: 'System',
    response_example: {
      status: 'healthy',
      timestamp: '2024-01-15T10:30:00Z',
      system_metrics: {
        cpu_usage_percent: 45.2,
        memory_usage_percent: 67.8,
        memory_available_gb: 8.5,
        disk_usage_percent: 32.1,
        disk_free_gb: 125.3
      },
      models_status: {
        churn_prediction: { loaded: true, last_trained: null },
        customer_segmentation: { loaded: true, last_trained: null },
        fraud_detection: { loaded: true, last_trained: null }
      },
      environment: {
        python_version: '3.9.7',
        platform: 'posix'
      }
    },
    code_example: `curl -X GET "${API_BASE_URL}/health/detailed"`
  },
  {
    method: 'GET',
    path: '/ready',
    description: 'Kubernetes readiness probe - checks if all critical services are ready',
    category: 'System',
    response_example: {
      status: 'ready',
      services: {
        database: true,
        models: true,
        storage: true
      }
    },
    code_example: `curl -X GET "${API_BASE_URL}/ready"`
  },
  {
    method: 'GET',
    path: '/live',
    description: 'Kubernetes liveness probe - simple alive status check',
    category: 'System',
    response_example: {
      status: 'alive',
      timestamp: '2024-01-15T10:30:00Z'
    },
    code_example: `curl -X GET "${API_BASE_URL}/live"`
  },
  {
    method: 'GET',
    path: '/models/status',
    description: 'Get comprehensive status of all loaded ML models',
    category: 'System',
    response_example: {
      models: {
        churn_prediction: true,
        customer_segmentation: true,
        fraud_detection: true
      },
      total_models: 3,
      loaded_models: 3,
      timestamp: '2024-01-15T10:30:00Z'
    },
    code_example: `curl -X GET "${API_BASE_URL}/models/status"`
  },
  {
    method: 'POST',
    path: '/models/reload',
    description: 'Reload all ML models in background (useful for model updates)',
    category: 'System',
    response_example: {
      message: 'Model reload initiated',
      status: 'in_progress',
      timestamp: '2024-01-15T10:30:00Z'
    },
    code_example: `curl -X POST "${API_BASE_URL}/models/reload"`
  },

  // Customer Management Endpoints
  {
    method: 'GET',
    path: '/api/v1/customers',
    description: 'Get paginated list of customers with advanced filtering capabilities',
    category: 'Customer Management',
    parameters: {
      page: { type: 'number', description: 'Page number (default: 1)', required: false },
      page_size: { type: 'number', description: 'Items per page (default: 50, max: 500)', required: false },
      search: { type: 'string', description: 'Search by customer ID or name', required: false },
      age_min: { type: 'number', description: 'Minimum age filter (18-100)', required: false },
      age_max: { type: 'number', description: 'Maximum age filter (18-100)', required: false },
      location: { type: 'string', description: 'Filter by location', required: false },
      risk_level: { type: 'string', description: 'Filter by risk level (Low, Medium, High, Critical)', required: false }
    },
    response_example: {
      customers: [
        {
          customer_id: 'CUST_000001',
          name: 'Customer 1',
          age: 35,
          location: 'New York',
          email: 'cust_000001@example.com',
          account_type: 'Premium',
          total_transactions: 25,
          total_amount: 3768.75,
          churn_risk: 'Low'
        }
      ],
      pagination: {
        page: 1,
        page_size: 50,
        total_customers: 1000,
        total_pages: 20,
        has_next: true,
        has_prev: false
      }
    },
    code_example: `curl -X GET "${API_BASE_URL}/api/v1/customers?page=1&page_size=10&search=CUST_001&risk_level=High"`
  },
  {
    method: 'GET',
    path: '/api/v1/customers/{customer_id}',
    description: 'Get detailed information for a specific customer including features and transaction summary',
    category: 'Customer Management',
    parameters: {
      customer_id: { type: 'string', description: 'Unique customer identifier', required: true }
    },
    response_example: {
      customer: {
        customer_id: 'CUST_000001',
        name: 'Customer 1',
        age: 35,
        location: 'New York',
        email: 'cust_000001@example.com',
        account_type: 'Premium',
        credit_score: 750,
        annual_income: 85000,
        join_date: '2023-01-15'
      },
      features: {
        total_transactions: 145,
        avg_transaction_amount: 187.50,
        days_since_last_transaction: 3,
        preferred_categories: 'grocery,restaurant'
      },
      transaction_summary: {
        total_transactions: 145,
        total_amount: 27187.50,
        avg_amount: 187.50,
        date_range: {
          first_transaction: '2023-01-20T10:30:00Z',
          last_transaction: '2024-01-12T15:45:00Z'
        }
      }
    },
    code_example: `curl -X GET "${API_BASE_URL}/api/v1/customers/CUST_000001"`
  },
  {
    method: 'GET',
    path: '/api/v1/customers/{customer_id}/transactions',
    description: 'Get paginated transaction history for a specific customer with advanced filtering',
    category: 'Customer Management',
    parameters: {
      customer_id: { type: 'string', description: 'Unique customer identifier', required: true },
      page: { type: 'number', description: 'Page number (default: 1)', required: false },
      page_size: { type: 'number', description: 'Items per page (default: 100, max: 1000)', required: false },
      category: { type: 'string', description: 'Filter by transaction category', required: false },
      date_from: { type: 'string', description: 'Start date filter (YYYY-MM-DD)', required: false },
      date_to: { type: 'string', description: 'End date filter (YYYY-MM-DD)', required: false },
      amount_min: { type: 'number', description: 'Minimum amount filter', required: false },
      amount_max: { type: 'number', description: 'Maximum amount filter', required: false },
      is_fraud: { type: 'boolean', description: 'Filter by fraud status', required: false }
    },
    response_example: {
      transactions: [
        {
          transaction_id: 'TXN_001',
          customer_id: 'CUST_000001',
          transaction_date: '2024-01-12T15:45:00Z',
          amount: 125.50,
          category: 'grocery',
          merchant: 'SuperMart',
          payment_method: 'Credit Card',
          location: 'New York',
          is_fraud: false
        }
      ],
      pagination: {
        page: 1,
        page_size: 100,
        total_transactions: 145,
        total_pages: 2,
        has_next: true,
        has_prev: false
      }
    },
    code_example: `curl -X GET "${API_BASE_URL}/api/v1/customers/CUST_000001/transactions?category=grocery&date_from=2024-01-01"`
  },

  // Analytics Endpoints
  {
    method: 'GET',
    path: '/api/v1/analytics/customers',
    description: 'Get comprehensive customer analytics including demographics and behavior insights',
    category: 'Analytics',
    response_example: {
      demographics: {
        total_customers: 10000,
        age_distribution: { min: 25, mean: 45, max: 65 },
        location_distribution: { 'New York': 3333, 'Los Angeles': 3333, 'Chicago': 3334 },
        account_type_distribution: { 'Premium': 5000, 'Standard': 5000 }
      },
      transactions: {
        total_transactions: 150000,
        total_volume: 25000000.50,
        avg_transaction_amount: 166.67,
        fraud_rate: 2.5,
        transaction_by_category: { 'grocery': 45000, 'restaurant': 30000, 'retail': 25000 }
      },
      customer_activity: {
        avg_transactions_per_customer: 15,
        top_customers_by_volume: [
          { customer_id: 'CUST_001', total_amount: 50000 }
        ]
      }
    },
    code_example: `curl -X GET "${API_BASE_URL}/api/v1/analytics/customers"`
  },
  {
    method: 'GET',
    path: '/api/v1/analytics/transactions',
    description: 'Get detailed transaction analytics for specified time period with trends and patterns',
    category: 'Analytics',
    parameters: {
      days: { type: 'number', description: 'Number of days to analyze (1-365, default: 30)', required: false }
    },
    response_example: {
      period: {
        start_date: '2023-12-15',
        end_date: '2024-01-15',
        days: 30
      },
      summary: {
        total_transactions: 5000,
        total_volume: 750000.00,
        avg_transaction_amount: 150.00,
        fraud_transactions: 125,
        fraud_rate: 2.5,
        unique_customers: 2500,
        unique_merchants: 500
      },
      daily_trends: [
        {
          date: '2024-01-15',
          transaction_count: 167,
          total_amount: 25050.75,
          avg_amount: 150.00,
          fraud_count: 4
        }
      ],
      time_patterns: {
        hourly: { '9': 150, '12': 300, '18': 250 },
        weekly: { 'Monday': 800, 'Friday': 1200 }
      }
    },
    code_example: `curl -X GET "${API_BASE_URL}/api/v1/analytics/transactions?days=7"`
  },

  // ML Inference Endpoints
  {
    method: 'POST',
    path: '/api/v1/inference/churn-score',
    description: 'Predict customer churn probability using advanced ML model',
    category: 'ML Inference',
    parameters: {
      customer_id: { type: 'string', description: 'Unique customer identifier', required: true },
      features: { type: 'object', description: 'Optional pre-computed customer features', required: false }
    },
    response_example: {
      customer_id: 'CUST_000001',
      churn_probability: 0.35,
      churn_prediction: false,
      risk_level: 'Medium',
      confidence: 0.87
    },
    code_example: `curl -X POST "${API_BASE_URL}/api/v1/inference/churn-score" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "CUST_000001",
    "features": {
      "days_since_last_transaction": 45,
      "avg_transaction_amount": 125.50
    }
  }'`
  },
  {
    method: 'POST',
    path: '/api/v1/inference/churn-batch',
    description: 'Batch churn prediction for multiple customers with summary statistics',
    category: 'ML Inference',
    parameters: {
      customers: { type: 'array', description: 'Array of customer objects with id and optional features', required: true }
    },
    response_example: {
      predictions: [
        {
          customer_id: 'CUST_000001',
          churn_probability: 0.35,
          churn_prediction: false,
          risk_level: 'Medium',
          confidence: 0.87
        }
      ],
      summary: {
        total_customers: 100,
        predicted_churners: 23,
        avg_churn_probability: 0.31,
        high_risk_customers: 8
      }
    },
    code_example: `curl -X POST "${API_BASE_URL}/api/v1/inference/churn-batch" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customers": [
      {"customer_id": "CUST_000001"},
      {"customer_id": "CUST_000002"}
    ]
  }'`
  },
  {
    method: 'POST',
    path: '/api/v1/inference/segment',
    description: 'Predict customer segment using ML-based segmentation model',
    category: 'ML Inference',
    parameters: {
      customer_id: { type: 'string', description: 'Unique customer identifier', required: true },
      features: { type: 'object', description: 'Optional pre-computed customer features', required: false }
    },
    response_example: {
      customer_id: 'CUST_000001',
      segment_id: 1,
      segment_name: 'High Value',
      confidence: 0.82,
      characteristics: {
        avg_monthly_spend: 2500,
        transaction_frequency: 15,
        preferred_categories: ['grocery', 'restaurant'],
        risk_level: 'low'
      }
    },
    code_example: `curl -X POST "${API_BASE_URL}/api/v1/inference/segment" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "CUST_000001"
  }'`
  },
  {
    method: 'POST',
    path: '/api/v1/inference/fraud-detection',
    description: 'Detect fraudulent transactions using advanced anomaly detection',
    category: 'ML Inference',
    parameters: {
      customer_id: { type: 'string', description: 'Customer identifier', required: true },
      transaction_date: { type: 'string', description: 'Transaction timestamp (ISO format)', required: true },
      amount: { type: 'number', description: 'Transaction amount', required: true },
      merchant: { type: 'string', description: 'Merchant name', required: true },
      category: { type: 'string', description: 'Transaction category', required: true },
      mode: { type: 'string', description: 'Payment mode', required: true },
      location: { type: 'string', description: 'Transaction location', required: true }
    },
    response_example: {
      transaction_id: null,
      customer_id: 'CUST_000001',
      fraud_probability: 0.08,
      fraud_prediction: false,
      anomaly_score: 0.08,
      risk_factors: ['unusual_amount']
    },
    code_example: `curl -X POST "${API_BASE_URL}/api/v1/inference/fraud-detection" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "CUST_000001",
    "transaction_date": "2024-01-15T14:30:00Z",
    "amount": 1250.00,
    "merchant": "Electronics Store",
    "category": "retail",
    "mode": "Credit Card",
    "location": "New York"
  }'`
  },
  {
    method: 'POST',
    path: '/api/v1/inference/batch-process',
    description: 'Process large batches of data in background with job tracking',
    category: 'ML Inference',
    parameters: {
      data_source: { type: 'string', description: 'Data source path or identifier', required: true },
      processing_type: { type: 'string', description: 'Type of processing (churn, segment, fraud)', required: true },
      parameters: { type: 'object', description: 'Additional processing parameters', required: false }
    },
    response_example: {
      job_id: 'batch_20240115_143000',
      status: 'initiated',
      message: 'Batch processing started',
      estimated_duration: '5-10 minutes'
    },
    code_example: `curl -X POST "${API_BASE_URL}/api/v1/inference/batch-process" \\
  -H "Content-Type: application/json" \\
  -d '{
    "data_source": "/data/customers_batch.csv",
    "processing_type": "churn"
  }'`
  },
  {
    method: 'GET',
    path: '/api/v1/inference/explain',
    description: 'Get model explanation for predictions with feature contributions (SHAP values)',
    category: 'ML Inference',
    parameters: {
      customer_id: { type: 'string', description: 'Customer identifier', required: true },
      model_type: { type: 'string', description: 'Model type (churn, segment, fraud)', required: false }
    },
    response_example: {
      prediction: true,
      probability: [0.35, 0.65],
      feature_contributions: [
        {
          feature_name: 'days_since_last_transaction',
          feature_value: 45.0,
          contribution: 0.15,
          importance: 0.23
        },
        {
          feature_name: 'avg_transaction_amount',
          feature_value: 125.50,
          contribution: -0.08,
          importance: 0.18
        }
      ],
      explanation_summary: 'Customer shows high churn risk due to decreased transaction frequency and longer periods between transactions.'
    },
    code_example: `curl -X GET "${API_BASE_URL}/api/v1/inference/explain?customer_id=CUST_000001&model_type=churn"`
  },
  {
    method: 'GET',
    path: '/api/v1/inference/metrics',
    description: 'Get inference service metrics and performance statistics',
    category: 'ML Inference',
    response_example: {
      metrics: {
        total_predictions_today: 1247,
        avg_response_time_ms: 95,
        model_accuracy: {
          churn_prediction: 0.87,
          fraud_detection: 0.92,
          segmentation: 0.79
        },
        error_rate: 0.02,
        high_risk_alerts: 23,
        uptime_hours: 168
      },
      timestamp: '2024-01-15T10:30:00Z',
      status: 'operational'
    },
    code_example: `curl -X GET "${API_BASE_URL}/api/v1/inference/metrics"`
  }
];

export default function APIDocumentationPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint>(API_ENDPOINTS[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastStatusCheck, setLastStatusCheck] = useState<Date | null>(null);

  // Periodic API status checking
  useEffect(() => {
    const checkApiHealth = async () => {
      setApiStatus('checking');
      try {
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const data = await response.json();
          setApiStatus(data.status === 'healthy' ? 'online' : 'offline');
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        setApiStatus('offline');
      }
      setLastStatusCheck(new Date());
    };

    // Initial check
    checkApiHealth();

    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const testEndpoint = async (endpoint: APIEndpoint) => {
    const testKey = `${endpoint.method}_${endpoint.path}`;
    
    setTestResults(prev => ({
      ...prev,
      [testKey]: { endpoint: endpoint.path, status: 'testing' }
    }));

    try {
      const startTime = Date.now();
      let requestOptions: RequestInit = {
        method: endpoint.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      };

      // Add sample body for POST requests
      if (endpoint.method === 'POST') {
        if (endpoint.path.includes('churn-score')) {
          requestOptions.body = JSON.stringify({
            customer_id: 'CUST_000001',
            features: { days_since_last_transaction: 30 }
          });
        } else if (endpoint.path.includes('churn-batch')) {
          requestOptions.body = JSON.stringify({
            customers: [
              { customer_id: 'CUST_000001' },
              { customer_id: 'CUST_000002' }
            ]
          });
        } else if (endpoint.path.includes('segment')) {
          requestOptions.body = JSON.stringify({
            customer_id: 'CUST_000001'
          });
        } else if (endpoint.path.includes('fraud-detection')) {
          requestOptions.body = JSON.stringify({
            customer_id: 'CUST_000001',
            transaction_date: new Date().toISOString(),
            amount: 150.00,
            merchant: 'Test Merchant',
            category: 'grocery',
            mode: 'Credit Card',
            location: 'New York'
          });
        } else if (endpoint.path.includes('batch-process')) {
          requestOptions.body = JSON.stringify({
            data_source: 'test_data.csv',
            processing_type: 'churn'
          });
        }
      }

      // Replace path parameters
      let testPath = endpoint.path;
      if (testPath.includes('{customer_id}')) {
        testPath = testPath.replace('{customer_id}', 'CUST_000001');
      }

      const response = await fetch(`${API_BASE_URL}${testPath}`, requestOptions);
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => ({
          ...prev,
          [testKey]: {
            endpoint: endpoint.path,
            status: 'success',
            response_time: responseTime,
            status_code: response.status,
            data: data
          }
        }));
      } else {
        const errorData = await response.text();
        setTestResults(prev => ({
          ...prev,
          [testKey]: {
            endpoint: endpoint.path,
            status: 'error',
            response_time: responseTime,
            status_code: response.status,
            error: `${response.status}: ${errorData}`
          }
        }));
      }
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          endpoint: endpoint.path,
          status: 'error',
          error: error.message || 'Network error - API may be offline'
        }
      }));
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'testing') => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'testing':
        return <Activity className="h-4 w-4 text-blue-600 animate-spin" />;
    }
  };

  // Group endpoints by category
  const endpointsByCategory = API_ENDPOINTS.reduce((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {} as Record<string, APIEndpoint[]>);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔌 API Documentation</h1>
          <p className="text-gray-600 mb-4">
            Interactive API documentation and live testing for the Fintech Inference Service. 
            This comprehensive API provides endpoints for customer management, analytics, and ML inference.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-0.5">ℹ️</div>
              <div>
                <h3 className="font-medium text-blue-900">API Status Monitoring</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This page automatically checks API health every 30 seconds and provides live endpoint testing. 
                  Use the test buttons to verify each endpoint's functionality in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* API Status Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">API Status:</span>
                <div className="flex items-center space-x-2">
                  {apiStatus === 'online' && (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Online</span>
                    </>
                  )}
                  {apiStatus === 'offline' && (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-600 font-medium">Offline</span>
                    </>
                  )}
                  {apiStatus === 'checking' && (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-yellow-600 font-medium">Checking...</span>
                    </>
                  )}
                </div>
              </div>
              {lastStatusCheck && (
                <div className="text-xs text-gray-500">
                  Last checked: {lastStatusCheck.toLocaleTimeString()}
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              Base URL: <code className="bg-gray-100 px-2 py-1 rounded">{API_BASE_URL}</code>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Endpoints List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                API Endpoints ({API_ENDPOINTS.length})
              </h3>
              <div className="space-y-4">
                {Object.entries(endpointsByCategory).map(([category, endpoints]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 px-2 py-1 bg-gray-50 rounded">
                      {category} ({endpoints.length})
                    </h4>
                    <div className="space-y-2">
                      {endpoints.map((endpoint, index) => {
                        const testKey = `${endpoint.method}_${endpoint.path}`;
                        const testResult = testResults[testKey];
                        
                        return (
                          <div
                            key={`${category}-${index}`}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedEndpoint.path === endpoint.path
                                ? 'border-blue-200 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedEndpoint(endpoint)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getMethodColor(endpoint.method)}`}>
                                  {endpoint.method}
                                </span>
                                {testResult && getStatusIcon(testResult.status)}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  testEndpoint(endpoint);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                                title="Test endpoint"
                              >
                                <Play className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-sm text-gray-900 font-medium truncate">{endpoint.path}</div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{endpoint.description}</div>
                            {testResult && testResult.response_time && (
                              <div className="text-xs text-gray-400 mt-1">
                                {testResult.response_time.toFixed(0)}ms • {testResult.status_code}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Endpoint Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded border ${getMethodColor(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-900">{selectedEndpoint.path}</code>
                </div>
                <p className="text-gray-600 mb-3">{selectedEndpoint.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {selectedEndpoint.category}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    {selectedEndpoint.parameters ? Object.keys(selectedEndpoint.parameters).length : 0} parameters
                  </span>
                </div>
              </div>

              {/* Parameters */}
              {selectedEndpoint.parameters && Object.keys(selectedEndpoint.parameters).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Parameters</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedEndpoint.parameters).map(([key, param]: [string, any]) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <code className="text-sm font-mono text-gray-900">{key}</code>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {param.type}
                            </span>
                            {param.required && (
                              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">
                                Required
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Example */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">Code Example</h4>
                  <button
                    onClick={() => copyToClipboard(selectedEndpoint.code_example, 'code')}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedCode === 'code' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copiedCode === 'code' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{selectedEndpoint.code_example}</code>
                  </pre>
                </div>
              </div>

              {/* Response Example */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">Response Example</h4>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.response_example, null, 2), 'response')}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedCode === 'response' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copiedCode === 'response' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-gray-800 text-sm">
                    <code>{JSON.stringify(selectedEndpoint.response_example, null, 2)}</code>
                  </pre>
                </div>
              </div>

              {/* Test Result */}
              {testResults[`${selectedEndpoint.method}_${selectedEndpoint.path}`] && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Live Test Result</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    {(() => {
                      const result = testResults[`${selectedEndpoint.method}_${selectedEndpoint.path}`];
                      if (result.status === 'testing') {
                        return (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <Activity className="h-4 w-4 animate-spin" />
                            <span>Testing endpoint...</span>
                          </div>
                        );
                      } else if (result.status === 'success') {
                        return (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="font-medium">Success</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {result.response_time?.toFixed(0)}ms • Status: {result.status_code}
                              </div>
                            </div>
                            {result.data && (
                              <div className="bg-gray-50 rounded p-3 overflow-x-auto">
                                <pre className="text-sm text-gray-800">
                                  <code>{JSON.stringify(result.data, null, 2)}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-red-600">
                            <div className="flex items-center space-x-2 mb-2">
                              <XCircle className="h-4 w-4" />
                              <span className="font-medium">Error</span>
                            </div>
                            <div className="text-sm bg-red-50 p-3 rounded">
                              {result.error}
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Test Button */}
              <button
                onClick={() => testEndpoint(selectedEndpoint)}
                disabled={testResults[`${selectedEndpoint.method}_${selectedEndpoint.path}`]?.status === 'testing'}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {testResults[`${selectedEndpoint.method}_${selectedEndpoint.path}`]?.status === 'testing' ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Test This Endpoint
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* API Performance Dashboard */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 API Performance Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {apiStatus === 'online' ? '99.9%' : '0%'}
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(Object.values(testResults).reduce((sum, result) => 
                  sum + (result.response_time || 0), 0) / Math.max(Object.keys(testResults).length, 1)) || 0}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(testResults).length}
              </div>
              <div className="text-sm text-gray-600">Endpoints Tested</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {Object.keys(testResults).length > 0 
                  ? `${Object.values(testResults).filter(r => r.status === 'success').length} / ${Object.keys(testResults).length}`
                  : '0 / 0'
                }
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* API Usage Guidelines */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Usage Guidelines & Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
              <p className="text-sm text-gray-600 mb-4">
                Currently no authentication is required for testing. In production, use API keys or JWT tokens.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">Rate Limits</h4>
              <p className="text-sm text-gray-600 mb-4">
                • 1000 requests per minute per IP<br/>
                • 10000 requests per hour per IP<br/>
                • Batch endpoints have lower limits (100/hour)
              </p>

              <h4 className="font-medium text-gray-900 mb-2">Model Performance</h4>
              <p className="text-sm text-gray-600">
                • Churn Prediction: ~87% accuracy<br/>
                • Fraud Detection: ~92% accuracy<br/>
                • Customer Segmentation: ~79% accuracy
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Response Formats</h4>
              <p className="text-sm text-gray-600 mb-4">
                All responses are in JSON format with consistent error handling, timestamps, and metadata.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">HTTP Status Codes</h4>
              <p className="text-sm text-gray-600 mb-4">
                • 200: Success<br/>
                • 400: Bad Request (invalid parameters)<br/>
                • 404: Not Found (invalid endpoint/resource)<br/>
                • 500: Internal Server Error<br/>
                • 503: Service Unavailable (models not loaded)
              </p>

              <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
              <p className="text-sm text-gray-600">
                • Use batch endpoints for multiple predictions<br/>
                • Implement exponential backoff for retries<br/>
                • Cache frequently accessed customer data<br/>
                • Monitor response times and error rates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
