/**
 * Stock entity types
 * Note: The swagger doesn't define the exact Stock schema,
 * so we'll create a flexible structure based on common stock data
 */

export interface Stock {
  id: number | string; // Support both number and string for large IDs
  ticker: string;
  company: string;
  brokerage: string;
  action: string;
  price?: number;
  target_price?: number;
  date?: string;
  updated_at?: string;
  created_at?: string;
  // Additional fields can be added based on actual API response
  [key: string]: any;
}

export type StockAction = 'buy' | 'sell' | 'hold' | string;

export interface StockFilters {
  ticker?: string;
  company?: string;
  brokerage?: string;
  action?: string;
}

export interface StockSort {
  field: keyof Stock;
  order: 'asc' | 'desc';
}
