'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Settings, Database, TrendingUp, Zap, Code, Play, Download } from 'lucide-react';

interface FeatureInfo {
  name: string;
  description: string;
  type: 'numerical' | 'categorical' | 'datetime' | 'derived';
  importance_score: number;
  data_type: string;
  example_values: string[];
  transformation: string;
}

const FEATURE_CATEGORIES = {
  'Customer Features': [
    {
      name: 'days_since_last_transaction',
      description: 'Number of days since the customer\'s last transaction',
      type: 'numerical' as const,
      importance_score: 0.35,
      data_type: 'int',
      example_values: ['5', '15', '30', '60'],
      transformation: 'No transformation needed'
    },
    {
      name: 'total_transactions',
      description: 'Total number of transactions made by the customer',
      type: 'numerical' as const,
      importance_score: 0.25,
      data_type: 'int',
      example_values: ['10', '25', '50', '100'],
      transformation: 'Log transformation applied'
    },
    {
      name: 'avg_transaction_amount',
      description: 'Average amount per transaction',
      type: 'numerical' as const,
      importance_score: 0.20,
      data_type: 'float',
      example_values: ['50.25', '150.75', '300.00', '500.50'],
      transformation: 'Standard scaling applied'
    },
    {
      name: 'total_amount',
      description: 'Total transaction amount (can be negative for withdrawals)',
      type: 'numerical' as const,
      importance_score: 0.18,
      data_type: 'float',
      example_values: ['-1250.50', '0.00', '2500.75', '10000.00'],
      transformation: 'Min-max normalization'
    }
  ],
  'Transaction Features': [
    {
      name: 'transaction_frequency',
      description: 'Frequency of transactions per month',
      type: 'derived' as const,
      importance_score: 0.22,
      data_type: 'float',
      example_values: ['0.5', '2.0', '5.5', '10.0'],
      transformation: 'Derived from transaction count and date range'
    },
    {
      name: 'spending_volatility',
      description: 'Standard deviation of transaction amounts',
      type: 'derived' as const,
      importance_score: 0.15,
      data_type: 'float',
      example_values: ['25.50', '75.25', '150.00', '300.75'],
      transformation: 'Calculated from transaction amounts'
    },
    {
      name: 'transaction_trend',
      description: 'Trend of transaction amounts over time',
      type: 'derived' as const,
      importance_score: 0.12,
      data_type: 'float',
      example_values: ['-0.05', '0.00', '0.03', '0.10'],
      transformation: 'Linear regression slope'
    }
  ],
  'Behavioral Features': [
    {
      name: 'account_age',
      description: 'Age of the customer account in months',
      type: 'datetime' as const,
      importance_score: 0.08,
      data_type: 'int',
      example_values: ['6', '12', '24', '48'],
      transformation: 'Calculated from account creation date'
    },
    {
      name: 'preferred_channel',
      description: 'Most frequently used transaction channel',
      type: 'categorical' as const,
      importance_score: 0.10,
      data_type: 'string',
      example_values: ['mobile', 'web', 'atm', 'branch'],
      transformation: 'One-hot encoding applied'
    },
    {
      name: 'customer_segment',
      description: 'Business-defined customer segment',
      type: 'categorical' as const,
      importance_score: 0.14,
      data_type: 'string',
      example_values: ['High Value', 'Growth Potential', 'At Risk', 'New Customer'],
      transformation: 'Label encoding applied'
    }
  ]
};

export default function FeatureEngineeringPage() {
  const [selectedCategory, setSelectedCategory] = useState('Customer Features');
  const [selectedFeature, setSelectedFeature] = useState<FeatureInfo | null>(null);

  // Get all features
  const allFeatures = Object.values(FEATURE_CATEGORIES).flat();

  // Feature importance data for chart
  const featureImportanceData = allFeatures
    .sort((a, b) => b.importance_score - a.importance_score)
    .slice(0, 8)
    .map(feature => ({
      name: feature.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      importance: feature.importance_score,
      type: feature.type
    }));

  // Feature type distribution
  const typeDistribution = allFeatures.reduce((acc, feature) => {
    acc[feature.type] = (acc[feature.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeDistributionData = Object.entries(typeDistribution).map(([type, count]) => ({
    name: type,
    value: count
  }));

  // Simulated feature creation pipeline status
  const pipelineSteps = [
    { name: 'Data Extraction', status: 'completed', time: '2.3s' },
    { name: 'Data Cleaning', status: 'completed', time: '1.8s' },
    { name: 'Feature Generation', status: 'completed', time: '4.2s' },
    { name: 'Feature Selection', status: 'completed', time: '1.5s' },
    { name: 'Feature Scaling', status: 'completed', time: '0.8s' },
    { name: 'Model Training', status: 'running', time: '45.2s' },
    { name: 'Model Validation', status: 'pending', time: '---' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feature Engineering</h1>
        <p className="text-gray-600">Data preprocessing and feature creation tools for machine learning models</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Features</p>
              <p className="text-2xl font-bold text-gray-900">{allFeatures.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Feature Categories</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(FEATURE_CATEGORIES).length}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pipeline Status</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Last Update</p>
              <p className="text-sm font-bold text-gray-900">2 hours ago</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Categories and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feature Categories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Categories</h3>
            <div className="space-y-2">
              {Object.entries(FEATURE_CATEGORIES).map(([category, features]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{category}</span>
                    <span className="text-sm text-gray-500">{features.length} features</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedCategory}</h3>
            <div className="space-y-3">
              {FEATURE_CATEGORIES[selectedCategory as keyof typeof FEATURE_CATEGORIES].map((feature, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedFeature(feature)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {feature.name}
                        </code>
                        <span className={`px-2 py-1 text-xs font-semibold rounded border ${
                          feature.type === 'numerical' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          feature.type === 'categorical' ? 'bg-green-50 text-green-700 border-green-200' :
                          feature.type === 'datetime' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                          {feature.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Type: {feature.data_type}</span>
                        <span>Importance: {(feature.importance_score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {(feature.importance_score * 100).toFixed(1)}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${feature.importance_score * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Details Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Feature Details</h3>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feature Name</label>
                  <code className="block text-sm font-mono bg-gray-100 px-3 py-2 rounded">
                    {selectedFeature.name}
                  </code>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-sm text-gray-600">{selectedFeature.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${
                      selectedFeature.type === 'numerical' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      selectedFeature.type === 'categorical' ? 'bg-green-50 text-green-700 border-green-200' :
                      selectedFeature.type === 'datetime' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {selectedFeature.type}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
                    <code className="text-sm">{selectedFeature.data_type}</code>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Importance Score</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${selectedFeature.importance_score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{(selectedFeature.importance_score * 100).toFixed(1)}%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Example Values</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeature.example_values.map((value, index) => (
                      <code key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {value}
                      </code>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transformation</label>
                  <p className="text-sm text-gray-600">{selectedFeature.transformation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature Importance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Importance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="importance" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pipeline Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Engineering Pipeline</h3>
        <div className="space-y-3">
          {pipelineSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                step.status === 'completed' ? 'bg-green-500' :
                step.status === 'running' ? 'bg-blue-500 animate-pulse' :
                'bg-gray-300'
              }`} />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{step.name}</div>
                <div className="text-sm text-gray-500">
                  {step.status === 'completed' ? 'Completed' :
                   step.status === 'running' ? 'Running...' : 'Pending'}
                </div>
              </div>
              <div className="text-sm text-gray-500">{step.time}</div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Play className="w-4 h-4" />
            Run Pipeline
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Features
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Code className="w-4 h-4" />
            View Code
          </button>
        </div>
      </div>
    </div>
  );
}
