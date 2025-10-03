<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStockStore } from '@/stores';
import { FilterPanel, Pagination } from '@/components';
import type { StockQueryParams } from '@/types';

const stockStore = useStockStore();

const sortField = ref<'ticker' | 'company' | 'brokerage' | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

onMounted(() => {
  stockStore.fetchStocks();
});

const handleFilterApply = async (filters: StockQueryParams) => {
  stockStore.setFilters(filters);
  await stockStore.fetchStocks();
};

const handleFilterClear = async () => {
  stockStore.setFilters({});
  await stockStore.fetchStocks();
};

const handleSort = (field: 'ticker' | 'company' | 'brokerage') => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  
  stockStore.sortStocks(field, sortDirection.value);
};

const getSortIcon = (field: string) => {
  if (sortField.value !== field) return '';
  return sortDirection.value === 'asc' ? '↑' : '↓';
};

const handlePageChange = async (page: number) => {
  await stockStore.goToPage(page);
};

const handlePageSizeChange = async (size: number) => {
  await stockStore.setPageSize(size);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Stock Analysis Dashboard</h1>

      <!-- Filter Panel -->
      <FilterPanel
        :filters="stockStore.filters"
        @apply="handleFilterApply"
        @clear="handleFilterClear"
      />

      <!-- Loading State -->
      <div v-if="stockStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading stocks...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="stockStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ stockStore.error }}</p>
      </div>

      <!-- Stock List -->
      <div v-else-if="stockStore.hasStocks">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th 
                  @click="handleSort('ticker')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div class="flex items-center gap-2">
                    Ticker
                    <span>{{ getSortIcon('ticker') }}</span>
                  </div>
                </th>
                <th 
                  @click="handleSort('company')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div class="flex items-center gap-2">
                    Company
                    <span>{{ getSortIcon('company') }}</span>
                  </div>
                </th>
                <th 
                  @click="handleSort('brokerage')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div class="flex items-center gap-2">
                    Brokerage
                    <span>{{ getSortIcon('brokerage') }}</span>
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="stock in stockStore.stocks" :key="stock.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900">{{ stock.ticker }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ stock.company }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="stock.brokerage" class="text-sm text-gray-500">{{ stock.brokerage }}</div>
                  <div v-else class="text-sm text-gray-400 italic">No brokerage available</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': stock.rating_to && ['overweight', 'buy', 'outperform', 'strong-buy', 'market outperform'].includes(stock.rating_to.toLowerCase()),
                      'bg-blue-100 text-blue-800': stock.rating_to && ['hold', 'neutral', 'in-line', 'market perform', 'equal weight'].includes(stock.rating_to.toLowerCase()),
                      'bg-red-100 text-red-800': stock.rating_to && ['underweight', 'underperform'].includes(stock.rating_to.toLowerCase()),
                      'bg-gray-100 text-gray-800': !stock.rating_to
                    }"
                  >
                    {{ stock.rating_to || 'N/A' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">{{ stock.target_to || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link 
                    :to="{ name: 'stock-detail', params: { id: stock.id } }"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    View Details →
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Component -->
        <div class="mt-6">
          <Pagination
            :current-page="stockStore.currentPage"
            :total-pages="stockStore.totalPages"
            :total-items="stockStore.meta.total"
            :items-per-page="stockStore.pageSize"
            :has-next-page="stockStore.hasNextPage"
            :has-previous-page="stockStore.hasPreviousPage"
            @next="stockStore.nextPage"
            @previous="stockStore.previousPage"
            @go-to-page="handlePageChange"
            @change-page-size="handlePageSizeChange"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-lg shadow">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-4 text-lg text-gray-500">No stocks found</p>
        <p class="mt-2 text-sm text-gray-400">Try adjusting your search or filter criteria</p>
      </div>
    </div>
  </div>
</template>
