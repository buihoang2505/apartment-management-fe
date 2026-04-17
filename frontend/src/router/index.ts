import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public
    {
      path: '/login',
      component: AuthLayout,
      children: [
        { path: '', name: 'Login', component: () => import('@/views/auth/LoginView.vue') },
      ],
    },

    // Private
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
        // Apartments
        {
          path: 'apartments',
          name: 'ApartmentList',
          component: () => import('@/views/apartment/ApartmentListView.vue'),
        },
        {
          path: 'apartments/new',
          name: 'ApartmentCreate',
          component: () => import('@/views/apartment/ApartmentDetailView.vue'),
        },
        {
          path: 'apartments/:id',
          name: 'ApartmentDetail',
          component: () => import('@/views/apartment/ApartmentDetailView.vue'),
        },
        {
          path: 'apartments/:id/gallery',
          name: 'ApartmentGallery',
          // Render ngoài MainLayout bằng fixed overlay trong component
          component: () => import('@/views/apartment/ApartmentGalleryView.vue'),
        },
        // Zones
        {
          path: 'zones',
          name: 'ZoneList',
          component: () => import('@/views/zone/ZoneListView.vue'),
        },
        // Portfolios
        {
          path: 'portfolios',
          name: 'PortfolioList',
          component: () => import('@/views/portfolio/PortfolioListView.vue'),
        },
        // System — placeholder
        {
          path: 'departments',
          name: 'Departments',
          component: () => import('@/views/system/DepartmentsView.vue'),
        },
        {
          path: 'employees',
          name: 'Employees',
          component: () => import('@/views/system/EmployeesView.vue'),
        },
        {
          path: 'audit-logs',
          name: 'AuditLogs',
          component: () => import('@/views/system/AuditLogsView.vue'),
        },
      ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' }
  }
})

export default router
