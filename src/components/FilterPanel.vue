<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { StockService } from '@/services';
import type { StockQueryParams, Rating } from '@/types';

const props = defineProps<{
  filters: StockQueryParams;
}>();

const emit = defineEmits<{
  (e: 'apply', filters: StockQueryParams): void;
  (e: 'clear'): void;
}>();

const localFilters = ref<StockQueryParams>({ ...props.filters });
const ratings = ref<Rating[]>([]);
const loadingRatings = ref(false);

onMounted(async () => {
  await fetchRatings();
});

const fetchRatings = async () => {
  try {
    loadingRatings.value = true;
    const response = await StockService.getRatings();
    ratings.value = response.data || [];
  } catch (err: any) {
    console.error('Error fetching ratings:', err);
    ratings.value = [];
  } finally {
    loadingRatings.value = false;
  }
};

const applyFilters = () => {
  emit('apply', { ...localFilters.value });
};

const clearFilters = () => {
  localFilters.value = {
    ticker: undefined,
    company: undefined,
    brokerage: undefined,
    rating_to: undefined,
  };
  emit('clear');
};

const hasActiveFilters = () => {
  return !!(
    localFilters.value.ticker ||
    localFilters.value.company ||
    localFilters.value.brokerage ||
    localFilters.value.rating_to
  );
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Filters</h2>
      <button
        v-if="hasActiveFilters()"
        @click="clearFilters"
        class="text-sm text-blue-600 hover:text-blue-800"
      >
        Clear All
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Ticker Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ticker</label>
        <input
          v-model="localFilters.ticker"
          type="text"
          placeholder="e.g., AAPL"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Company Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
        <input
          v-model="localFilters.company"
          type="text"
          placeholder="e.g., Apple"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Brokerage Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Brokerage</label>
        <input
          v-model="localFilters.brokerage"
          type="text"
          placeholder="e.g., Goldman Sachs"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Rating Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <select
          v-model="localFilters.rating_to"
          :disabled="loadingRatings"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{{ loadingRatings ? 'Loading ratings...' : 'All Ratings' }}</option>
          <option v-for="rating in ratings" :key="rating.id" :value="rating.term">
            {{ rating.term }}
          </option>
        </select>
      </div>
    </div>

    <!-- Apply Button -->
    <div class="mt-4 flex justify-end">
      <button
        @click="applyFilters"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Apply Filters
      </button>
    </div>
  </div>
</template>
