<template>
  <aside class="flex flex-col h-full w-[240px] bg-[#1C2526] select-none">

    <!-- ── Logo ── -->
    <div class="flex items-center gap-3 px-5 py-[18px] border-b border-white/[0.06]">
      <!-- Icon -->
      <div class="w-9 h-9 rounded-[10px] bg-[#A8845A] flex items-center justify-center flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 10.5L10 3.5l8 7V17a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-6.5Z" stroke="white" stroke-width="1.4" stroke-linejoin="round"/>
          <rect x="7" y="13" width="6" height="5" rx="1" fill="white" fill-opacity="0.85"/>
        </svg>
      </div>
      <!-- Text -->
      <div class="min-w-0 leading-none">
        <p class="text-white font-semibold text-[14px] tracking-tight truncate">Apartment</p>
        <p class="text-white/40 text-[11px] mt-0.5 truncate tracking-wide">Management</p>
      </div>
    </div>

    <!-- ── Navigation ── -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">

      <!-- Tổng quan -->
      <p class="nav-group-label">Tổng quan</p>
      <NavItem v-for="item in mainNav" :key="item.to" v-bind="item" />

      <!-- Quản lý -->
      <p class="nav-group-label mt-4">Quản lý</p>
      <NavItem v-for="item in manageNav" :key="item.to" v-bind="item" />

      <!-- Hệ thống -->
      <p class="nav-group-label mt-4">Hệ thống</p>
      <NavItem v-for="item in systemNav" :key="item.to" v-bind="item" />
      <NavItem v-if="isAdmin" v-bind="auditLogsNav" />
      <NavItem v-if="isAdmin" v-bind="adminUsersNav" />

    </nav>

    <!-- ── User info ── -->
    <div class="px-3 py-3 border-t border-white/[0.06]">
      <div class="flex items-center gap-3 px-2 py-2.5 rounded-[10px] hover:bg-white/[0.05] transition-all duration-200 ease-in-out group cursor-pointer" @click="router.push('/profile')">
        <!-- Avatar -->
        <div class="w-8 h-8 rounded-full bg-[#A8845A] flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold relative overflow-hidden">
          <span>{{ avatarInitial }}</span>
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt=""
            class="absolute inset-0 w-full h-full object-cover"
            @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
          />
        </div>
        <!-- Name + role -->
        <div class="flex-1 min-w-0">
          <p class="text-white text-[13px] font-medium truncate leading-tight">{{ username }}</p>
          <p class="text-white/35 text-[11px] truncate mt-0.5">{{ role }}</p>
        </div>
        <!-- Logout -->
        <button
          @click="handleLogout"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 ease-in-out flex-shrink-0 opacity-0 group-hover:opacity-100"
          title="Đăng xuất"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M5.5 13H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2.5M10 10.5l3-3-3-3M13 7.5H5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route  = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const username      = computed(() => authStore.user?.username ?? 'Admin')
const role          = computed(() => authStore.user?.role ?? '')
const avatarInitial = computed(() => (authStore.user?.username ?? 'A').charAt(0).toUpperCase())
const isAdmin       = computed(() => authStore.isAdmin)
const avatarUrl     = computed(() => {
  const url = authStore.user?.avatarUrl
  if (!url) return null
  return url.startsWith('http') ? url : `http://localhost:8080${url}`
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

/* ── Nav item component ── */
function makeIcon(paths: string) {
  return defineComponent({
    render() {
      return h('svg', { viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
        [h('g', { innerHTML: paths })]
      )
    },
  })
}

const NavItem = defineComponent({
  props: { to: String, label: String, icon: Object },
  setup(props) {
    return () => {
      const active = isActive(props.to!)
      return h(RouterLink, {
        to: props.to!,
        class: [
          'flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13.5px] font-medium transition-all duration-200 ease-in-out w-full',
          active
            ? 'bg-[#A8845A] text-white shadow-sm'
            : 'text-white/50 hover:text-white/90 hover:bg-[#A8845A]/10',
        ],
      }, () => [
        h(props.icon as any, {
          class: ['w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200', active ? 'text-white' : 'text-white/40'],
        }),
        h('span', { class: 'truncate' }, props.label),
      ])
    }
  },
})

/* ── Nav data ── */
const mainNav = [
  {
    to: '/',
    label: 'Dashboard',
    icon: makeIcon(`
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
    `),
  },
]

const manageNav = [
  {
    to: '/apartments',
    label: 'Căn hộ',
    icon: makeIcon(`
      <rect x="2" y="8" width="16" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M2 11L10 4l8 7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="7.5" y="13" width="5" height="5" rx="0.5" fill="currentColor" fill-opacity="0.5"/>
    `),
  },
  {
    to: '/zones',
    label: 'Phân khu',
    icon: makeIcon(`
      <circle cx="10" cy="8" r="5.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 2.5v11M4.5 8h11M5.5 5a9 9 0 0 1 9 0M5.5 11a9 9 0 0 0 9 0" stroke="currentColor" stroke-width="1.5"/>
    `),
  },
  {
    to: '/portfolios',
    label: 'Portfolio',
    icon: makeIcon(`
      <rect x="2" y="5" width="16" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M6 5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5"/>
      <path d="M2 10h16" stroke="currentColor" stroke-width="1.5"/>
    `),
  },
]

const adminUsersNav = {
  to: '/admin/users',
  label: 'Quản lý người dùng',
  icon: makeIcon(`
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `),
}

const systemNav = [
  {
    to: '/departments',
    label: 'Phòng ban',
    icon: makeIcon(`
      <path d="M2 17v-1a4 4 0 0 1 4-4h2M14 17v-1a4 4 0 0 0-4-4h-2M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    `),
  },
  {
    to: '/employees',
    label: 'Nhân viên',
    icon: makeIcon(`
      <circle cx="10" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
      <path d="M2.5 18c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    `),
  },
]

const auditLogsNav = {
  to: '/audit-logs',
  label: 'Lịch sử Audit',
  icon: makeIcon(`
    <rect x="3" y="2" width="14" height="16" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
    <path d="M7 7h6M7 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `),
}
</script>

<style scoped>
.nav-group-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.25);
  text-transform: uppercase;
  padding: 0 12px;
  margin-bottom: 4px;
  margin-top: 4px;
}
</style>
