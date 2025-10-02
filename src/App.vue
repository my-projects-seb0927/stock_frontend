<script setup lang="ts">
import { onMounted } from 'vue';
import { useStockStore } from '@/stores';

// Use the stock store
const stockStore = useStockStore();

// Test store actions on mount
onMounted(async () => {
  console.log('🧪 Testing Pinia Store...');
  console.log('📦 Initial state:', { 
    stocks: stockStore.stocks.length, 
    loading: stockStore.loading,
    filters: stockStore.filters 
  });
  
  // Fetch initial stocks
  await stockStore.fetchStocks();
});

// Test actions
function testFetchStocks() {
  stockStore.fetchStocks();
}

function testFetchWithFilters() {
  stockStore.setFilters({
    limit: 10,
    action: 'target raised by',
  });
}

function testFetchById() {
  stockStore.fetchStockById('1111776413695180801');
}

function testPagination() {
  console.log('Current page:', stockStore.currentPage);
  console.log('Has next page:', stockStore.hasNextPage);
  console.log('Has previous page:', stockStore.hasPreviousPage);
}

function testNextPage() {
  stockStore.nextPage();
}

function testPreviousPage() {
  stockStore.previousPage();
}

function testClearFilters() {
  stockStore.clearFilters();
}

function testSetPageSize(size: number) {
  stockStore.setPageSize(size);
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        🧪 Pinia Store Test Suite
      </h1>

      <!-- Store State Display -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Store State</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 p-4 rounded">
            <div class="text-sm text-gray-600">Stocks Loaded</div>
            <div class="text-2xl font-bold text-blue-600">{{ stockStore.stocks.length }}</div>
          </div>
          <div class="bg-green-50 p-4 rounded">
            <div class="text-sm text-gray-600">Total Stocks</div>
            <div class="text-2xl font-bold text-green-600">{{ stockStore.meta.total }}</div>
          </div>
          <div class="bg-purple-50 p-4 rounded">
            <div class="text-sm text-gray-600">Current Page</div>
            <div class="text-2xl font-bold text-purple-600">{{ stockStore.currentPage }} / {{ stockStore.totalPages }}</div>
          </div>
          <div class="bg-orange-50 p-4 rounded">
            <div class="text-sm text-gray-600">Loading</div>
            <div class="text-2xl font-bold" :class="stockStore.loading ? 'text-orange-600' : 'text-gray-400'">
              {{ stockStore.loading ? '⏳' : '✓' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="stockStore.loading" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
        ⏳ Loading...
      </div>

      <!-- Error State -->
      <div v-if="stockStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        ❌ {{ stockStore.error }}
      </div>

      <!-- Test Controls -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Test Controls</h2>
        
        <!-- Basic Actions -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2">Basic Actions</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              @click="testFetchStocks"
              :disabled="stockStore.loading"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              Fetch Stocks
            </button>
            <button 
              @click="testFetchWithFilters"
              :disabled="stockStore.loading"
              class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 text-sm"
            >
              Fetch with Filters
            </button>
            <button 
              @click="testFetchById"
              :disabled="stockStore.loading"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm"
            >
              Fetch Stock by ID
            </button>
            <button 
              @click="testClearFilters"
              :disabled="stockStore.loading"
              class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2">Pagination</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              @click="testPreviousPage"
              :disabled="stockStore.loading || !stockStore.hasPreviousPage"
              class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 text-sm"
            >
              ← Previous Page
            </button>
            <button 
              @click="testNextPage"
              :disabled="stockStore.loading || !stockStore.hasNextPage"
              class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 text-sm"
            >
              Next Page →
            </button>
            <button 
              @click="testPagination"
              class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm"
            >
              Log Pagination Info
            </button>
          </div>
        </div>

        <!-- Page Size Controls -->
        <div>
          <h3 class="text-sm font-semibold text-gray-600 mb-2">Page Size</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              @click="testSetPageSize(10)"
              :disabled="stockStore.loading"
              class="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:bg-gray-400 text-sm"
            >
              10 per page
            </button>
            <button 
              @click="testSetPageSize(25)"
              :disabled="stockStore.loading"
              class="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:bg-gray-400 text-sm"
            >
              25 per page
            </button>
            <button 
              @click="testSetPageSize(50)"
              :disabled="stockStore.loading"
              class="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:bg-gray-400 text-sm"
            >
              50 per page
            </button>
          </div>
        </div>
      </div>

      <!-- Current Filters Display -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-3">Active Filters</h2>
        <pre class="bg-gray-50 p-4 rounded overflow-x-auto text-sm">{{ JSON.stringify(stockStore.filters, null, 2) }}</pre>
      </div>

      <!-- Stocks List -->
      <div v-if="stockStore.hasStocks" class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-3">
          Stocks ({{ stockStore.stocks.length }} items on page {{ stockStore.currentPage }})
        </h2>
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
              <tr v-for="stock in stockStore.stocks" :key="stock.id">
                <td class="px-4 py-2 text-xs font-mono">{{ stock.id }}</td>
                <td class="px-4 py-2 text-sm font-bold">{{ stock.ticker }}</td>
                <td class="px-4 py-2 text-sm">{{ stock.company }}</td>
                <td class="px-4 py-2 text-sm">{{ stock.brokerage }}</td>
                <td class="px-4 py-2 text-sm">
                  <span 
                    class="px-2 py-1 text-xs rounded font-semibold"
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

      <!-- Current Stock Detail -->
      <div v-if="stockStore.currentStock" class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-3">Current Stock Details</h2>
        <pre class="bg-gray-50 p-4 rounded overflow-x-auto text-sm">{{ JSON.stringify(stockStore.currentStock, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>