'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, Activity, DollarSign, Users, AlertTriangle, Filter } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';
import { apiClient } from '@/lib/api';

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
    fraud_count?: number;
  }>;
  category_breakdown: Array<{
    category: string;
    total_amount: number;
    transaction_count: number;
    avg_amount?: number;
  }>;
  hourly_patterns?: Array<{
    hour: number;
    transaction_count: number;
    avg_amount: number;
  }>;
  merchant_analysis?: Array<{
    merchant: string;
    transaction_count: number;
    total_amount: number;
    unique_customers: number;
  }>;
}

export default function TransactionAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<TransactionAnalytics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    loadTransactionAnalytics();
  }, [selectedPeriod]);

  const loadTransactionAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const analyticsData = await apiClient.getTransactionAnalytics(selectedPeriod);
      
      // Handle different API response formats
      if (analyticsData && typeof analyticsData === 'object') {
        setAnalytics(analyticsData);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Error loading transaction analytics:', err);
      setError('Failed to load transaction analytics from API. Using fallback data.');
      
      // Fallback to sample data if API fails
      const mockAnalytics: TransactionAnalytics = {
        summary: {
          total_transactions: 147890,
          total_volume: 4875420.50,
          avg_transaction_amount: 329.75,
          fraud_rate: 0.0012,
          unique_customers: 8943
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
    } finally {
      setLoading(false);
    }
  };

  const generateDailyTrends = (days: number) => {
    const trends = [];
    const baseDate = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      let baseCount = isWeekend ? 3000 : 5000;
      baseCount += Math.floor(Math.random() * 1000);
      
      const avgAmount = 280 + Math.random() * 100;
      const fraudCount = Math.floor(baseCount * (0.001 + Math.random() * 0.003));
      
      trends.push({
        date: date.toISOString().split('T')[0],
        total_amount: baseCount * avgAmount,
        transaction_count: baseCount,
        fraud_count: fraudCount
      });
    }
    
    return trends;
  };

  const generateHourlyPatterns = () => {
    const patterns = [];
    
    for (let hour = 0; hour < 24; hour++) {
      let baseCount = 200;
      
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

  if (error && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="text-red-600 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error Loading Transaction Analytics</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <button
              onClick={loadTransactionAnalytics}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction Analytics</h1>
            <p className="text-gray-600 mt-1">Real-time insights into transaction patterns and trends</p>
            {error && (
              <p className="text-yellow-600 text-sm mt-1">⚠️ Using fallback data</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={loadTransactionAnalytics}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.summary.total_transactions)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.summary.total_volume)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Transaction</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.summary.avg_transaction_amount)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fraud Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.summary.fraud_rate)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Customers</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.summary.unique_customers)}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Transaction Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={analytics.daily_trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="transaction_count" fill="#3B82F6" />
                <Line yAxisId="right" type="monotone" dataKey="total_amount" stroke="#10B981" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.category_breakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_amount" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hourly Patterns */}
          {analytics.hourly_patterns && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Transaction Patterns</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.hourly_patterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="transaction_count" stroke="#F59E0B" fill="#FEF3C7" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Merchants */}
          {analytics.merchant_analysis && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Merchants</h3>
              <div className="space-y-4">
                {analytics.merchant_analysis.slice(0, 5).map((merchant, index) => (
                  <div key={merchant.merchant} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{merchant.merchant}</p>
                        <p className="text-sm text-gray-600">{formatNumber(merchant.unique_customers)} customers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(merchant.total_amount)}</p>
                      <p className="text-sm text-gray-600">{formatNumber(merchant.transaction_count)} transactions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
