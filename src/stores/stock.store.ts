import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StockService } from '@/services';
import type { Stock, StockQueryParams, MetaData } from '@/types';

/**
 * Stock Store
 * Manages stock data, filters, pagination, and loading states
 */
export const useStockStore = defineStore('stocks', () => {
  // State
  const stocks = ref<Stock[]>([]);
  const currentStock = ref<Stock | null>(null);
  const stockHistory = ref<Stock[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Pagination metadata
  const meta = ref<MetaData>({
    limit: 50,
    offset: 0,
    total: 0,
  });

  // Filters
  const filters = ref<StockQueryParams>({
    ticker: undefined,
    company: undefined,
    brokerage: undefined,
    action: undefined,
    rating_from: undefined,
    rating_to: undefined,
    sortBy: undefined,
    sortOrder: undefined,
    limit: 50,
    offset: 0,
  });

  // Getters
  const hasStocks = computed(() => stocks.value.length > 0);
  const totalPages = computed(() => Math.ceil(meta.value.total / meta.value.limit));
  const currentPage = computed(() => Math.floor(meta.value.offset / meta.value.limit) + 1);
  const hasNextPage = computed(() => meta.value.offset + meta.value.limit < meta.value.total);
  const hasPreviousPage = computed(() => meta.value.offset > 0);
  const pageSize = computed(() => filters.value.limit || 50);

  // Actions
  
  /**
   * Fetch stocks with current filters and pagination
   */
  const fetchStocks = async (params?: StockQueryParams) => {
    try {
      loading.value = true;
      error.value = null;

      // Merge params with current filters
      const queryParams = { ...filters.value, ...params };
      
      const response = await StockService.getStocks(queryParams);
      
      stocks.value = response.data;
      meta.value = response.meta;
      
      // Update filters to reflect what was actually used
      filters.value = {
        ...filters.value,
        limit: response.meta.limit,
        offset: response.meta.offset,
      };
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch stocks';
      console.error('❌ Error fetching stocks:', err);
      stocks.value = [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch a single stock by ID
   */
  const fetchStockById = async (id: number | string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await StockService.getStockById(id);
      currentStock.value = response.data || null;

    } catch (err: any) {
      error.value = err.message || `Failed to fetch stock #${id}`;
      console.error('Error fetching stock:', err);
      currentStock.value = null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch all historical records for a specific ticker
   */
  const fetchStockHistory = async (ticker: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await StockService.getStockHistory(ticker);
      stockHistory.value = response.data || [];
    } catch (err: any) {
      error.value = err.message || `Failed to fetch history for ${ticker}`;
      console.error('Error fetching stock history:', err);
      stockHistory.value = [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update filters and fetch stocks
   */
  const setFilters = async (newFilters: Partial<StockQueryParams>) => {
    filters.value = {
      ...filters.value,
      ...newFilters,
      offset: 0, // Reset to first page when filters change
    };
    await fetchStocks();
  };

  /**
   * Clear all filters and fetch stocks
   */
  const clearFilters = async () => {
    filters.value = {
      ticker: undefined,
      company: undefined,
      brokerage: undefined,
      action: undefined,
      rating_from: undefined,
      rating_to: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      limit: 50,
      offset: 0,
    };
    await fetchStocks();
  };

  /**
   * Go to next page
   */
  const nextPage = async () => {
    if (hasNextPage.value) {
      filters.value.offset = (filters.value.offset || 0) + (filters.value.limit || 50);
      await fetchStocks();
    }
  };

  /**
   * Go to previous page
   */
  const previousPage = async () => {
    if (hasPreviousPage.value) {
      filters.value.offset = Math.max(0, (filters.value.offset || 0) - (filters.value.limit || 50));
      await fetchStocks();
    }
  };

  /**
   * Go to specific page
   */
  const goToPage = async (page: number) => {
    const newOffset = (page - 1) * (filters.value.limit || 50);
    if (newOffset >= 0 && newOffset < meta.value.total) {
      filters.value.offset = newOffset;
      await fetchStocks();
    }
  };

  /**
   * Change page size
   */
  const setPageSize = async (size: number) => {
    filters.value.limit = size;
    filters.value.offset = 0; // Reset to first page
    await fetchStocks();
  };

  /**
   * Set sorting parameters and fetch stocks from API
   */
  const setSorting = async (sortBy: string, sortOrder: 'asc' | 'desc') => {
    filters.value.sortBy = sortBy;
    filters.value.sortOrder = sortOrder;
    filters.value.offset = 0; // Reset to first page when sorting changes
    await fetchStocks();
  };

  /**
   * Refresh stocks with current filters
   */
  const refresh = async () => {
    await fetchStocks();
  };

  /**
   * Reset store state
   */
  const reset = () => {
    stocks.value = [];
    currentStock.value = null;
    loading.value = false;
    error.value = null;
    meta.value = { limit: 50, offset: 0, total: 0 };
    filters.value = {
      ticker: undefined,
      company: undefined,
      brokerage: undefined,
      action: undefined,
      rating_from: undefined,
      rating_to: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      limit: 50,
      offset: 0,
    };
  };

  return {
    // State
    stocks,
    currentStock,
    stockHistory,
    loading,
    error,
    meta,
    filters,
    
    // Getters
    hasStocks,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    pageSize,
    
    // Actions
    fetchStocks,
    fetchStockById,
    fetchStockHistory,
    setFilters,
    clearFilters,
    nextPage,
    previousPage,
    goToPage,
    setPageSize,
    setSorting,
    refresh,
    reset,
  };
});
