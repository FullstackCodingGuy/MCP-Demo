export interface Customer {
  customer_id: string;
  days_since_last_transaction: number;
  total_transactions: number;
  avg_transaction_amount: number;
  total_amount: number;
  churn_probability: number;
  segment: 'High Value' | 'Growth Potential' | 'At Risk' | 'New Customer';
  risk_level: 'Low' | 'Medium' | 'High';
}

export interface ChurnPredictionRequest {
  customer_id: string;
  days_since_last_transaction: number;
  total_transactions: number;
  avg_transaction_amount: number;
  total_amount: number;
}

export interface ChurnPredictionResponse {
  customer_id: string;
  churn_probability: number;
  risk_category: string;
  confidence: number;
}

export interface FeatureEngineering {
  name: string;
  description: string;
  type: 'numerical' | 'categorical' | 'datetime' | 'derived';
  importance_score?: number;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters: Record<string, any>;
  response_example: Record<string, any>;
}
