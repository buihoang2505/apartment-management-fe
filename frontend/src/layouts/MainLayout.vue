<template>
  <div class="min-h-screen bg-navy-950 flex flex-col">
    <AppHeader />
    <main class="flex-1 overflow-y-auto pb-20">
      <RouterView />
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
</script>
