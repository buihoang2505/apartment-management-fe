import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

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
    {
      path: '/lead-register',
      component: AuthLayout,
      children: [
        { path: '', name: 'LeadRegister', component: () => import('@/views/public/LeadRegisterView.vue') },
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
        // Bookings / Calendar
        {
          path: 'calendar',
          name: 'Calendar',
          component: () => import('@/views/booking/CalendarView.vue'),
        },
        // Contracts
        {
          path: 'contracts',
          name: 'ContractList',
          component: () => import('@/views/contract/ContractListView.vue'),
        },
        {
          path: 'contracts/:id',
          name: 'ContractDetail',
          component: () => import('@/views/contract/ContractDetailView.vue'),
        },
        // Customers
        {
          path: 'customers',
          name: 'CustomerList',
          component: () => import('@/views/customer/CustomerListView.vue'),
        },
        // Zones
        {
          path: 'zones',
          name: 'ZoneList',
          component: () => import('@/views/zone/ZoneListView.vue'),
        },
        {
          path: 'zones/:id',
          name: 'ZoneDetail',
          component: () => import('@/views/zone/ZoneDetailView.vue'),
        },
        // Portfolios
        {
          path: 'portfolios',
          name: 'PortfolioList',
          component: () => import('@/views/portfolio/PortfolioListView.vue'),
        },
        {
          path: 'portfolios/:id',
          name: 'PortfolioDetail',
          component: () => import('@/views/portfolio/PortfolioDetailView.vue'),
        },
        // Profile
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/profile/ProfileView.vue'),
        },
        // System
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
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: 'admin/users',
          name: 'AdminUsers',
          component: () => import('@/views/system/AdminUsersView.vue'),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: 'notifications',
          name: 'Notifications',
          component: () => import('@/views/notification/NotificationsView.vue'),
          meta: { requiresAuth: true },
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

  if (to.meta.requiresAdmin) {
    const authStore = useAuthStore()
    // Restore user từ localStorage nếu store chưa có (cold reload)
    if (!authStore.user) authStore.initAuth()
    if (!authStore.isAdmin) {
      useToastStore().show('Bạn không có quyền truy cập trang này', 'error')
      return { path: '/' }
    }
  }
})

export default router
