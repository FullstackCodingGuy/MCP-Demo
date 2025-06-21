'use client';

import React, { useState } from 'react';
import { Copy, CheckCircle, Play, Code, Book, Zap } from 'lucide-react';

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: Record<string, any>;
  response_example: Record<string, any>;
  code_example: string;
}

const API_ENDPOINTS: APIEndpoint[] = [
  {
    method: 'GET',
    path: '/health',
    description: 'Check API health status',
    response_example: {
      status: 'healthy',
      timestamp: '2024-01-15T10:30:00Z',
      version: '1.0.0'
    },
    code_example: `curl -X GET "${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/health"`
  },
  {
    method: 'GET',
    path: '/customers',
    description: 'Retrieve all customers with their features',
    response_example: {
      customers: [
        {
          customer_id: 'CUST_000001',
          days_since_last_transaction: 15,
          total_transactions: 25,
          avg_transaction_amount: 150.75,
          total_amount: -1250.50,
          segment: 'High Value',
          risk_level: 'Low'
        }
      ],
      total: 1000
    },
    code_example: `curl -X GET "${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/customers"`
  },
  {
    method: 'GET',
    path: '/customers/{customer_id}',
    description: 'Retrieve a specific customer by ID',
    parameters: {
      customer_id: {
        type: 'string',
        description: 'Unique customer identifier',
        example: 'CUST_000001'
      }
    },
    response_example: {
      customer_id: 'CUST_000001',
      days_since_last_transaction: 15,
      total_transactions: 25,
      avg_transaction_amount: 150.75,
      total_amount: -1250.50,
      segment: 'High Value',
      risk_level: 'Low'
    },
    code_example: `curl -X GET "${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/customers/CUST_000001"`
  },
  {
    method: 'POST',
    path: '/predict/churn',
    description: 'Predict churn probability for a single customer',
    parameters: {
      customer_id: {
        type: 'string',
        description: 'Customer identifier',
        required: true
      },
      days_since_last_transaction: {
        type: 'number',
        description: 'Days since last transaction',
        required: true
      },
      total_transactions: {
        type: 'number',
        description: 'Total number of transactions',
        required: true
      },
      avg_transaction_amount: {
        type: 'number',
        description: 'Average transaction amount',
        required: true
      },
      total_amount: {
        type: 'number',
        description: 'Total transaction amount',
        required: true
      }
    },
    response_example: {
      customer_id: 'CUST_000001',
      churn_probability: 0.23,
      risk_category: 'Low Risk',
      confidence: 0.87,
      timestamp: '2024-01-15T10:30:00Z'
    },
    code_example: `curl -X POST "${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/predict/churn" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "CUST_000001",
    "days_since_last_transaction": 15,
    "total_transactions": 25,
    "avg_transaction_amount": 150.75,
    "total_amount": -1250.50
  }'`
  },
  {
    method: 'POST',
    path: '/predict/churn/batch',
    description: 'Predict churn probability for multiple customers',
    parameters: {
      customers: {
        type: 'array',
        description: 'Array of customer objects',
        required: true
      }
    },
    response_example: {
      predictions: [
        {
          customer_id: 'CUST_000001',
          churn_probability: 0.23,
          risk_category: 'Low Risk',
          confidence: 0.87
        }
      ],
      processed: 1,
      timestamp: '2024-01-15T10:30:00Z'
    },
    code_example: `curl -X POST "${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/predict/churn/batch" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customers": [
      {
        "customer_id": "CUST_000001",
        "days_since_last_transaction": 15,
        "total_transactions": 25,
        "avg_transaction_amount": 150.75,
        "total_amount": -1250.50
      }
    ]
  }'`
  },
  {
    method: 'GET',
    path: '/stats',
    description: 'Get API usage statistics and model performance metrics',
    response_example: {
      total_predictions: 15420,
      daily_predictions: 245,
      model_accuracy: 0.875,
      avg_response_time: 0.12,
      last_updated: '2024-01-15T10:30:00Z'
    },
    code_example: `curl -X GET "${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/stats"`
  }
];

export default function APIDocumentationPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint>(API_ENDPOINTS[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Documentation</h1>
        <p className="text-gray-600">Interactive API documentation and testing for the Fintech Inference Service</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Endpoints</p>
              <p className="text-2xl font-bold text-gray-900">{API_ENDPOINTS.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">API Version</p>
              <p className="text-2xl font-bold text-gray-900">v1.0.0</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Book className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Base URL</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Endpoints List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Endpoints</h3>
            <div className="space-y-2">
              {API_ENDPOINTS.map((endpoint, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedEndpoint(endpoint)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedEndpoint === endpoint
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded border ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {endpoint.path}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {endpoint.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Endpoint Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 text-sm font-semibold rounded border ${getMethodColor(selectedEndpoint.method)}`}>
                {selectedEndpoint.method}
              </span>
              <h3 className="text-xl font-bold text-gray-900">{selectedEndpoint.path}</h3>
            </div>

            <p className="text-gray-600 mb-6">{selectedEndpoint.description}</p>

            {/* Parameters */}
            {selectedEndpoint.parameters && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Required
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(selectedEndpoint.parameters).map(([name, param]) => (
                        <tr key={name}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {typeof param === 'object' ? param.type : 'string'}
                            </code>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {typeof param === 'object' && param.required ? (
                              <span className="text-red-600 font-medium">Yes</span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {typeof param === 'object' ? param.description : 'Parameter description'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

            {/* Try It Button */}
            <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              Try This Endpoint
            </button>
          </div>
        </div>
      </div>

      {/* API Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">120ms</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">15.4K</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">87.5%</div>
            <div className="text-sm text-gray-600">Model Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
