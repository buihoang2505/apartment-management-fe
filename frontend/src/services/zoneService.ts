import http from './http'
import type { Zone, BuildingResponse } from '@/types/zone'
import type { CommonResponse } from '@/types/common'

const zoneService = {
  getAll(): Promise<{ data: CommonResponse<Zone[]> }> {
    return http.get('/zones')
  },

  getBuildingsByZone(zoneId: string): Promise<{ data: CommonResponse<BuildingResponse[]> }> {
    return http.get(`/zones/${zoneId}/buildings`)
  },
}

export default zoneService
