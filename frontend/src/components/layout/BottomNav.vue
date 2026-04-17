<template>
  <nav class="fixed bottom-0 inset-x-0 bg-white border-t border-[#E8EFF5] flex justify-around py-2 z-20">
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors"
      :class="isActive(item.to) ? 'text-[#A8845A]' : 'text-[#A9B8A8]'"
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" v-html="item.svg" />
      <span class="text-[10px] font-medium">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    svg: `<rect x="2" y="2" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="12" y="2" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="2" y="12" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="12" y="12" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>`,
  },
  {
    to: '/apartments',
    label: 'Căn hộ',
    svg: `<rect x="2" y="9" width="18" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M2 12L11 4l9 8" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <rect x="8" y="14" width="6" height="6" rx="0.5" fill="currentColor" fill-opacity="0.4"/>`,
  },
  {
    to: '/portfolios',
    label: 'Portfolio',
    svg: `<rect x="2" y="6" width="18" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M7 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5"/>
          <path d="M2 11h18" stroke="currentColor" stroke-width="1.5"/>`,
  },
  {
    to: '/zones',
    label: 'Phân khu',
    svg: `<circle cx="11" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 3v12M5 9h12" stroke="currentColor" stroke-width="1.5"/>`,
  },
]
</script>
