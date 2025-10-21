import apiClient from './api.client';
import type {
  Stock,
  StockQueryParams,
  ApiResponse,
  PaginatedResponse,
  Recommendation,
  Rating,
  Action,
  Brokerage,
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
   * Get all historical records for a specific ticker
   * GET /api/v1/stock/:ticker
   * @param ticker - Stock ticker symbol (e.g., AAPL, GOOGL)
   */
  static async getStockHistory(ticker: string): Promise<ApiResponse<Stock[]>> {
    const response = await apiClient.get<ApiResponse<Stock[]>>(`/stock/${ticker}`);
    return response.data;
  }

  /**
   * Get stock recommendations based on AI algorithm
   * GET /api/v1/recommendations
   * @param limit - Number of recommendations to return (default: 10)
   */
  static async getRecommendations(limit: number = 10): Promise<ApiResponse<Recommendation[]>> {
    const response = await apiClient.get<ApiResponse<Recommendation[]>>('/recommendations', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get all ratings
   * GET /api/v1/ratings
   */
  static async getRatings(): Promise<ApiResponse<Rating[]>> {
    const response = await apiClient.get<ApiResponse<Rating[]>>('/ratings');
    return response.data;
  }

  /**
   * Get all actions
   * GET /api/v1/actions
   */
  static async getActions(): Promise<ApiResponse<Action[]>> {
    const response = await apiClient.get<ApiResponse<Action[]>>('/actions');
    return response.data;
  }

  /**
   * Get all brokerages
   * GET /api/v1/brokerages
   */
  static async getBrokerages(): Promise<ApiResponse<Brokerage[]>> {
    const response = await apiClient.get<ApiResponse<Brokerage[]>>('/brokerages');
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
