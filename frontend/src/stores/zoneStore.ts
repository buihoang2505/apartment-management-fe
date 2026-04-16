import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Zone } from '@/types/zone'

export const useZoneStore = defineStore('zone', () => {
  const zones = ref<Zone[]>([])

  // TODO: implement actions

  return { zones }
})
