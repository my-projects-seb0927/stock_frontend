<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { StockService } from '@/services';
import type { Stock, PaginatedResponse } from '@/types';

// State
const loading = ref(false);
const error = ref<string | null>(null);
const stocks = ref<Stock[]>([]);
const healthStatus = ref<any>(null);
const singleStock = ref<Stock | null>(null);

// Test 1: Health Check
const testHealthCheck = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await StockService.healthCheck();
    healthStatus.value = response;
    console.log('✅ Health Check:', response);
  } catch (err: any) {
    error.value = `Health check failed: ${err.message}`;
    console.error('❌ Health Check Error:', err);
  } finally {
    loading.value = false;
  }
};

// Test 2: Get All Stocks (with pagination)
const testGetStocks = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response: PaginatedResponse<Stock[]> = await StockService.getStocks({
      limit: 10,
      offset: 0,
    });
    stocks.value = response.data;
    console.log('✅ Get Stocks:', response);
    console.log('📊 Total stocks:', response.meta.total);
    console.log('📄 Stocks on this page:', response.data.length);
  } catch (err: any) {
    error.value = `Failed to fetch stocks: ${err.message}`;
    console.error('❌ Get Stocks Error:', err);
  } finally {
    loading.value = false;
  }
};

// Test 3: Get Single Stock by ID
const testGetStockById = async (id: number | string) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await StockService.getStockById(id);
    singleStock.value = response.data || null;
    console.log('✅ Get Stock by ID:', response);
  } catch (err: any) {
    error.value = `Failed to fetch stock #${id}: ${err.message}`;
    console.error('❌ Get Stock by ID Error:', err);
  } finally {
    loading.value = false;
  }
};

// Test 4: Get Stocks with Filters
const testGetStocksWithFilters = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response: PaginatedResponse<Stock[]> = await StockService.getStocks({
      limit: 5,
      offset: 0,
      // Uncomment these to test filters:
      // ticker: 'AAPL',
      // action: 'buy',
    });
    stocks.value = response.data;
    console.log('✅ Get Stocks with Filters:', response);
  } catch (err: any) {
    error.value = `Failed to fetch filtered stocks: ${err.message}`;
    console.error('❌ Get Stocks with Filters Error:', err);
  } finally {
    loading.value = false;
  }
};

// Auto-run tests on mount
onMounted(async () => {
  console.log('🧪 Starting API Service Tests...');
  await testHealthCheck();
  await testGetStocks();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        🧪 API Service Test Suite
      </h1>

      <!-- Loading State -->
      <div v-if="loading" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
        ⏳ Loading...
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        ❌ {{ error }}
      </div>

      <!-- Test Buttons -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Test Controls</h2>
        <div class="flex flex-wrap gap-3">
          <button 
            @click="testHealthCheck"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Test Health Check
          </button>
          <button 
            @click="testGetStocks"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Test Get Stocks
          </button>
          <button 
            @click="testGetStockById('1111776413695180801')"
            :disabled="loading"
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            Test Get Stock by ID
          </button>
          <button 
            @click="testGetStocksWithFilters"
            :disabled="loading"
            class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
          >
            Test Filters
          </button>
        </div>
      </div>

      <!-- Health Status -->
      <div v-if="healthStatus" class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-3">Health Check Response</h2>
        <pre class="bg-gray-50 p-4 rounded overflow-x-auto">{{ JSON.stringify(healthStatus, null, 2) }}</pre>
      </div>

      <!-- Stocks List -->
      <div v-if="stocks.length > 0" class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-3">Stocks ({{ stocks.length }} items)</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ticker</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Brokerage</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="stock in stocks" :key="stock.id">
                <td class="px-4 py-2 text-sm">{{ stock.id }}</td>
                <td class="px-4 py-2 text-sm font-medium">{{ stock.ticker }}</td>
                <td class="px-4 py-2 text-sm">{{ stock.company }}</td>
                <td class="px-4 py-2 text-sm">{{ stock.brokerage }}</td>
                <td class="px-4 py-2 text-sm">
                  <span 
                    class="px-2 py-1 text-xs rounded"
                    :class="{
                      'bg-green-100 text-green-800': stock.action === 'buy',
                      'bg-red-100 text-red-800': stock.action === 'sell',
                      'bg-gray-100 text-gray-800': stock.action === 'hold'
                    }"
                  >
                    {{ stock.action }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Single Stock -->
      <div v-if="singleStock" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-3">Single Stock Details</h2>
        <pre class="bg-gray-50 p-4 rounded overflow-x-auto">{{ JSON.stringify(singleStock, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>