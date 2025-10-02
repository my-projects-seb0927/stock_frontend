<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStockStore } from '@/stores';

const route = useRoute();
const router = useRouter();
const stockStore = useStockStore();

const stockId = computed(() => route.params.id as string);

onMounted(() => {
  if (stockId.value) {
    stockStore.fetchStockById(stockId.value);
  }
});

const goBack = () => {
  router.push({ name: 'stock-list' });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="mb-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Stock List
      </button>

      <!-- Loading State -->
      <div v-if="stockStore.loading" class="bg-white rounded-lg shadow p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading stock details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="stockStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 class="text-xl font-bold text-red-800 mb-2">Error Loading Stock</h2>
        <p class="text-red-600">{{ stockStore.error }}</p>
      </div>

      <!-- Stock Detail -->
      <div v-else-if="stockStore.currentStock" class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
          <h1 class="text-3xl font-bold text-white">{{ stockStore.currentStock.ticker }}</h1>
          <p class="text-blue-100 mt-1">{{ stockStore.currentStock.company }}</p>
        </div>

        <!-- Content -->
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Info -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Stock ID</dt>
                  <dd class="mt-1 text-sm text-gray-900 font-mono">{{ stockStore.currentStock.id }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Company</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ stockStore.currentStock.company }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Ticker Symbol</dt>
                  <dd class="mt-1 text-sm text-gray-900 font-bold">{{ stockStore.currentStock.ticker }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Brokerage</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ stockStore.currentStock.brokerage }}</dd>
                </div>
              </dl>
            </div>

            <!-- Action & Additional Info -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Action Details</h2>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Action</dt>
                  <dd class="mt-1">
                    <span 
                      class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': stockStore.currentStock.action?.toLowerCase().includes('raised') || stockStore.currentStock.action?.toLowerCase().includes('initiated') || stockStore.currentStock.action?.toLowerCase().includes('upgraded'),
                        'bg-red-100 text-red-800': stockStore.currentStock.action?.toLowerCase().includes('lowered') || stockStore.currentStock.action?.toLowerCase().includes('downgraded'),
                        'bg-blue-100 text-blue-800': stockStore.currentStock.action?.toLowerCase().includes('reiterated') || stockStore.currentStock.action?.toLowerCase().includes('set'),
                        'bg-gray-100 text-gray-800': !stockStore.currentStock.action
                      }"
                    >
                      {{ stockStore.currentStock.action }}
                    </span>
                  </dd>
                </div>
                <div v-if="stockStore.currentStock.price">
                  <dt class="text-sm font-medium text-gray-500">Current Price</dt>
                  <dd class="mt-1 text-sm text-gray-900">${{ stockStore.currentStock.price }}</dd>
                </div>
                <div v-if="stockStore.currentStock.target_price">
                  <dt class="text-sm font-medium text-gray-500">Target Price</dt>
                  <dd class="mt-1 text-sm text-gray-900">${{ stockStore.currentStock.target_price }}</dd>
                </div>
                <div v-if="stockStore.currentStock.date">
                  <dt class="text-sm font-medium text-gray-500">Date</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ stockStore.currentStock.date }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Raw Data (for debugging/additional fields) -->
          <div class="mt-8 pt-8 border-t border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Complete Data</h2>
            <div class="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre class="text-xs text-gray-800">{{ JSON.stringify(stockStore.currentStock, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- No Stock Found -->
      <div v-else class="bg-white rounded-lg shadow p-8 text-center">
        <p class="text-gray-500">Stock not found</p>
      </div>
    </div>
  </div>
</template>
