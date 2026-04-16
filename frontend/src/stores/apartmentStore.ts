import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Apartment } from '@/types/apartment'

export const useApartmentStore = defineStore('apartment', () => {
  const apartments = ref<Apartment[]>([])
  const current = ref<Apartment | null>(null)

  // TODO: implement actions

  return { apartments, current }
})
