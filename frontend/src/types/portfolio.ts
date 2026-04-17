import type { ZoneResponse } from './zone'

export interface Portfolio {
  id: string
  name: string
  description: string
  zones: ZoneResponse[]
  createdAt: string
}
