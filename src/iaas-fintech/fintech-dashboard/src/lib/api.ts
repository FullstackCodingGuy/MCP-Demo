import axios from 'axios';
import { Customer, ChurnPredictionRequest, ChurnPredictionResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const apiClient = {
  // Customer endpoints
  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async getCustomer(customerId: string): Promise<Customer> {
    try {
      const response = await api.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      throw error;
    }
  },

  // Churn prediction endpoints
  async predictChurn(data: ChurnPredictionRequest): Promise<ChurnPredictionResponse> {
    try {
      const response = await api.post('/predict/churn', data);
      return response.data;
    } catch (error) {
      console.error('Error predicting churn:', error);
      throw error;
    }
  },

  async batchPredictChurn(customers: ChurnPredictionRequest[]): Promise<ChurnPredictionResponse[]> {
    try {
      const response = await api.post('/predict/churn/batch', { customers });
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
  }
};

export default api;
