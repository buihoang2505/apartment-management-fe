import http from './http'
import type { Zone } from '@/types/zone'
import type { PageResponse } from '@/types/common'

const zoneService = {
  getList(_params?: Record<string, unknown>): Promise<{ data: PageResponse<Zone> }> {
    // TODO: implement
    return http.get('/zones', { params: _params })
  },
}

export default zoneService
