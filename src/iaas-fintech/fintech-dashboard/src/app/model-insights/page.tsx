'use client';

import React, { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Clock, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ModelInsightsPage = () => {
  const [selectedModel, setSelectedModel] = useState('churn');
  const [timeRange, setTimeRange] = useState('30d');

  // Model performance data
  const models = {
    churn: {
      name: 'Churn Prediction',
      accuracy: 87.3,
      precision: 82.1,
      recall: 79.4,
      f1Score: 80.7,
      auc: 0.873,
      status: 'healthy',
      lastTrained: '2024-06-15',
      predictions: 15847,
      falsePositives: 234,
      falseNegatives: 187
    },
    fraud: {
      name: 'Fraud Detection',
      accuracy: 92.1,
      precision: 88.7,
      recall: 85.3,
      f1Score: 87.0,
      auc: 0.921,
      status: 'healthy',
      lastTrained: '2024-06-18',
      predictions: 247891,
      falsePositives: 1203,
      falseNegatives: 892
    },
    segmentation: {
      name: 'Customer Segmentation',
      accuracy: 74.2,
      precision: 71.8,
      recall: 68.9,
      f1Score: 70.3,
      auc: 0.742,
      status: 'warning',
      lastTrained: '2024-06-12',
      predictions: 8200,
      falsePositives: 456,
      falseNegatives: 378
    }
  };

  // Feature importance data
  const featureImportance = {
    churn: [
      { feature: 'days_since_last_transaction', importance: 0.23, description: 'Time since last activity' },
      { feature: 'avg_transaction_amount', importance: 0.19, description: 'Average spending per transaction' },
      { feature: 'total_transactions', importance: 0.17, description: 'Total number of transactions' },
      { feature: 'merchant_diversity', importance: 0.14, description: 'Variety of merchants used' },
      { feature: 'weekend_ratio', importance: 0.11, description: 'Percentage of weekend transactions' },
      { feature: 'location_diversity', importance: 0.09, description: 'Geographic spending diversity' },
      { feature: 'payment_mode_variety', importance: 0.07, description: 'Different payment methods used' }
    ],
    fraud: [
      { feature: 'transaction_velocity', importance: 0.28, description: 'Speed of consecutive transactions' },
      { feature: 'geographic_distance', importance: 0.22, description: 'Distance from usual locations' },
      { feature: 'amount_deviation', importance: 0.18, description: 'Deviation from normal amounts' },
      { feature: 'time_of_day', importance: 0.15, description: 'Unusual transaction timing' },
      { feature: 'merchant_category', importance: 0.12, description: 'Merchant type risk score' },
      { feature: 'device_fingerprint', importance: 0.05, description: 'Device recognition score' }
    ],
    segmentation: [
      { feature: 'total_spending', importance: 0.31, description: 'Total customer spending' },
      { feature: 'transaction_frequency', importance: 0.26, description: 'Frequency of transactions' },
      { feature: 'recency_score', importance: 0.21, description: 'How recently customer was active' },
      { feature: 'product_diversity', importance: 0.14, description: 'Variety of products purchased' },
      { feature: 'seasonal_pattern', importance: 0.08, description: 'Seasonal spending patterns' }
    ]
  };

  // Performance trends over time
  const performanceTrends = [
    { date: '2024-01', churn: 85.2, fraud: 90.1, segmentation: 71.3 },
    { date: '2024-02', churn: 86.1, fraud: 91.2, segmentation: 72.8 },
    { date: '2024-03', churn: 85.7, fraud: 91.8, segmentation: 73.1 },
    { date: '2024-04', churn: 86.9, fraud: 92.3, segmentation: 73.7 },
    { date: '2024-05', churn: 87.1, fraud: 92.0, segmentation: 74.0 },
    { date: '2024-06', churn: 87.3, fraud: 92.1, segmentation: 74.2 }
  ];

  // Model drift detection
  const driftMetrics = [
    { metric: 'Data Drift', churn: 0.12, fraud: 0.08, segmentation: 0.25, threshold: 0.2 },
    { metric: 'Concept Drift', churn: 0.09, fraud: 0.06, segmentation: 0.18, threshold: 0.15 },
    { metric: 'Prediction Drift', churn: 0.07, fraud: 0.11, segmentation: 0.14, threshold: 0.12 }
  ];

  // Training metrics
  const trainingMetrics = [
    { epoch: 1, loss: 0.92, accuracy: 0.67, valLoss: 0.94, valAccuracy: 0.65 },
    { epoch: 2, loss: 0.78, accuracy: 0.73, valLoss: 0.81, valAccuracy: 0.71 },
    { epoch: 3, loss: 0.65, accuracy: 0.79, valLoss: 0.69, valAccuracy: 0.77 },
    { epoch: 4, loss: 0.58, accuracy: 0.83, valLoss: 0.62, valAccuracy: 0.81 },
    { epoch: 5, loss: 0.52, accuracy: 0.86, valLoss: 0.57, valAccuracy: 0.84 },
    { epoch: 6, loss: 0.48, accuracy: 0.87, valLoss: 0.54, valAccuracy: 0.85 }
  ];

  const currentModel = models[selectedModel as keyof typeof models];
  const currentFeatures = featureImportance[selectedModel as keyof typeof featureImportance];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getDriftColor = (value: number, threshold: number) => {
    if (value > threshold) return 'text-red-600 bg-red-100';
    if (value > threshold * 0.8) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🧠 Model Insights</h1>
          <p className="text-gray-600">AI model performance and feature importance analysis</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="churn">Churn Prediction</option>
                <option value="fraud">Fraud Detection</option>
                <option value="segmentation">Customer Segmentation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Model Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{currentModel.name} Overview</h2>
            <div className="flex items-center space-x-2">
              {getStatusIcon(currentModel.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentModel.status)}`}>
                {currentModel.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{currentModel.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{currentModel.precision}%</div>
              <div className="text-sm text-gray-600">Precision</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{currentModel.recall}%</div>
              <div className="text-sm text-gray-600">Recall</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{currentModel.f1Score}%</div>
              <div className="text-sm text-gray-600">F1-Score</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">{currentModel.predictions.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Predictions</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">{currentModel.lastTrained}</div>
              <div className="text-sm text-gray-600">Last Trained</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">{currentModel.auc}</div>
              <div className="text-sm text-gray-600">AUC-ROC Score</div>
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[65, 95]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="churn" stroke="#3B82F6" name="Churn Model" />
                <Line type="monotone" dataKey="fraud" stroke="#10B981" name="Fraud Model" />
                <Line type="monotone" dataKey="segmentation" stroke="#8B5CF6" name="Segmentation Model" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trainingMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#10B981" name="Training Accuracy" />
                <Line type="monotone" dataKey="valAccuracy" stroke="#3B82F6" name="Validation Accuracy" />
                <Line type="monotone" dataKey="loss" stroke="#EF4444" name="Training Loss" />
                <Line type="monotone" dataKey="valLoss" stroke="#F59E0B" name="Validation Loss" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Importance - {currentModel.name}</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={currentFeatures} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax']} />
              <YAxis dataKey="feature" type="category" width={180} />
              <Tooltip 
                formatter={(value, name) => [`${(value as number * 100).toFixed(1)}%`, 'Importance']}
                labelFormatter={(label) => {
                  const feature = currentFeatures.find(f => f.feature === label);
                  return feature ? feature.description : label;
                }}
              />
              <Bar dataKey="importance" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{feature.feature.replace(/_/g, ' ')}</div>
                  <div className="text-sm text-gray-600">{feature.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{(feature.importance * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Drift Detection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Drift Detection</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Drift Type</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Churn Model</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Fraud Model</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Segmentation Model</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Threshold</th>
                </tr>
              </thead>
              <tbody>
                {driftMetrics.map((metric, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{metric.metric}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getDriftColor(metric.churn, metric.threshold)}`}>
                        {metric.churn.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getDriftColor(metric.fraud, metric.threshold)}`}>
                        {metric.fraud.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getDriftColor(metric.segmentation, metric.threshold)}`}>
                        {metric.segmentation.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-600">{metric.threshold.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(models).map(([key, model]) => (
              <div 
                key={key} 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedModel === key ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedModel(key)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{model.name}</h4>
                  {getStatusIcon(model.status)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Accuracy:</span>
                    <span className="text-sm font-medium">{model.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">F1-Score:</span>
                    <span className="text-sm font-medium">{model.f1Score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Predictions:</span>
                    <span className="text-sm font-medium">{model.predictions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Trained:</span>
                    <span className="text-sm font-medium">{model.lastTrained}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInsightsPage;
