import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Views
import StockListView from '@/views/StockListView.vue';
import StockDetailView from '@/views/StockDetailView.vue';
import RecommendationsView from '@/views/RecommendationsView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/stocks',
  },
  {
    path: '/stocks',
    name: 'stock-list',
    component: StockListView,
    meta: {
      title: 'Stock List',
    },
  },
  {
    path: '/recommendations',
    name: 'recommendations',
    component: RecommendationsView,
    meta: {
      title: 'Stock Recommendations',
    },
  },
  {
    path: '/stocks/:id',
    name: 'stock-detail',
    component: StockDetailView,
    meta: {
      title: 'Stock Details',
    },
    props: true, // Pass route params as props
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/stocks',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

// Navigation guards
router.beforeEach((to, _from, next) => {
  // Set page title
  const title = to.meta.title as string;
  document.title = title ? `${title} - Stock App` : 'Stock App';
  
  next();
});

export default router;
