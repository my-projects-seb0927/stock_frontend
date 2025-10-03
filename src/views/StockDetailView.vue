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

// Format timestamp to readable date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

// Get rating color class
const getRatingClass = (rating: string | undefined) => {
  if (!rating) return 'bg-gray-100 text-gray-800';
  const lowerRating = rating.toLowerCase();
  if (['overweight', 'buy', 'outperform', 'strong-buy', 'market outperform'].includes(lowerRating)) {
    return 'bg-green-100 text-green-800';
  }
  if (['hold', 'neutral', 'in-line', 'market perform', 'equal weight'].includes(lowerRating)) {
    return 'bg-blue-100 text-blue-800';
  }
  if (['underweight', 'underperform'].includes(lowerRating)) {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
};

// Check if rating improved
const isRatingUpgrade = computed(() => {
  const stock = stockStore.currentStock;
  if (!stock?.rating_from || !stock?.rating_to) return false;
  
  const ratingValues: { [key: string]: number } = {
    'strong-buy': 5,
    'buy': 4,
    'overweight': 4,
    'outperform': 4,
    'market outperform': 4,
    'hold': 3,
    'neutral': 3,
    'in-line': 3,
    'market perform': 3,
    'equal weight': 3,
    'underweight': 2,
    'underperform': 2,
  };
  
  const fromValue = ratingValues[stock.rating_from.toLowerCase()] || 3;
  const toValue = ratingValues[stock.rating_to.toLowerCase()] || 3;
  
  return toValue > fromValue;
});

const isRatingDowngrade = computed(() => {
  const stock = stockStore.currentStock;
  if (!stock?.rating_from || !stock?.rating_to) return false;
  
  const ratingValues: { [key: string]: number } = {
    'strong-buy': 5,
    'buy': 4,
    'overweight': 4,
    'outperform': 4,
    'market outperform': 4,
    'hold': 3,
    'neutral': 3,
    'in-line': 3,
    'market perform': 3,
    'equal weight': 3,
    'underweight': 2,
    'underperform': 2,
  };
  
  const fromValue = ratingValues[stock.rating_from.toLowerCase()] || 3;
  const toValue = ratingValues[stock.rating_to.toLowerCase()] || 3;
  
  return toValue < fromValue;
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="mb-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        <i class="pi pi-arrow-left mr-2"></i>
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
      <div v-else-if="stockStore.currentStock" class="space-y-6">
        <!-- Header Card -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-white">{{ stockStore.currentStock.ticker }}</h1>
                <p class="text-blue-100 mt-1 text-lg">{{ stockStore.currentStock.company }}</p>
              </div>
              <div class="text-right">
                <p class="text-blue-100 text-sm">Last Updated</p>
                <p class="text-white font-semibold">{{ formatDate(stockStore.currentStock.time) }}</p>
              </div>
            </div>
          </div>

          <!-- Action Banner -->
          <div v-if="stockStore.currentStock.action" class="bg-gradient-to-r from-purple-50 to-blue-50 px-8 py-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <i class="pi pi-info-circle text-purple-600 text-xl"></i>
              <div>
                <p class="text-sm font-medium text-gray-600">Action Taken</p>
                <p class="text-lg font-semibold text-gray-900 first-letter:uppercase">{{ stockStore.currentStock.action }}</p>
              </div>
              <div v-if="stockStore.currentStock.brokerage" class="ml-auto text-right">
                <p class="text-sm text-gray-600">By</p>
                <p class="font-semibold text-gray-900">{{ stockStore.currentStock.brokerage }}</p>
              </div>
              <div v-else class="ml-auto text-right">
                <p class="text-sm text-gray-500 italic">No brokerage available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ratings & Targets Card -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">Rating & Price Target Changes</h2>
          </div>
          
          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Rating Change -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <i class="pi pi-star text-blue-600"></i>
                  Rating Change
                </h3>
                
                <div class="flex items-center gap-4 max-w-72">
                  <div class="">
                    <p class="text-sm text-gray-500 mb-2">From</p>
                    <span :class="['px-4 py-2 inline-flex text-sm font-semibold rounded-lg', getRatingClass(stockStore.currentStock.rating_from)]">
                      {{ stockStore.currentStock.rating_from || 'N/A' }}
                    </span>
                  </div>
                  
                  <div class="flex-1 flex items-center justify-center">
                    <i 
                      v-if="isRatingUpgrade" 
                      class="pi pi-arrow-up-right text-green-600 text-3xl"
                    ></i>
                    <i 
                      v-else-if="isRatingDowngrade" 
                      class="pi pi-arrow-down-right text-red-600 text-3xl"
                    ></i>
                    <i 
                      v-else 
                      class="pi pi-arrow-right text-gray-400 text-3xl"
                    ></i>
                  </div>
                  
                  <div class="">
                    <p class="text-sm text-gray-500 mb-2">To</p>
                    <span :class="['px-4 py-2 inline-flex text-sm font-semibold rounded-lg', getRatingClass(stockStore.currentStock.rating_to)]">
                      {{ stockStore.currentStock.rating_to || 'N/A' }}
                    </span>
                  </div>
                </div>

                <div v-if="isRatingUpgrade" class="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p class="text-sm text-green-800 font-medium">📈 Rating Upgraded</p>
                </div>
                <div v-else-if="isRatingDowngrade" class="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p class="text-sm text-red-800 font-medium">📉 Rating Downgraded</p>
                </div>
                <div v-else class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p class="text-sm text-blue-800 font-medium">➡️ Rating Maintained</p>
                </div>
              </div>

              <!-- Price Target Change -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <i class="pi pi-dollar text-green-600"></i>
                  Price Target
                </h3>
                
                <div class="flex items-center gap-4 max-w-72">
                  <div>
                    <p class="text-sm text-gray-500 mb-2">From</p>
                    <div class="text-2xl font-bold text-gray-900">
                      {{ stockStore.currentStock.target_from || 'N/A' }}
                    </div>
                  </div>
                  
                  <div class="flex-1 flex items-center justify-center">
                    <i class="pi pi-arrow-right text-blue-600 text-3xl"></i>
                  </div>
                  
                  <div>
                    <p class="text-sm text-gray-500 mb-2">To</p>
                    <div class="text-2xl font-bold text-blue-600">
                      {{ stockStore.currentStock.target_to || 'N/A' }}
                    </div>
                  </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <i class="pi pi-info-circle text-blue-600 text-lg mt-0.5"></i>
                    <div>
                      <p class="text-sm font-medium text-blue-900">Price Target Update</p>
                      <p class="text-xs text-blue-700 mt-1">
                        Analyst has adjusted the price target from {{ stockStore.currentStock.target_from || 'N/A' }} to {{ stockStore.currentStock.target_to || 'N/A' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Metadata Card -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">Additional Information</h2>
          </div>
          
          <div class="p-8">
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt class="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <i class="pi pi-clock"></i>
                  Analysis Time
                </dt>
                <dd class="mt-1 text-sm text-gray-900 font-medium">{{ formatDate(stockStore.currentStock.time) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <i class="pi pi-calendar"></i>
                  Created At
                </dt>
                <dd class="mt-1 text-sm text-gray-900 font-medium">{{ formatDate(stockStore.currentStock.created_at) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <i class="pi pi-tag"></i>
                  Stock ID
                </dt>
                <dd class="mt-1 text-sm text-gray-900 font-mono">{{ stockStore.currentStock.id }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <i class="pi pi-building"></i>
                  Brokerage Firm
                </dt>
                <dd v-if="stockStore.currentStock.brokerage" class="mt-1 text-sm text-gray-900 font-medium">{{ stockStore.currentStock.brokerage }}</dd>
                <dd v-else class="mt-1 text-sm text-gray-400 italic">No brokerage available</dd>
              </div>
            </dl>
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
