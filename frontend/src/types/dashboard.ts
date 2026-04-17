export interface GrowthStats {
  thisMonth: number
  lastMonth: number
  percentage: number
}

export interface DashboardStatsResponse {
  total: number
  byStatus: Record<string, number>
  byType: Record<string, number>
  growth: GrowthStats
}
