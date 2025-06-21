import { Customer } from '@/types';

export function generateSampleData(count: number = 1000): Customer[] {
  // Set a seed for consistent data generation
  const seed = 42;
  let random = (function(seed) {
    let x = Math.sin(seed) * 10000;
    return function() {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  })(seed);

  const data: Customer[] = [];
  const segments: Customer['segment'][] = ['High Value', 'Growth Potential', 'At Risk', 'New Customer'];
  const riskLevels: Customer['risk_level'][] = ['Low', 'Medium', 'High'];

  for (let i = 0; i < count; i++) {
    // Generate exponential-like distribution for days since last transaction
    const daysSinceLastTransaction = Math.floor(-Math.log(random()) * 15);
    
    // Generate Poisson-like distribution for total transactions
    const totalTransactions = Math.max(1, Math.floor(random() * 40 + 10));
    
    // Generate log-normal-like distribution for average transaction amount
    const avgTransactionAmount = Math.exp(random() * 2 + 4) * (0.5 + random());
    
    // Generate normal-like distribution for total amount
    const totalAmount = (random() - 0.5) * 4000 - 1000;
    
    // Generate beta-like distribution for churn probability
    const churnProbability = Math.pow(random(), 2) * Math.pow(1 - random(), 5) * 5;
    
    // Select segment based on weighted random
    const segmentRandom = random();
    let segment: Customer['segment'];
    if (segmentRandom < 0.3) segment = 'High Value';
    else if (segmentRandom < 0.55) segment = 'Growth Potential';
    else if (segmentRandom < 0.8) segment = 'At Risk';
    else segment = 'New Customer';
    
    // Select risk level based on weighted random
    const riskRandom = random();
    let riskLevel: Customer['risk_level'];
    if (riskRandom < 0.6) riskLevel = 'Low';
    else if (riskRandom < 0.9) riskLevel = 'Medium';
    else riskLevel = 'High';

    data.push({
      customer_id: `CUST_${String(i + 1).padStart(6, '0')}`,
      days_since_last_transaction: daysSinceLastTransaction,
      total_transactions: totalTransactions,
      avg_transaction_amount: Math.round(avgTransactionAmount * 100) / 100,
      total_amount: Math.round(totalAmount * 100) / 100,
      churn_probability: Math.min(1, Math.max(0, churnProbability)),
      segment,
      risk_level: riskLevel
    });
  }

  return data;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPercentage(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
}

export function getRiskColor(riskLevel: Customer['risk_level']): string {
  switch (riskLevel) {
    case 'Low':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'High':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getSegmentColor(segment: Customer['segment']): string {
  switch (segment) {
    case 'High Value':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'Growth Potential':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'At Risk':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'New Customer':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getChurnRiskLevel(probability: number): { level: string; color: string } {
  if (probability >= 0.7) {
    return { level: 'High Risk', color: 'text-red-600 bg-red-50 border-red-200' };
  } else if (probability >= 0.4) {
    return { level: 'Medium Risk', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
  } else {
    return { level: 'Low Risk', color: 'text-green-600 bg-green-50 border-green-200' };
  }
}
