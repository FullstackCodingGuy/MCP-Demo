'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency, formatNumber, formatPercentage, getRiskColor, getSegmentColor } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import { Customer } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle, Activity } from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
}

export default function OverviewPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const customerData = await apiClient.getCustomers();
      
      // Ensure we always set an array, handle different API response formats
      if (Array.isArray(customerData)) {
        setCustomers(customerData);
      } else if (customerData && typeof customerData === 'object') {
        // Handle case where API returns { data: [...] } or { customers: [...] }
        const data = customerData as any;
        if (Array.isArray(data.data)) {
          setCustomers(data.data);
        } else if (Array.isArray(data.customers)) {
          setCustomers(data.customers);
        } else {
          console.warn('Unexpected API response format:', customerData);
          setCustomers([]);
          setError('Received unexpected data format from API.');
        }
      } else {
        console.warn('Unexpected API response format:', customerData);
        setCustomers([]);
        setError('Received unexpected data format from API.');
      }
    } catch (err) {
      console.error('Error loading customers:', err);
      setError('Failed to load customer data. Please try again.');
      setCustomers([]); // Ensure customers is always an array
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Error Loading Data</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
        <button
          onClick={loadCustomers}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Ensure customers is always an array and has valid data
  const validCustomers = Array.isArray(customers) ? customers : [];
  
  // Calculate metrics
  const totalCustomers = validCustomers.length;
  const totalRevenue = validCustomers.reduce((sum, c) => sum + (c.total_amount || 0), 0);
  const averageChurnProbability = validCustomers.length > 0 
    ? validCustomers.reduce((sum, c) => sum + (c.churn_probability || 0), 0) / validCustomers.length 
    : 0;
  const highRiskCustomers = validCustomers.filter(c => (c.churn_probability || 0) > 0.7).length;

  const metrics: MetricCard[] = [
    {
      title: 'Total Customers',
      value: formatNumber(totalCustomers),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Avg Churn Risk',
      value: formatPercentage(averageChurnProbability),
      change: '-2.1%',
      trend: 'down',
      icon: Activity,
      color: 'yellow'
    },
    {
      title: 'High Risk Customers',
      value: formatNumber(highRiskCustomers),
      change: '+5.3%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  // Prepare chart data
  const segmentData = validCustomers.reduce((acc, customer) => {
    const segment = customer.segment || 'Unknown';
    acc[segment] = (acc[segment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const segmentChartData = Object.entries(segmentData).map(([name, value]) => ({
    name,
    value,
    percentage: totalCustomers > 0 ? (value / totalCustomers * 100).toFixed(1) : '0'
  }));

  const riskData = validCustomers.reduce((acc, customer) => {
    const riskLevel = customer.risk_level || 'Unknown';
    acc[riskLevel] = (acc[riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskChartData = Object.entries(riskData).map(([name, value]) => ({
    name,
    value
  }));

  // Monthly trend data (simulated)
  const monthlyTrend = [
    { month: 'Jan', customers: 850, revenue: -180000 },
    { month: 'Feb', customers: 920, revenue: -165000 },
    { month: 'Mar', customers: 980, revenue: -155000 },
    { month: 'Apr', customers: 1000, revenue: -148000 },
    { month: 'May', customers: 1050, revenue: -142000 },
    { month: 'Jun', customers: 1000, revenue: -138000 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Executive Dashboard</h1>
        <p className="text-gray-600">Key metrics and insights for your fintech platform</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  metric.color === 'blue' ? 'bg-blue-50' :
                  metric.color === 'green' ? 'bg-green-50' :
                  metric.color === 'yellow' ? 'bg-yellow-50' :
                  'bg-red-50'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'yellow' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Segments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {segmentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="customers" stroke="#8884d8" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">High Risk Customers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Churn Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Transaction
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers
                .filter(c => c.churn_probability > 0.6)
                .slice(0, 10)
                .map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.customer_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSegmentColor(customer.segment)}`}>
                        {customer.segment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-red-600">
                        {formatPercentage(customer.churn_probability)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(customer.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.days_since_last_transaction} days ago
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
