'use client';

import React, { useState } from 'react';
import { BarChart3, Users, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomerAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedSegment, setSelectedSegment] = useState('all');

  // Sample data
  const behaviorTrends = [
    { month: 'Jan', avgTransactions: 15, avgAmount: 2500, retention: 94 },
    { month: 'Feb', avgTransactions: 18, avgAmount: 2800, retention: 92 },
    { month: 'Mar', avgTransactions: 22, avgAmount: 3200, retention: 95 },
    { month: 'Apr', avgTransactions: 20, avgAmount: 2900, retention: 93 },
    { month: 'May', avgTransactions: 25, avgAmount: 3500, retention: 96 },
    { month: 'Jun', avgTransactions: 28, avgAmount: 3800, retention: 94 },
  ];

  const segmentData = [
    { name: 'High Value', value: 25, color: '#10B981' },
    { name: 'Growing', value: 35, color: '#3B82F6' },
    { name: 'At Risk', value: 20, color: '#F59E0B' },
    { name: 'New', value: 20, color: '#8B5CF6' },
  ];

  const cohortData = [
    { cohort: 'Jan 2024', month1: 100, month2: 85, month3: 78, month4: 75, month5: 72, month6: 70 },
    { cohort: 'Feb 2024', month1: 100, month2: 88, month3: 82, month4: 79, month5: 76, month6: 74 },
    { cohort: 'Mar 2024', month1: 100, month2: 90, month3: 85, month4: 82, month5: 80, month6: 78 },
    { cohort: 'Apr 2024', month1: 100, month2: 87, month3: 81, month4: 78, month5: 75, month6: 73 },
    { cohort: 'May 2024', month1: 100, month2: 89, month3: 84, month4: 81, month5: 79, month6: 76 },
    { cohort: 'Jun 2024', month1: 100, month2: 91, month3: 87, month4: 85, month5: 83, month6: 81 },
  ];

  const lifetimeValueData = [
    { segment: 'Premium', clv: 125000, acquisitionCost: 2500, paybackPeriod: 6 },
    { segment: 'Standard', clv: 45000, acquisitionCost: 1200, paybackPeriod: 8 },
    { segment: 'Basic', clv: 18000, acquisitionCost: 600, paybackPeriod: 12 },
    { segment: 'Student', clv: 8000, acquisitionCost: 300, paybackPeriod: 18 },
  ];

  const engagementMetrics = [
    { feature: 'Mobile App', usage: 85, satisfaction: 4.2 },
    { feature: 'Online Banking', usage: 78, satisfaction: 4.0 },
    { feature: 'ATM Network', usage: 65, satisfaction: 3.8 },
    { feature: 'Branch Services', usage: 32, satisfaction: 4.5 },
    { feature: 'Customer Support', usage: 28, satisfaction: 3.9 },
    { feature: 'Investment Tools', usage: 22, satisfaction: 4.1 },
  ];

  const riskFactors = [
    { factor: 'Decreased Transaction Frequency', impact: 0.85, prevalence: 23 },
    { factor: 'Reduced Average Transaction Size', impact: 0.72, prevalence: 18 },
    { factor: 'Limited Feature Usage', impact: 0.68, prevalence: 31 },
    { factor: 'Customer Service Complaints', impact: 0.79, prevalence: 12 },
    { factor: 'Long Periods of Inactivity', impact: 0.91, prevalence: 15 },
    { factor: 'Competitive Offer Inquiries', impact: 0.88, prevalence: 8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📈 Customer Analytics</h1>
          <p className="text-gray-600">Deep dive into customer behavior and patterns</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Segment</label>
              <select 
                value={selectedSegment} 
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Segments</option>
                <option value="high-value">High Value</option>
                <option value="growing">Growing</option>
                <option value="at-risk">At Risk</option>
                <option value="new">New</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average CLV</p>
                <p className="text-2xl font-bold text-gray-900">$52,400</p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Score</p>
                <p className="text-2xl font-bold text-gray-900">74.2%</p>
                <p className="text-sm text-blue-600">+3.2% from last month</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retention Rate</p>
                <p className="text-2xl font-bold text-gray-900">94.8%</p>
                <p className="text-sm text-green-600">+1.1% from last month</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NPS Score</p>
                <p className="text-2xl font-bold text-gray-900">67</p>
                <p className="text-sm text-green-600">+4 from last quarter</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Behavior Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Behavior Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={behaviorTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="avgTransactions" stroke="#3B82F6" name="Avg Transactions" />
                <Line yAxisId="right" type="monotone" dataKey="retention" stroke="#10B981" name="Retention %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cohort Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cohort Retention Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Cohort</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Month 1</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Month 2</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Month 3</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Month 4</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Month 5</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Month 6</th>
                </tr>
              </thead>
              <tbody>
                {cohortData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 font-medium">{row.cohort}</td>
                    <td className="text-center py-2 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {row.month1}%
                      </span>
                    </td>
                    <td className="text-center py-2 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        row.month2 >= 85 ? 'bg-green-100 text-green-800' : 
                        row.month2 >= 75 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.month2}%
                      </span>
                    </td>
                    <td className="text-center py-2 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        row.month3 >= 80 ? 'bg-green-100 text-green-800' : 
                        row.month3 >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.month3}%
                      </span>
                    </td>
                    <td className="text-center py-2 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        row.month4 >= 75 ? 'bg-green-100 text-green-800' : 
                        row.month4 >= 65 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.month4}%
                      </span>
                    </td>
                    <td className="text-center py-2 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        row.month5 >= 75 ? 'bg-green-100 text-green-800' : 
                        row.month5 >= 65 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.month5}%
                      </span>
                    </td>
                    <td className="text-center py-2 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        row.month6 >= 75 ? 'bg-green-100 text-green-800' : 
                        row.month6 >= 65 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.month6}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Lifetime Value */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Lifetime Value by Segment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lifetimeValueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'CLV']} />
                <Bar dataKey="clv" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Engagement vs Satisfaction</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={engagementMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="usage" name="Usage %" />
                <YAxis dataKey="satisfaction" name="Satisfaction" domain={[3, 5]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [
                    name === 'usage' ? `${value}%` : value,
                    name === 'usage' ? 'Usage' : 'Satisfaction'
                  ]}
                  labelFormatter={(label) => `Feature: ${engagementMetrics.find(m => m.usage === label)?.feature || ''}`}
                />
                <Scatter dataKey="satisfaction" fill="#10B981" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Factor Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn Risk Factor Analysis</h3>
          <div className="space-y-4">
            {riskFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                  <p className="text-sm text-gray-600">
                    Impact Score: {factor.impact} | Prevalence: {factor.prevalence}% of customers
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${factor.impact * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {(factor.impact * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalyticsPage;
