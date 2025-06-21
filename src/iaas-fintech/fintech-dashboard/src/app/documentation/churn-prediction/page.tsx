'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Target, TrendingUp, Brain, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ChurnPredictionDocPage = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Sample data for visualizations
  const featureImportance = [
    { feature: 'days_since_last_transaction', importance: 0.23, description: 'Time since last customer activity' },
    { feature: 'avg_transaction_amount', importance: 0.19, description: 'Average spending per transaction' },
    { feature: 'total_transactions', importance: 0.17, description: 'Total number of transactions' },
    { feature: 'merchant_diversity', importance: 0.14, description: 'Variety of merchants used' },
    { feature: 'weekend_ratio', importance: 0.11, description: 'Percentage of weekend transactions' },
    { feature: 'location_diversity', importance: 0.09, description: 'Geographic spending diversity' },
    { feature: 'payment_mode_variety', importance: 0.07, description: 'Different payment methods used' }
  ];

  const modelPerformance = [
    { metric: 'Accuracy', value: 87.3, target: 85, status: 'good' },
    { metric: 'Precision', value: 82.1, target: 80, status: 'good' },
    { metric: 'Recall', value: 79.4, target: 75, status: 'good' },
    { metric: 'F1-Score', value: 80.7, target: 78, status: 'good' },
    { metric: 'AUC-ROC', value: 0.873, target: 0.85, status: 'good' }
  ];

  const riskDistribution = [
    { name: 'Low Risk (0-30%)', value: 68.2, count: 5456, color: '#10B981' },
    { name: 'Medium Risk (30-60%)', value: 23.4, count: 1872, color: '#F59E0B' },
    { name: 'High Risk (60-80%)', value: 6.8, count: 544, color: '#EF4444' },
    { name: 'Critical Risk (80%+)', value: 1.6, count: 128, color: '#7C2D12' }
  ];

  const businessImpact = [
    { metric: 'Customers at Risk', value: '2,544', change: '+156', trend: 'up' },
    { metric: 'Potential Revenue Loss', value: '$2.1M', change: '-$180K', trend: 'down' },
    { metric: 'Retention Actions', value: '1,247', change: '+89', trend: 'up' },
    { metric: 'Success Rate', value: '73.4%', change: '+2.1%', trend: 'up' }
  ];

  const sections = [
    {
      id: 'overview',
      title: '🎯 Churn Prediction Overview',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">What is Customer Churn?</h4>
            <p className="text-blue-800 mb-4">
              Customer churn refers to when customers stop doing business with a company. In the fintech industry, 
              this typically means customers closing accounts, stopping transactions, or switching to competitors.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Business Impact</h5>
                <p className="text-sm text-gray-600">
                  Acquiring new customers costs 5-25x more than retaining existing ones
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Prediction Value</h5>
                <p className="text-sm text-gray-600">
                  Early identification allows proactive retention strategies
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">ROI Potential</h5>
                <p className="text-sm text-gray-600">
                  5% increase in retention can boost profits by 25-95%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">How Our Model Works</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h5 className="font-semibold text-gray-900">Data Collection</h5>
                  <p className="text-gray-600">Gather customer transaction data, account information, and behavioral patterns</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h5 className="font-semibold text-gray-900">Feature Engineering</h5>
                  <p className="text-gray-600">Transform raw data into 75+ meaningful features for machine learning</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h5 className="font-semibold text-gray-900">ML Prediction</h5>
                  <p className="text-gray-600">Ensemble model generates churn probability score (0-100%)</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h5 className="font-semibold text-gray-900">Business Action</h5>
                  <p className="text-gray-600">Trigger retention campaigns and personalized interventions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {businessImpact.map((item, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-600 mb-1">{item.metric}</h5>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                  <span className={`text-sm font-medium ${
                    item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: '🔧 Feature Engineering',
      content: (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Feature Importance Analysis</h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={featureImportance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 'dataMax']} />
                <YAxis dataKey="feature" type="category" width={200} />
                <Tooltip 
                  formatter={(value, name) => [`${(value as number * 100).toFixed(1)}%`, 'Importance']}
                  labelFormatter={(label) => {
                    const feature = featureImportance.find(f => f.feature === label);
                    return feature ? feature.description : label;
                  }}
                />
                <Bar dataKey="importance" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recency Features</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Days Since Last Transaction</span>
                  <span className="text-sm text-gray-600">Primary indicator</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Days Since Last Login</span>
                  <span className="text-sm text-gray-600">Engagement metric</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Days Since Account Opening</span>
                  <span className="text-sm text-gray-600">Lifecycle stage</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Frequency Features</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Total Transactions</span>
                  <span className="text-sm text-gray-600">Activity level</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Monthly Transaction Count</span>
                  <span className="text-sm text-gray-600">Usage pattern</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Unique Merchants</span>
                  <span className="text-sm text-gray-600">Diversity metric</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Monetary Features</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Average Transaction Amount</span>
                  <span className="text-sm text-gray-600">Spending behavior</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Total Customer Value</span>
                  <span className="text-sm text-gray-600">Lifetime value</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Spending Volatility</span>
                  <span className="text-sm text-gray-600">Consistency metric</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Features</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Weekend Transaction Ratio</span>
                  <span className="text-sm text-gray-600">Usage timing</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Payment Method Diversity</span>
                  <span className="text-sm text-gray-600">Preference variety</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Geographic Diversity</span>
                  <span className="text-sm text-gray-600">Location patterns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'model',
      title: '🧠 Model Architecture',
      content: (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Ensemble Approach</h4>
            <p className="text-gray-600 mb-4">
              Our churn prediction model uses an ensemble approach combining multiple algorithms for improved accuracy and robustness.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">Random Forest</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Weight: 40%</li>
                  <li>• Trees: 100</li>
                  <li>• Max Depth: 10</li>
                  <li>• Features: sqrt(n)</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">XGBoost</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Weight: 35%</li>
                  <li>• Estimators: 200</li>
                  <li>• Learning Rate: 0.1</li>
                  <li>• Max Depth: 6</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">Logistic Regression</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Weight: 25%</li>
                  <li>• Regularization: L2</li>
                  <li>• C: 1.0</li>
                  <li>• Solver: liblinear</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Model Performance Metrics</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Metric</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Current Value</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Target</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {modelPerformance.map((metric, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{metric.metric}</td>
                      <td className="text-center py-3 px-4">
                        <span className="text-lg font-bold text-blue-600">
                          {metric.metric === 'AUC-ROC' ? metric.value : `${metric.value}%`}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">
                        {metric.metric === 'AUC-ROC' ? metric.target : `${metric.target}%`}
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          Above Target
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {metric.metric === 'Accuracy' && 'Overall prediction correctness'}
                        {metric.metric === 'Precision' && 'True churners among predicted churners'}
                        {metric.metric === 'Recall' && 'Predicted churners among actual churners'}
                        {metric.metric === 'F1-Score' && 'Harmonic mean of precision and recall'}
                        {metric.metric === 'AUC-ROC' && 'Area under the ROC curve'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Training Process</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h5 className="font-semibold text-gray-900">Data Preparation</h5>
                  <p className="text-gray-600">80/20 train-test split with stratified sampling</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h5 className="font-semibold text-gray-900">Feature Selection</h5>
                  <p className="text-gray-600">Recursive feature elimination and correlation analysis</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h5 className="font-semibold text-gray-900">Hyperparameter Tuning</h5>
                  <p className="text-gray-600">Grid search with 5-fold cross-validation</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h5 className="font-semibold text-gray-900">Model Validation</h5>
                  <p className="text-gray-600">Out-of-time validation with 3-month holdout period</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'business',
      title: '💼 Business Impact & ROI',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-900 mb-3">Financial Impact Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Annual Revenue Protected</h5>
                <p className="text-2xl font-bold text-green-600">$14.9M</p>
                <p className="text-sm text-gray-600">Through successful retention</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Cost Savings</h5>
                <p className="text-2xl font-bold text-green-600">$3.2M</p>
                <p className="text-sm text-gray-600">Reduced acquisition costs</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">ROI</h5>
                <p className="text-2xl font-bold text-green-600">847%</p>
                <p className="text-sm text-gray-600">Return on investment</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name.split(' ')[0]} ${name.split(' ')[1]}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-3">
                {riskDistribution.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: risk.color }}
                      ></div>
                      <span className="font-medium">{risk.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{risk.count.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{risk.value}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Retention Strategies by Risk Level</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-semibold text-green-700">Low Risk (0-30%)</h5>
                  <ul className="text-sm text-gray-600 space-y-1 mt-2">
                    <li>• Regular engagement campaigns</li>
                    <li>• Product cross-selling opportunities</li>
                    <li>• Loyalty program enrollment</li>
                    <li>• Feature usage education</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h5 className="font-semibold text-yellow-700">Medium Risk (30-60%)</h5>
                  <ul className="text-sm text-gray-600 space-y-1 mt-2">
                    <li>• Personalized offers and discounts</li>
                    <li>• Dedicated customer success contact</li>
                    <li>• Usage behavior analysis</li>
                    <li>• Feedback surveys and improvement</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h5 className="font-semibold text-orange-700">High Risk (60-80%)</h5>
                  <ul className="text-sm text-gray-600 space-y-1 mt-2">
                    <li>• Immediate customer outreach</li>
                    <li>• Exclusive retention offers</li>
                    <li>• Account manager assignment</li>
                    <li>• Product feature customization</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h5 className="font-semibold text-red-700">Critical Risk (80%+)</h5>
                  <ul className="text-sm text-gray-600 space-y-1 mt-2">
                    <li>• Executive-level intervention</li>
                    <li>• Premium support and services</li>
                    <li>• Win-back campaign deployment</li>
                    <li>• Relationship rebuild programs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">Success Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">73.4%</div>
                <div className="text-sm text-blue-800">Retention Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2.3%</div>
                <div className="text-sm text-blue-800">Overall Churn Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$127</div>
                <div className="text-sm text-blue-800">Avg. Retention Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$1,847</div>
                <div className="text-sm text-blue-800">Avg. Customer Value Saved</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔮 Churn Prediction Documentation</h1>
          <p className="text-gray-600">Comprehensive guide to customer churn prediction models and implementation</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">87.3%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Protected</p>
                <p className="text-2xl font-bold text-gray-900">$14.9M</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Features Used</p>
                <p className="text-2xl font-bold text-gray-900">75+</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retention Rate</p>
                <p className="text-2xl font-bold text-gray-900">73.4%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </div>
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

        {/* Related Resources */}
        <div className="bg-gray-100 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/churn-prediction" className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <Target className="h-6 w-6 text-blue-500" />
              <div>
                <div className="font-medium">Interactive Churn Prediction</div>
                <div className="text-sm text-gray-600">Try the live prediction tool</div>
              </div>
            </a>
            <a href="/model-insights" className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <Brain className="h-6 w-6 text-purple-500" />
              <div>
                <div className="font-medium">Model Performance</div>
                <div className="text-sm text-gray-600">View detailed model metrics</div>
              </div>
            </a>
            <a href="/feature-engineering" className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <div>
                <div className="font-medium">Feature Engineering</div>
                <div className="text-sm text-gray-600">Learn about data features</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnPredictionDocPage;
