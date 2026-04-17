<template>
  <aside class="flex flex-col h-full bg-[#0F2E4A] w-[240px]">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-[#1a4060]">
      <div class="w-9 h-9 bg-[#A8845A] rounded-xl flex items-center justify-center flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="1" y="7" width="18" height="12" rx="1.5" stroke="white" stroke-width="1.5"/>
          <path d="M1 10.5L10 3l9 7.5" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
          <rect x="7" y="13" width="6" height="6" rx="0.8" fill="white" fill-opacity="0.9"/>
        </svg>
      </div>
      <div class="min-w-0">
        <p class="text-white font-bold text-sm leading-tight truncate">Apartment</p>
        <p class="text-[#7DA5BE] text-xs truncate">Management</p>
      </div>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <p class="text-[#4A6A80] text-[10px] font-semibold tracking-widest uppercase px-3 mb-2">Tổng quan</p>

      <RouterLink
        v-for="item in mainNav"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-[#A8845A] text-white'
          : 'text-[#7DA5BE] hover:bg-[#1a4060] hover:text-white'"
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        {{ item.label }}
      </RouterLink>

      <p class="text-[#4A6A80] text-[10px] font-semibold tracking-widest uppercase px-3 mt-4 mb-2">Quản lý</p>

      <RouterLink
        v-for="item in manageNav"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-[#A8845A] text-white'
          : 'text-[#7DA5BE] hover:bg-[#1a4060] hover:text-white'"
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        {{ item.label }}
      </RouterLink>

      <p class="text-[#4A6A80] text-[10px] font-semibold tracking-widest uppercase px-3 mt-4 mb-2">Hệ thống</p>

      <RouterLink
        v-for="item in systemNav"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-[#A8845A] text-white'
          : 'text-[#7DA5BE] hover:bg-[#1a4060] hover:text-white'"
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <!-- User info -->
    <div class="px-4 py-4 border-t border-[#1a4060]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-[#A9B8A8] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5.5" r="3" fill="white"/>
            <path d="M1.5 14c0-3.038 2.91-5.5 6.5-5.5s6.5 2.462 6.5 5.5" stroke="white" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white text-xs font-semibold truncate">{{ username }}</p>
          <p class="text-[#4A6A80] text-[10px] truncate">{{ role }}</p>
        </div>
        <button
          @click="handleLogout"
          class="text-[#4A6A80] hover:text-red-400 transition-colors flex-shrink-0"
          title="Đăng xuất"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const username = computed(() => authStore.user?.username ?? 'Admin')
const role = computed(() => authStore.user?.role ?? 'ADMIN')

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// Inline SVG icon components
function makeIcon(paths: string) {
  return defineComponent({
    render() {
      return h('svg', { viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
        [h('g', { innerHTML: paths })]
      )
    },
  })
}

const mainNav = [
  {
    to: '/',
    label: 'Dashboard',
    icon: makeIcon(`<rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>`),
  },
]

const manageNav = [
  {
    to: '/apartments',
    label: 'Căn hộ',
    icon: makeIcon(`<rect x="2" y="8" width="16" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M2 11L10 4l8 7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="7.5" y="13" width="5" height="5" rx="0.5" fill="currentColor" fill-opacity="0.5"/>`),
  },
  {
    to: '/zones',
    label: 'Phân khu',
    icon: makeIcon(`<circle cx="10" cy="8" r="5.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 2.5v11M4.5 8h11M5.5 5a9 9 0 0 1 9 0M5.5 11a9 9 0 0 0 9 0" stroke="currentColor" stroke-width="1.5"/>`),
  },
  {
    to: '/portfolios',
    label: 'Portfolio',
    icon: makeIcon(`<rect x="2" y="5" width="16" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M6 5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5"/>
      <path d="M2 10h16" stroke="currentColor" stroke-width="1.5"/>`),
  },
]

const systemNav = [
  {
    to: '/departments',
    label: 'Phòng ban',
    icon: makeIcon(`<path d="M2 17v-1a4 4 0 0 1 4-4h2M14 17v-1a4 4 0 0 0-4-4h-2M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
  },
  {
    to: '/employees',
    label: 'Nhân viên',
    icon: makeIcon(`<circle cx="10" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
      <path d="M2.5 18c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
  },
  {
    to: '/audit-logs',
    label: 'Lịch sử Audit',
    icon: makeIcon(`<rect x="3" y="2" width="14" height="16" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M7 7h6M7 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
  },
]
</script>
