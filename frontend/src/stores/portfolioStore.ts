import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Portfolio } from '@/types/portfolio'

export const usePortfolioStore = defineStore('portfolio', () => {
  const portfolios = ref<Portfolio[]>([])

  // TODO: implement actions

  return { portfolios }
})
