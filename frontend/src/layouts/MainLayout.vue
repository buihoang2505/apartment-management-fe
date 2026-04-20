<template>
  <div class="flex h-screen bg-[#F5F6FA] overflow-hidden">

    <!-- ── Sidebar desktop ── -->
    <div class="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-30 shadow-sidebar">
      <AppSidebar />
    </div>

    <!-- ── Mobile sidebar overlay ── -->
    <Transition name="fade">
      <div
        v-if="mobileSidebarOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        @click="mobileSidebarOpen = false"
      />
    </Transition>
    <Transition name="slide-left">
      <div
        v-if="mobileSidebarOpen"
        class="fixed left-0 top-0 bottom-0 z-50 shadow-2xl md:hidden"
      >
        <AppSidebar />
      </div>
    </Transition>

    <!-- ── Main content area ── -->
    <div class="flex-1 flex flex-col min-w-0 md:ml-[240px]">

      <!-- Top header -->
      <header class="bg-white border-b border-[#E5E9EE] px-6 h-[60px] flex items-center gap-4 flex-shrink-0">

        <!-- Mobile hamburger -->
        <button
          class="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F6FA] transition-colors"
          @click="mobileSidebarOpen = true"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <rect width="18" height="2" rx="1" fill="#414A4D"/>
            <rect y="6" width="12" height="2" rx="1" fill="#414A4D"/>
            <rect y="12" width="18" height="2" rx="1" fill="#414A4D"/>
          </svg>
        </button>

        <!-- Breadcrumb + Title -->
        <div class="flex-1 min-w-0">
          <!-- Breadcrumb -->
          <div v-if="breadcrumbs.length > 1" class="flex items-center gap-1 mb-0.5">
            <span
              v-for="(crumb, i) in breadcrumbs"
              :key="i"
              class="flex items-center gap-1"
            >
              <span
                v-if="i < breadcrumbs.length - 1"
                class="text-[11px] text-[#9CA3AF] hover:text-[#6B7280] cursor-pointer transition-colors"
                @click="crumb.path && router.push(crumb.path)"
              >{{ crumb.label }}</span>
              <span v-if="i < breadcrumbs.length - 1" class="text-[#D1D5DB] text-[11px]">/</span>
            </span>
          </div>
          <!-- Page title -->
          <h1 class="text-[18px] font-semibold text-[#1A1A2E] leading-tight truncate">{{ pageTitle }}</h1>
        </div>

        <!-- Right actions -->
        <div class="flex items-center gap-1">

          <!-- Search -->
          <button class="w-9 h-9 rounded-[10px] hover:bg-[#F5F6FA] flex items-center justify-center transition-colors" title="Tìm kiếm">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="#6B7280" stroke-width="1.5"/>
              <path d="M12 12L15 15" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- Notification bell -->
          <button class="w-9 h-9 rounded-[10px] hover:bg-[#F5F6FA] flex items-center justify-center transition-colors relative" title="Thông báo">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M8.5 2a5 5 0 0 1 5 5v3l1 2H3l1-2V7a5 5 0 0 1 5-5Z" stroke="#6B7280" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M7 14a1.5 1.5 0 0 0 3 0" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <!-- Dot indicator -->
            <span class="absolute top-2 right-2 w-1.5 h-1.5 bg-[#A8845A] rounded-full" />
          </button>

          <!-- Divider -->
          <div class="w-px h-5 bg-[#E5E9EE] mx-1" />

          <!-- User avatar -->
          <button class="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-[10px] hover:bg-[#F5F6FA] transition-colors">
            <div class="w-7 h-7 rounded-full bg-[#A8845A] flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0">
              {{ avatarInitial }}
            </div>
            <span class="text-[13px] font-medium text-[#414A4D] hidden sm:block max-w-[100px] truncate">{{ username }}</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" class="hidden sm:block text-[#9CA3AF]">
              <path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

        </div>
      </header>

      <!-- Scrollable content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>

      <!-- Bottom nav — mobile only -->
      <BottomNav class="md:hidden" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useAuthStore } from '@/stores/authStore'

const route    = useRoute()
const router   = useRouter()
const authStore = useAuthStore()

const mobileSidebarOpen = ref(false)

const username      = computed(() => authStore.user?.username ?? 'Admin')
const avatarInitial = computed(() => (authStore.user?.username ?? 'A').charAt(0).toUpperCase())

/* ── Route metadata ── */
interface RouteInfo { label: string; parent?: string; parentPath?: string }
const routeMap: Record<string, RouteInfo> = {
  '/':            { label: 'Dashboard' },
  '/apartments':  { label: 'Căn hộ',        parent: 'Quản lý' },
  '/zones':       { label: 'Phân khu',       parent: 'Quản lý' },
  '/portfolios':  { label: 'Portfolio',      parent: 'Quản lý' },
  '/departments': { label: 'Phòng ban',      parent: 'Hệ thống' },
  '/employees':   { label: 'Nhân viên',      parent: 'Hệ thống' },
  '/audit-logs':  { label: 'Lịch sử Audit',  parent: 'Hệ thống' },
  '/admin/users': { label: 'Quản lý người dùng', parent: 'Hệ thống' },
}

function matchRoute(path: string): RouteInfo | undefined {
  if (routeMap[path]) return routeMap[path]
  for (const [prefix, info] of Object.entries(routeMap)) {
    if (prefix !== '/' && path.startsWith(prefix)) return info
  }
  return undefined
}

const currentInfo = computed(() => matchRoute(route.path))
const pageTitle   = computed(() => currentInfo.value?.label ?? 'Dashboard')

const breadcrumbs = computed(() => {
  const info = currentInfo.value
  if (!info?.parent) return [{ label: info?.label ?? 'Dashboard', path: null }]
  return [
    { label: info.parent, path: null },
    { label: info.label,  path: null },
  ]
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.25s ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
</style>
