import axios from 'axios';
import { Customer, ChurnPredictionRequest, ChurnPredictionResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status_code?: number;
  response_time?: number;
}

export interface CustomerAnalytics {
  demographics: {
    total_customers: number;
    age_distribution: {
      min: number;
      '25%': number;
      '50%': number;
      '75%': number;
      max: number;
    };
    account_type_distribution: Record<string, number>;
    location_distribution: Record<string, number>;
    credit_score_distribution: Record<string, number>;
  };
  transactions: {
    total_transactions: number;
    total_volume: number;
    fraud_rate: number;
  };
}

export interface TransactionAnalytics {
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
  }>;
  category_breakdown: Array<{
    category: string;
    total_amount: number;
    transaction_count: number;
  }>;
}

export const apiClient = {
  // Health check
  async healthCheck(): Promise<ApiResponse> {
    try {
      const startTime = Date.now();
      const response = await api.get('/health');
      const responseTime = Date.now() - startTime;
      return {
        data: response.data,
        status_code: response.status,
        response_time: responseTime,
      };
    } catch (error: any) {
      console.error('Health check failed:', error);
      return {
        error: error.message || 'Health check failed',
        status_code: error.response?.status,
      };
    }
  },

  // Customer endpoints - Enhanced to match Python dashboard
  async getCustomers(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    age_min?: number;
    age_max?: number;
    location?: string;
  }): Promise<Customer[]> {
    try {
      const response = await api.get('/api/v1/customers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async getCustomer(customerId: string): Promise<Customer> {
    try {
      const response = await api.get(`/api/v1/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      throw error;
    }
  },

  async getCustomerTransactions(
    customerId: string,
    params?: {
      page?: number;
      page_size?: number;
      start_date?: string;
      end_date?: string;
    }
  ): Promise<any[]> {
    try {
      const response = await api.get(`/api/v1/customers/${customerId}/transactions`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching transactions for customer ${customerId}:`, error);
      throw error;
    }
  },

  // Analytics endpoints
  async getCustomerAnalytics(): Promise<CustomerAnalytics> {
    try {
      const response = await api.get('/api/v1/analytics/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  },

  async getTransactionAnalytics(days: number = 30): Promise<TransactionAnalytics> {
    try {
      const response = await api.get('/api/v1/analytics/transactions', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction analytics:', error);
      throw error;
    }
  },

  // Churn prediction endpoints
  async predictChurn(data: ChurnPredictionRequest): Promise<ChurnPredictionResponse> {
    try {
      const response = await api.post('/api/v1/inference/churn-score', data);
      return response.data;
    } catch (error) {
      console.error('Error predicting churn:', error);
      throw error;
    }
  },

  async batchPredictChurn(customers: ChurnPredictionRequest[]): Promise<ChurnPredictionResponse[]> {
    try {
      const response = await api.post('/api/v1/inference/churn-score/batch', { customers });
      return response.data;
    } catch (error) {
      console.error('Error batch predicting churn:', error);
      throw error;
    }
  },

  // Health check
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  },

  // Statistics
  async getStats(): Promise<any> {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Fraud detection endpoints
  async detectFraud(transactionData: {
    customer_id: string;
    amount: number;
    merchant: string;
    location: string;
    timestamp: string;
    [key: string]: any;
  }): Promise<any> {
    try {
      const response = await api.post('/api/v1/inference/fraud-score', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error detecting fraud:', error);
      throw error;
    }
  },

  // Feature engineering endpoints
  async getFeatureImportance(): Promise<any> {
    try {
      const response = await api.get('/api/v1/features/importance');
      return response.data;
    } catch (error) {
      console.error('Error fetching feature importance:', error);
      throw error;
    }
  },

  async getFeatureCorrelations(): Promise<any> {
    try {
      const response = await api.get('/api/v1/features/correlations');
      return response.data;
    } catch (error) {
      console.error('Error fetching feature correlations:', error);
      throw error;
    }
  },

  // Model management endpoints
  async getModelMetrics(): Promise<any> {
    try {
      const response = await api.get('/api/v1/models/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching model metrics:', error);
      throw error;
    }
  },

  async getModelStatus(): Promise<any> {
    try {
      const response = await api.get('/api/v1/models/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching model status:', error);
      throw error;
    }
  },

  // API endpoint testing - matches Python dashboard functionality
  async testEndpoint(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    data?: any
  ): Promise<ApiResponse> {
    try {
      const startTime = Date.now();
      let response;
      
      if (method === 'GET') {
        response = await api.get(endpoint);
      } else {
        response = await api.post(endpoint, data);
      }
      
      const responseTime = Date.now() - startTime;
      return {
        data: response.data,
        status_code: response.status,
        response_time: responseTime,
      };
    } catch (error: any) {
      const responseTime = Date.now() - Date.now();
      return {
        error: error.message || 'Request failed',
        status_code: error.response?.status,
        response_time: responseTime,
      };
    }
  }
};

export default api;
