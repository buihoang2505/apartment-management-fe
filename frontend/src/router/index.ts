import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'Login',
          component: () => import('@/views/auth/LoginView.vue'),
        },
      ],
    },

    // Private routes
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
        },
        {
          path: 'apartments',
          name: 'ApartmentList',
          component: () => import('@/views/apartment/ApartmentListView.vue'),
        },
        {
          path: 'apartments/:id',
          name: 'ApartmentDetail',
          component: () => import('@/views/apartment/ApartmentDetailView.vue'),
        },
        {
          path: 'apartments/:id/gallery',
          name: 'ApartmentGallery',
          component: () => import('@/views/apartment/ApartmentGalleryView.vue'),
        },
        {
          path: 'zones',
          name: 'ZoneList',
          component: () => import('@/views/zone/ZoneListView.vue'),
        },
        {
          path: 'portfolios',
          name: 'PortfolioList',
          component: () => import('@/views/portfolio/PortfolioListView.vue'),
        },
      ],
    },

    // Fallback
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// Navigation guard
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' }
  }
})

export default router
