/**
 * Stock entity types based on actual API response
 */

export interface Stock {
  id: string;
  ticker: string;
  target_from: string;
  target_to: string;
  company: string;
  action: string;
  brokerage: string;
  rating_from: string;
  rating_to: string;
  time: string;
  created_at: string;
}

export interface StockFilters {
  ticker?: string;
  company?: string;
  brokerage?: string;
  action?: string;
  rating_to?: string;
}

export interface StockSort {
  field: keyof Stock;
  order: 'asc' | 'desc';
}

/**
 * Stock Recommendation from scoring algorithm
 */
export interface Recommendation {
  stock: Stock;
  score: number;
  reason: string;
  target_increase_percent: number;
}
