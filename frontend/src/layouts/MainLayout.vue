<template>
  <div class="flex h-screen bg-[#F0F4F8] overflow-hidden">
    <!-- Sidebar — desktop only -->
    <div class="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-30 shadow-xl">
      <AppSidebar />
    </div>

    <!-- Mobile sidebar overlay -->
    <Transition name="fade">
      <div
        v-if="mobileSidebarOpen"
        class="fixed inset-0 bg-black/50 z-40 md:hidden"
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

    <!-- Main area -->
    <div class="flex-1 flex flex-col min-w-0 md:ml-[240px]">
      <!-- Top header -->
      <header class="bg-white border-b border-[#E8EFF5] px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
        <!-- Mobile hamburger -->
        <button
          class="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F4F8] transition-colors"
          @click="mobileSidebarOpen = true"
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <rect width="20" height="2" rx="1" fill="#414A4D"/>
            <rect y="6" width="14" height="2" rx="1" fill="#414A4D"/>
            <rect y="12" width="20" height="2" rx="1" fill="#414A4D"/>
          </svg>
        </button>

        <!-- Page title -->
        <h1 class="text-[#0F2E4A] font-bold text-lg flex-1 truncate">{{ pageTitle }}</h1>

        <!-- Right actions -->
        <div class="flex items-center gap-2">
          <button class="w-9 h-9 rounded-lg hover:bg-[#F0F4F8] flex items-center justify-center transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8.5" cy="8.5" r="6" stroke="#414A4D" stroke-width="1.6"/>
              <path d="M13 13L16.5 16.5" stroke="#414A4D" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="w-9 h-9 rounded-full bg-[#A9B8A8] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="6" r="3.5" fill="white"/>
              <path d="M1.5 17c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" fill="white"/>
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
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import BottomNav from '@/components/layout/BottomNav.vue'

const route = useRoute()
const mobileSidebarOpen = ref(false)

const titleMap: Record<string, string> = {
  '/': 'Dashboard',
  '/apartments': 'Căn hộ',
  '/zones': 'Phân khu',
  '/portfolios': 'Portfolio',
  '/departments': 'Phòng ban',
  '/employees': 'Nhân viên',
  '/audit-logs': 'Lịch sử Audit',
}

const pageTitle = computed(() => {
  for (const [prefix, title] of Object.entries(titleMap)) {
    if (prefix !== '/' && route.path.startsWith(prefix)) return title
  }
  return titleMap[route.path] ?? 'Dashboard'
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.25s ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
</style>
