/**
 * API Response Types based on swagger.json
 */

// Base Response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Metadata for paginated responses
export interface MetaData {
  limit: number;
  offset: number;
  total: number;
}

// Paginated Response structure
export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T;
  meta: MetaData;
}

// Query parameters for GET /api/v1/stocks
export interface StockQueryParams {
  ticker?: string;
  company?: string;
  brokerage?: string;
  action?: string;
  limit?: number;
  offset?: number;
}
