import http from './http'
import type { Portfolio } from '@/types/portfolio'
import type { CommonResponse } from '@/types/common'

export interface CreatePortfolioRequest {
  name: string
  description?: string
  zoneIds?: string[]
}

export interface UpdatePortfolioRequest {
  name: string
  description?: string
  zoneIds?: string[]
}

const portfolioService = {
  getAll(): Promise<{ data: CommonResponse<Portfolio[]> }> {
    return http.get('/portfolios')
  },

  getById(id: string): Promise<{ data: CommonResponse<Portfolio> }> {
    return http.get(`/portfolios/${id}`)
  },

  create(payload: CreatePortfolioRequest): Promise<{ data: CommonResponse<Portfolio> }> {
    return http.post('/portfolios', payload)
  },

  update(id: string, payload: UpdatePortfolioRequest): Promise<{ data: CommonResponse<Portfolio> }> {
    return http.put(`/portfolios/${id}`, payload)
  },

  deleteById(id: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/portfolios/${id}`)
  },
}

export default portfolioService
