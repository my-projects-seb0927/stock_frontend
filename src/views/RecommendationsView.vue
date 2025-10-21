<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { StockService } from '@/services';
import type { Recommendation } from '@/types';

const recommendations = ref<Recommendation[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  await fetchRecommendations();
});

const fetchRecommendations = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await StockService.getRecommendations(10);
    recommendations.value = response.data || [];
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch recommendations';
    console.error('❌ Error fetching recommendations:', err);
    recommendations.value = [];
  } finally {
    loading.value = false;
  }
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
    });
  } catch {
    return dateString;
  }
};

// Get rating color class
const getRatingClass = (rating: string | undefined) => {
  if (!rating) return 'bg-gray-100 text-gray-800';
  const lowerRating = rating.toLowerCase();
  if (['overweight', 'buy', 'speculative buy', 'outperform', 'strong-buy', 'market outperform', 'sector outperform', 'positive'].includes(lowerRating)) {
    return 'bg-green-100 text-green-800';
  }
  if (['hold', 'neutral', 'in-line', 'market perform', 'sector perform', 'equal weight'].includes(lowerRating)) {
    return 'bg-blue-100 text-blue-800';
  }
  if (['underweight', 'underperform', 'reduce', 'sell'].includes(lowerRating)) {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
};

// Get score color based on value
const getScoreColor = (score: number) => {
  if (score >= 9) return 'text-green-600 bg-green-50';
  if (score >= 8) return 'text-blue-600 bg-blue-50';
  if (score >= 7) return 'text-yellow-600 bg-yellow-50';
  return 'text-gray-600 bg-gray-50';
};

// Get medal icon for top 3
const getMedalIcon = (index: number) => {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return '';
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <router-link
          :to="{ name: 'stock-list' }"
          class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4"
        >
          <i class="pi pi-arrow-left mr-2 text-sm"></i>
          Back to Stock List
        </router-link>
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <i class="pi pi-star-fill text-yellow-500"></i>
              Top Stock Recommendations
            </h1>
            <p class="mt-2 text-gray-600">Data-driven analysis of the best investment opportunities based on recent ratings and price targets</p>
          </div>
          <button
            @click="fetchRecommendations"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <i class="pi pi-refresh"></i>
            Refresh
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Analyzing stocks...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Recommendations Grid -->
      <div v-else-if="recommendations.length > 0" class="space-y-4">
        <div
          v-for="(rec, index) in recommendations"
          :key="rec.stock.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <!-- Left: Stock Info -->
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-2xl">{{ getMedalIcon(index) }}</span>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {{ rec.stock.ticker }}
                      <span class="text-sm font-normal text-gray-500">{{ rec.stock.company }}</span>
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">{{ formatDate(rec.stock.time) }}</p>
                  </div>
                </div>

                <!-- Reason -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p class="text-sm text-blue-900">
                    <i class="pi pi-info-circle mr-2"></i>
                    <strong>Why recommended:</strong> {{ rec.reason }}
                  </p>
                </div>

                <!-- Details Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <!-- Rating Change -->
                  <div>
                    <p class="text-xs text-gray-500 mb-1">Rating Change</p>
                    <div class="flex items-center gap-1">
                      <span :class="['px-2 py-1 text-xs font-semibold rounded', getRatingClass(rec.stock.rating_from)]">
                        {{ rec.stock.rating_from }}
                      </span>
                      <i class="pi pi-arrow-right text-xs text-gray-400"></i>
                      <span :class="['px-2 py-1 text-xs font-semibold rounded', getRatingClass(rec.stock.rating_to)]">
                        {{ rec.stock.rating_to }}
                      </span>
                    </div>
                  </div>

                  <!-- Price Target -->
                  <div>
                    <p class="text-xs text-gray-500 mb-1">Price Target</p>
                    <div class="flex items-center gap-1 text-sm font-semibold">
                      <span class="text-gray-600">{{ rec.stock.target_from }}</span>
                      <i class="pi pi-arrow-right text-xs text-gray-400"></i>
                      <span class="text-green-600">{{ rec.stock.target_to }}</span>
                    </div>
                  </div>

                  <!-- Target Increase -->
                  <div>
                    <p class="text-xs text-gray-500 mb-1">Upside Potential</p>
                    <div class="flex items-center gap-1">
                      <i class="pi pi-arrow-up text-green-600"></i>
                      <span class="text-lg font-bold text-green-600">
                        {{ rec.target_increase_percent.toFixed(1) }}%
                      </span>
                    </div>
                  </div>

                  <!-- Action -->
                  <div>
                    <p class="text-xs text-gray-500 mb-1">Action</p>
                    <p class="text-sm font-medium text-gray-900 first-letter:uppercase">
                      {{ rec.stock.action || 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Right: Score Badge -->
              <div class="ml-6">
                <div :class="['rounded-lg p-4 text-center min-w-[100px]', getScoreColor(rec.score)]">
                  <p class="text-xs font-medium opacity-75 mb-1">Score</p>
                  <p class="text-3xl font-bold">{{ rec.score.toFixed(1) }}</p>
                  <p class="text-xs mt-1 opacity-75">out of 10</p>
                </div>
              </div>
            </div>

            <!-- View Details Link -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <router-link
                :to="{ name: 'stock-detail', params: { id: rec.stock.id } }"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
              >
                View Full Details
                <i class="pi pi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-lg shadow">
        <i class="pi pi-inbox text-gray-400 text-6xl"></i>
        <p class="mt-4 text-lg text-gray-500">No recommendations available</p>
        <p class="mt-2 text-sm text-gray-400">Please try again later</p>
      </div>
    </div>
  </div>
</template>
