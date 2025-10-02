<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'previous'): void;
  (e: 'goToPage', page: number): void;
  (e: 'changePageSize', size: number): void;
}>();

const getPageNumbers = () => {
  const pages: (number | string)[] = [];
  const maxVisible = 5;
  
  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (props.currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(props.totalPages);
    } else if (props.currentPage >= props.totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = props.totalPages - 3; i <= props.totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(props.currentPage - 1);
      pages.push(props.currentPage);
      pages.push(props.currentPage + 1);
      pages.push('...');
      pages.push(props.totalPages);
    }
  }
  
  return pages;
};
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <!-- Items Info -->
    <div class="text-sm text-gray-700">
      Showing 
      <span class="font-medium">{{ Math.min(itemsPerPage, totalItems) }}</span>
      of 
      <span class="font-medium">{{ totalItems }}</span>
      results
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center gap-2">
      <!-- Previous Button -->
      <button
        @click="emit('previous')"
        :disabled="!hasPreviousPage"
        class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Page Numbers -->
      <div class="hidden sm:flex gap-1">
        <button
          v-for="(page, index) in getPageNumbers()"
          :key="index"
          @click="typeof page === 'number' ? emit('goToPage', page) : null"
          :disabled="page === '...'"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md',
            page === currentPage
              ? 'bg-blue-600 text-white'
              : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Mobile: Current Page Display -->
      <div class="sm:hidden px-3 py-2 text-sm font-medium text-gray-700">
        {{ currentPage }} / {{ totalPages }}
      </div>

      <!-- Next Button -->
      <button
        @click="emit('next')"
        :disabled="!hasNextPage"
        class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Items per page selector -->
    <div class="flex items-center gap-2">
      <label class="text-sm text-gray-700">Per page:</label>
      <select
        :value="itemsPerPage"
        @change="emit('changePageSize', parseInt(($event.target as HTMLSelectElement).value))"
        class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>
  </div>
</template>
