'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const FraudDetectionPage = () => {
  const [realTimeAlerts, setRealTimeAlerts] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('24h');

  // Sample real-time data
  const fraudMetrics = {
    totalTransactions: 1247891,
    flaggedTransactions: 2847,
    confirmedFraud: 421,
    falsePositives: 198,
    accuracyRate: 94.2,
    detectionTime: 0.23
  };

  const riskDistribution = [
    { name: 'Low Risk', value: 85.2, color: '#10B981' },
    { name: 'Medium Risk', value: 12.3, color: '#F59E0B' },
    { name: 'High Risk', value: 2.1, color: '#EF4444' },
    { name: 'Critical Risk', value: 0.4, color: '#7C2D12' }
  ];

  const fraudTrends = [
    { time: '00:00', attempts: 12, blocked: 11, amount: 45000 },
    { time: '04:00', attempts: 8, blocked: 7, amount: 23000 },
    { time: '08:00', attempts: 28, blocked: 26, amount: 89000 },
    { time: '12:00', attempts: 45, blocked: 42, amount: 156000 },
    { time: '16:00', attempts: 67, blocked: 63, amount: 234000 },
    { time: '20:00', attempts: 52, blocked: 48, amount: 187000 },
  ];

  const modelPerformance = [
    { model: 'Transaction Velocity', accuracy: 96.7, falsePositive: 2.1, detectionRate: 94.8 },
    { model: 'Behavioral Analysis', accuracy: 94.2, falsePositive: 3.8, detectionRate: 91.5 },
    { model: 'Geographic Anomaly', accuracy: 92.8, falsePositive: 4.2, detectionRate: 89.3 },
    { model: 'Amount Outlier', accuracy: 89.5, falsePositive: 6.1, detectionRate: 85.7 },
    { model: 'Device Fingerprint', accuracy: 97.3, falsePositive: 1.8, detectionRate: 96.1 },
    { model: 'Network Analysis', accuracy: 91.4, falsePositive: 5.3, detectionRate: 87.9 }
  ];

  const riskFactors = [
    { factor: 'Unusual Transaction Time', weight: 0.85, description: 'Transactions outside normal hours' },
    { factor: 'Geographic Anomaly', weight: 0.92, description: 'Transactions from unusual locations' },
    { factor: 'Velocity Check', weight: 0.78, description: 'Multiple transactions in short time' },
    { factor: 'Amount Threshold', weight: 0.69, description: 'Transactions above normal patterns' },
    { factor: 'Device Recognition', weight: 0.87, description: 'Unknown or suspicious devices' },
    { factor: 'Behavioral Pattern', weight: 0.74, description: 'Deviation from user behavior' }
  ];

  const recentAlerts = [
    {
      id: 'FR-2024-001',
      timestamp: '2024-06-21 14:32:18',
      customerName: 'Sarah Johnson',
      riskScore: 0.94,
      amount: '$2,847.50',
      reason: 'Geographic anomaly + velocity check',
      status: 'Investigating',
      severity: 'high'
    },
    {
      id: 'FR-2024-002',
      timestamp: '2024-06-21 14:28:45',
      customerName: 'Michael Chen',
      riskScore: 0.87,
      amount: '$1,299.99',
      reason: 'Unusual transaction time + device fingerprint',
      status: 'Blocked',
      severity: 'critical'
    },
    {
      id: 'FR-2024-003',
      timestamp: '2024-06-21 14:25:12',
      customerName: 'Emma Rodriguez',
      riskScore: 0.72,
      amount: '$459.00',
      reason: 'Behavioral pattern deviation',
      status: 'Cleared',
      severity: 'medium'
    },
    {
      id: 'FR-2024-004',
      timestamp: '2024-06-21 14:19:33',
      customerName: 'David Kim',
      riskScore: 0.68,
      amount: '$189.50',
      reason: 'Amount threshold exceeded',
      status: 'False Positive',
      severity: 'low'
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Blocked': return 'bg-red-100 text-red-800';
      case 'Investigating': return 'bg-yellow-100 text-yellow-800';
      case 'Cleared': return 'bg-green-100 text-green-800';
      case 'False Positive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert = {
          id: `FR-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          riskScore: Math.random() * 0.4 + 0.6,
          amount: `$${(Math.random() * 5000 + 100).toFixed(2)}`,
          severity: Math.random() > 0.8 ? 'critical' : Math.random() > 0.6 ? 'high' : 'medium'
        };
        setRealTimeAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🛡️ Fraud Detection</h1>
          <p className="text-gray-600">Real-time fraud detection and prevention system</p>
        </div>

        {/* Real-time Status Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">System Status: Active</span>
              </div>
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="1h">Last hour</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{fraudMetrics.totalTransactions.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-orange-600">{fraudMetrics.flaggedTransactions.toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed Fraud</p>
                <p className="text-2xl font-bold text-red-600">{fraudMetrics.confirmedFraud}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">False Positives</p>
                <p className="text-2xl font-bold text-gray-600">{fraudMetrics.falsePositives}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{fraudMetrics.accuracyRate}%</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Detection Time</p>
                <p className="text-2xl font-bold text-blue-600">{fraudMetrics.detectionTime}s</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Fraud Trends and Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud Detection Trends (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={fraudTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="attempts" stackId="1" stroke="#EF4444" fill="#FEE2E2" name="Fraud Attempts" />
                <Area type="monotone" dataKey="blocked" stackId="2" stroke="#10B981" fill="#D1FAE5" name="Successfully Blocked" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
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
          </div>
        </div>

        {/* Model Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ML Model Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Model</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Accuracy</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">False Positive Rate</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Detection Rate</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {modelPerformance.map((model, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{model.model}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        model.accuracy >= 95 ? 'bg-green-100 text-green-800' : 
                        model.accuracy >= 90 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {model.accuracy}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        model.falsePositive <= 3 ? 'bg-green-100 text-green-800' : 
                        model.falsePositive <= 5 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {model.falsePositive}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-gray-900">{model.detectionRate}%</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factor Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskFactors.map((factor, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                  <span className="text-sm font-bold text-gray-700">{(factor.weight * 100).toFixed(0)}%</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-red-500 h-2 rounded-full" 
                    style={{ width: `${factor.weight * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Fraud Alerts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Alert ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Risk Score</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Severity</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAlerts.map((alert, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{alert.id}</td>
                    <td className="py-3 px-4 text-sm">{alert.timestamp}</td>
                    <td className="py-3 px-4 font-medium">{alert.customerName}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        alert.riskScore >= 0.9 ? 'bg-red-100 text-red-800' : 
                        alert.riskScore >= 0.7 ? 'bg-orange-100 text-orange-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {(alert.riskScore * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 font-medium">{alert.amount}</td>
                    <td className="py-3 px-4 text-sm">{alert.reason}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded border text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudDetectionPage;
