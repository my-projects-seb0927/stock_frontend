<script setup lang="ts">
import { onMounted } from 'vue';
import { useStockStore } from '@/stores';

const stockStore = useStockStore();

onMounted(() => {
  // Fetch stocks when component mounts
  stockStore.fetchStocks();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Stock List</h1>

      <!-- Loading State -->
      <div v-if="stockStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading stocks...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="stockStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ stockStore.error }}</p>
      </div>

      <!-- Stock List -->
      <div v-else-if="stockStore.hasStocks">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brokerage</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                  <div class="text-sm text-gray-500">{{ stock.brokerage }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': stock.action?.toLowerCase().includes('raised') || stock.action?.toLowerCase().includes('initiated') || stock.action?.toLowerCase().includes('upgraded'),
                      'bg-red-100 text-red-800': stock.action?.toLowerCase().includes('lowered') || stock.action?.toLowerCase().includes('downgraded'),
                      'bg-blue-100 text-blue-800': stock.action?.toLowerCase().includes('reiterated') || stock.action?.toLowerCase().includes('set'),
                      'bg-gray-100 text-gray-800': !stock.action
                    }"
                  >
                    {{ stock.action }}
                  </span>
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

        <!-- Pagination -->
        <div class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ stockStore.stocks.length }}</span> of 
            <span class="font-medium">{{ stockStore.meta.total }}</span> stocks
            (Page {{ stockStore.currentPage }} of {{ stockStore.totalPages }})
          </div>
          <div class="flex gap-2">
            <button
              @click="stockStore.previousPage"
              :disabled="!stockStore.hasPreviousPage"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              @click="stockStore.nextPage"
              :disabled="!stockStore.hasNextPage"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500">No stocks found</p>
      </div>
    </div>
  </div>
</template>
