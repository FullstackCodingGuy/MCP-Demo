'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, Activity, DollarSign, Users, AlertTriangle, Filter } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

interface TransactionAnalytics {
  summary: {
    total_transactions: number;
    total_volume: number;
    avg_transaction_amount: number;
    fraud_rate: number;
    unique_customers: number;
  };
  daily_trends: Array<{
    date: string;
    total_amount: number;
    transaction_count: number;
    fraud_count: number;
  }>;
  category_breakdown: Array<{
    category: string;
    total_amount: number;
    transaction_count: number;
    avg_amount: number;
  }>;
  hourly_patterns: Array<{
    hour: number;
    transaction_count: number;
    avg_amount: number;
  }>;
  merchant_analysis: Array<{
    merchant: string;
    transaction_count: number;
    total_amount: number;
    unique_customers: number;
  }>;
}

export default function TransactionAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<TransactionAnalytics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadTransactionAnalytics();
  }, [selectedPeriod]);

  const loadTransactionAnalytics = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate comprehensive sample data
    const mockAnalytics: TransactionAnalytics = {
      summary: {
        total_transactions: 147890 + Math.floor(Math.random() * 10000),
        total_volume: 4875420.50 + Math.random() * 100000,
        avg_transaction_amount: 329.75 + Math.random() * 50,
        fraud_rate: 0.12 + Math.random() * 0.08,
        unique_customers: 8943 + Math.floor(Math.random() * 1000)
      },
      daily_trends: generateDailyTrends(selectedPeriod),
      category_breakdown: [
        { category: 'Grocery', total_amount: 1250000, transaction_count: 45000, avg_amount: 27.78 },
        { category: 'Gas & Fuel', total_amount: 890000, transaction_count: 28000, avg_amount: 31.79 },
        { category: 'Restaurants', total_amount: 750000, transaction_count: 35000, avg_amount: 21.43 },
        { category: 'Shopping', total_amount: 1120000, transaction_count: 22000, avg_amount: 50.91 },
        { category: 'Entertainment', total_amount: 420000, transaction_count: 15000, avg_amount: 28.00 },
        { category: 'Healthcare', total_amount: 680000, transaction_count: 12000, avg_amount: 56.67 },
        { category: 'Travel', total_amount: 950000, transaction_count: 8000, avg_amount: 118.75 },
        { category: 'Utilities', total_amount: 380000, transaction_count: 18000, avg_amount: 21.11 }
      ],
      hourly_patterns: generateHourlyPatterns(),
      merchant_analysis: [
        { merchant: 'Amazon', transaction_count: 15400, total_amount: 892000, unique_customers: 3200 },
        { merchant: 'Walmart', transaction_count: 12800, total_amount: 456000, unique_customers: 4100 },
        { merchant: 'Starbucks', transaction_count: 8900, total_amount: 67000, unique_customers: 2800 },
        { merchant: 'Shell', transaction_count: 7600, total_amount: 245000, unique_customers: 2100 },
        { merchant: 'Target', transaction_count: 6800, total_amount: 378000, unique_customers: 1900 }
      ]
    };
    
    setAnalytics(mockAnalytics);
    setLoading(false);
  };

  const generateDailyTrends = (days: number) => {
    const trends = [];
    const baseDate = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Weekend patterns - less transactions but similar amounts
      const baseTransactions = isWeekend ? 4000 : 6000;
      const baseAmount = isWeekend ? 180000 : 220000;
      
      trends.push({
        date: date.toISOString().split('T')[0],
        total_amount: baseAmount + (Math.random() - 0.5) * 40000,
        transaction_count: baseTransactions + Math.floor((Math.random() - 0.5) * 1000),
        fraud_count: Math.floor(Math.random() * 20)
      });
    }
    
    return trends;
  };

  const generateHourlyPatterns = () => {
    const patterns = [];
    
    for (let hour = 0; hour < 24; hour++) {
      let baseCount = 200;
      
      // Business hours pattern
      if (hour >= 9 && hour <= 17) {
        baseCount = 800;
      } else if (hour >= 18 && hour <= 21) {
        baseCount = 600;
      } else if (hour >= 6 && hour <= 8) {
        baseCount = 400;
      } else {
        baseCount = 100;
      }
      
      patterns.push({
        hour,
        transaction_count: baseCount + Math.floor(Math.random() * 200),
        avg_amount: 25 + Math.random() * 50
      });
    }
    
    return patterns;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Unable to load transaction analytics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📈 Transaction Analytics</h1>
          <p className="text-gray-600">Deep dive into transaction patterns and trends</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Period</label>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={60}>Last 60 days</option>
                <option value={90}>Last 90 days</option>
                <option value={180}>Last 180 days</option>
                <option value={365}>Last year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Filter</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="grocery">Grocery</option>
                <option value="gas">Gas & Fuel</option>
                <option value="restaurants">Restaurants</option>
                <option value="shopping">Shopping</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.summary.total_transactions)}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.summary.total_volume)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Transaction</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.summary.avg_transaction_amount)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fraud Rate</p>
                <p className="text-2xl font-bold text-red-600">{formatPercentage(analytics.summary.fraud_rate / 100)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Customers</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.summary.unique_customers)}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Daily Trends Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Daily Transaction Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analytics.daily_trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                  formatter={(value: any, name: string) => {
                    if (name === 'total_amount') return [formatCurrency(value), 'Volume'];
                    if (name === 'transaction_count') return [formatNumber(value), 'Count'];
                    if (name === 'fraud_count') return [formatNumber(value), 'Fraud Alerts'];
                    return [value, name];
                  }}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="total_amount" 
                  fill="#3B82F6" 
                  fillOpacity={0.1}
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="transaction_count" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="fraud_count" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown and Hourly Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🛍️ Category Breakdown</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.category_breakdown} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="total_amount" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Patterns */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🕐 Hourly Transaction Patterns</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.hourly_patterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}:00`}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => `${value}:00`}
                    formatter={(value: any, name: string) => {
                      if (name === 'transaction_count') return [formatNumber(value), 'Transactions'];
                      if (name === 'avg_amount') return [formatCurrency(value), 'Avg Amount'];
                      return [value, name];
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="transaction_count" 
                    fill="#F59E0B" 
                    fillOpacity={0.3}
                    stroke="#F59E0B" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Merchants Table */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏪 Top Merchants by Volume</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unique Customers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg per Customer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.merchant_analysis.map((merchant, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {merchant.merchant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatNumber(merchant.transaction_count)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(merchant.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatNumber(merchant.unique_customers)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(merchant.total_amount / merchant.unique_customers)}
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
}
