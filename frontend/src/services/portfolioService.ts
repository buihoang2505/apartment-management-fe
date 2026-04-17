import http from './http'
import type { Portfolio } from '@/types/portfolio'
import type { CommonResponse } from '@/types/common'

const portfolioService = {
  getAll(): Promise<{ data: CommonResponse<Portfolio[]> }> {
    return http.get('/portfolios')
  },

  getById(id: string): Promise<{ data: CommonResponse<Portfolio> }> {
    return http.get(`/portfolios/${id}`)
  },
}

export default portfolioService
