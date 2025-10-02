import apiClient from './api.client';
import type {
  Stock,
  StockQueryParams,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

/**
 * Stock API Service
 * Handles all API calls related to stocks
 */
export class StockService {
  /**
   * Get all stocks with optional filtering and pagination
   * GET /api/v1/stocks
   */
  static async getStocks(
    params?: StockQueryParams
  ): Promise<PaginatedResponse<Stock[]>> {
    const response = await apiClient.get<PaginatedResponse<Stock[]>>('/stocks', {
      params,
    });
    return response.data;
  }

  /**
   * Get a single stock by ID
   * GET /api/v1/stocks/:id
   * @param id - Stock ID (can be number or string for large IDs)
   */
  static async getStockById(id: number | string): Promise<ApiResponse<Stock>> {
    const response = await apiClient.get<ApiResponse<Stock>>(`/stocks/${id}`);
    return response.data;
  }

  /**
   * Health check endpoint
   * GET /health (note: this is at root level, not under /api/v1)
   */
  static async healthCheck(): Promise<ApiResponse> {
    // Health endpoint is at root level, not under /api/v1
    const response = await apiClient.get<ApiResponse>('/health', {
      baseURL: apiClient.defaults.baseURL?.replace('/api/v1', ''),
    });
    return response.data;
  }
}

export default StockService;
