'use client';

import React, { useState } from 'react';
import { Target, Users, TrendingUp, DollarSign, Clock, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const CustomerSegmentationPage = () => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [segmentationMethod, setSegmentationMethod] = useState('rfm');

  // Segment data
  const segments = [
    {
      name: 'Champions',
      description: 'High-value customers with recent activity',
      size: 1247,
      percentage: 15.2,
      color: '#10B981',
      avgClv: 125000,
      avgRecency: 5,
      avgFrequency: 45,
      avgMonetary: 8500,
      characteristics: ['High spend', 'Frequent purchases', 'Recent activity', 'Low churn risk']
    },
    {
      name: 'Loyal Customers',
      description: 'Consistent customers with good value',
      size: 2156,
      percentage: 26.3,
      color: '#3B82F6',
      avgClv: 78000,
      avgRecency: 12,
      avgFrequency: 28,
      avgMonetary: 4200,
      characteristics: ['Regular purchases', 'Moderate spend', 'Predictable behavior', 'Low churn risk']
    },
    {
      name: 'Potential Loyalists',
      description: 'Recent customers with growth potential',
      size: 1834,
      percentage: 22.4,
      color: '#8B5CF6',
      avgClv: 42000,
      avgRecency: 8,
      avgFrequency: 15,
      avgMonetary: 2800,
      characteristics: ['New relationship', 'Growing spend', 'Increasing frequency', 'High growth potential']
    },
    {
      name: 'At Risk',
      description: 'Valuable customers becoming inactive',
      size: 876,
      percentage: 10.7,
      color: '#F59E0B',
      avgClv: 89000,
      avgRecency: 45,
      avgFrequency: 18,
      avgMonetary: 5200,
      characteristics: ['Decreasing activity', 'High historical value', 'Retention opportunity', 'Medium churn risk']
    },
    {
      name: 'Cannot Lose Them',
      description: 'High-value customers with declining activity',
      size: 342,
      percentage: 4.2,
      color: '#EF4444',
      avgClv: 156000,
      avgRecency: 78,
      avgFrequency: 35,
      avgMonetary: 12000,
      characteristics: ['Highest value', 'Declining activity', 'Critical retention', 'High churn risk']
    },
    {
      name: 'Hibernating',
      description: 'Inactive customers with past value',
      size: 1745,
      percentage: 21.2,
      color: '#6B7280',
      avgClv: 38000,
      avgRecency: 125,
      avgFrequency: 12,
      avgMonetary: 1800,
      characteristics: ['Long inactivity', 'Moderate past value', 'Win-back opportunity', 'High churn risk']
    }
  ];

  const segmentTrends = [
    { month: 'Jan', champions: 1205, loyal: 2134, potential: 1756, atRisk: 923, cantLose: 398, hibernating: 1584 },
    { month: 'Feb', champions: 1186, loyal: 2145, potential: 1789, atRisk: 901, cantLose: 376, hibernating: 1603 },
    { month: 'Mar', champions: 1198, loyal: 2167, potential: 1823, atRisk: 889, cantLose: 365, hibernating: 1558 },
    { month: 'Apr', champions: 1223, loyal: 2156, potential: 1812, atRisk: 897, cantLose: 354, hibernating: 1558 },
    { month: 'May', champions: 1241, loyal: 2178, potential: 1834, atRisk: 876, cantLose: 342, hibernating: 1529 },
    { month: 'Jun', champions: 1247, loyal: 2156, potential: 1834, atRisk: 876, cantLose: 342, hibernating: 1745 }
  ];

  const segmentPerformance = segments.map(segment => ({
    segment: segment.name,
    retention: segment.name === 'Champions' ? 98.5 : 
              segment.name === 'Loyal Customers' ? 94.2 :
              segment.name === 'Potential Loyalists' ? 87.8 :
              segment.name === 'At Risk' ? 72.3 :
              segment.name === 'Cannot Lose Them' ? 65.1 : 45.6,
    satisfaction: segment.name === 'Champions' ? 4.8 : 
                 segment.name === 'Loyal Customers' ? 4.5 :
                 segment.name === 'Potential Loyalists' ? 4.2 :
                 segment.name === 'At Risk' ? 3.8 :
                 segment.name === 'Cannot Lose Them' ? 3.5 : 3.1,
    profitability: segment.avgClv / 1000
  }));

  const rfmDistribution = [
    { dimension: 'Recency', score: 85, description: 'Days since last purchase' },
    { dimension: 'Frequency', score: 72, description: 'Number of purchases' },
    { dimension: 'Monetary', score: 78, description: 'Total spending amount' }
  ];

  const behavioralSegments = [
    { name: 'Price Sensitive', size: 2234, percentage: 27.3, color: '#EF4444' },
    { name: 'Brand Loyal', size: 1876, percentage: 22.9, color: '#10B981' },
    { name: 'Convenience Seekers', size: 1543, percentage: 18.8, color: '#3B82F6' },
    { name: 'Quality Focused', size: 1298, percentage: 15.8, color: '#8B5CF6' },
    { name: 'Early Adopters', size: 1249, percentage: 15.2, color: '#F59E0B' }
  ];

  const migrationMatrix = [
    { from: 'Champions', to: 'Loyal Customers', count: 23, percentage: 1.8 },
    { from: 'Loyal Customers', to: 'Potential Loyalists', count: 45, percentage: 2.1 },
    { from: 'Potential Loyalists', to: 'Champions', count: 67, percentage: 3.7 },
    { from: 'At Risk', to: 'Hibernating', count: 89, percentage: 10.2 },
    { from: 'Cannot Lose Them', to: 'At Risk', count: 34, percentage: 9.9 },
    { from: 'Hibernating', to: 'Potential Loyalists', count: 156, percentage: 8.9 }
  ];

  const getSegmentColor = (segmentName: string) => {
    const segment = segments.find(s => s.name === segmentName);
    return segment ? segment.color : '#6B7280';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Customer Segmentation</h1>
          <p className="text-gray-600">Intelligent customer segmentation analysis and insights</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segmentation Method</label>
              <select 
                value={segmentationMethod} 
                onChange={(e) => setSegmentationMethod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="rfm">RFM Analysis</option>
                <option value="behavioral">Behavioral Segmentation</option>
                <option value="demographic">Demographic Segmentation</option>
                <option value="psychographic">Psychographic Segmentation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Focus Segment</label>
              <select 
                value={selectedSegment} 
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Segments</option>
                {segments.map(segment => (
                  <option key={segment.name} value={segment.name}>{segment.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Segment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {segments.map((segment, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-sm p-6 border-l-4 cursor-pointer transition-all ${
                selectedSegment === segment.name ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ borderLeftColor: segment.color }}
              onClick={() => setSelectedSegment(segment.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{segment.name}</h3>
                <Target className="h-4 w-4" style={{ color: segment.color }} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{segment.size.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{segment.percentage}% of customers</p>
              <p className="text-xs text-gray-500 mt-2">{segment.description}</p>
            </div>
          ))}
        </div>

        {/* Segment Distribution and Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="size"
                >
                  {segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Trends (6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={segmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="champions" stroke="#10B981" name="Champions" />
                <Line type="monotone" dataKey="loyal" stroke="#3B82F6" name="Loyal" />
                <Line type="monotone" dataKey="potential" stroke="#8B5CF6" name="Potential" />
                <Line type="monotone" dataKey="atRisk" stroke="#F59E0B" name="At Risk" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segment Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Performance Metrics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Segment</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Size</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Avg CLV</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Retention Rate</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Satisfaction</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Key Characteristics</th>
                </tr>
              </thead>
              <tbody>
                {segments.map((segment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: segment.color }}
                        ></div>
                        <span className="font-medium">{segment.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">{segment.size.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">${segment.avgClv.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        segmentPerformance[index].retention >= 90 ? 'bg-green-100 text-green-800' : 
                        segmentPerformance[index].retention >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {segmentPerformance[index].retention}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="flex items-center justify-center space-x-1">
                        <span>{segmentPerformance[index].satisfaction}</span>
                        <span className="text-yellow-400">★</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {segment.characteristics.slice(0, 2).map((char, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {char}
                          </span>
                        ))}
                        {segment.characteristics.length > 2 && (
                          <span className="text-gray-500 text-xs">+{segment.characteristics.length - 2} more</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RFM Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">RFM Score Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rfmDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dimension" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {rfmDistribution.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.dimension}:</span>
                  <span className="text-gray-600">{item.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Segments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={behavioralSegments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="size"
                >
                  {behavioralSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segment Migration Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Migration Analysis</h3>
          <p className="text-gray-600 mb-4">Movement of customers between segments over the last 3 months</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {migrationMatrix.map((migration, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getSegmentColor(migration.from) }}
                    ></div>
                    <span className="text-sm font-medium">{migration.from}</span>
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getSegmentColor(migration.to) }}
                    ></div>
                    <span className="text-sm font-medium">{migration.to}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{migration.count}</p>
                  <p className="text-sm text-gray-600">customers ({migration.percentage}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSegmentationPage;
