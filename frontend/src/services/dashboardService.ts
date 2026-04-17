import http from './http'
import type { CommonResponse } from '@/types/common'
import type { DashboardStatsResponse } from '@/types/dashboard'

const dashboardService = {
  getStats(zoneId?: string): Promise<{ data: CommonResponse<DashboardStatsResponse> }> {
    return http.get('/dashboard/stats', { params: zoneId ? { zoneId } : undefined })
  },
}

export default dashboardService
