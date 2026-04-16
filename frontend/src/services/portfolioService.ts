import http from './http'
import type { Portfolio } from '@/types/portfolio'
import type { PageResponse } from '@/types/common'

const portfolioService = {
  getList(_params?: Record<string, unknown>): Promise<{ data: PageResponse<Portfolio> }> {
    // TODO: implement
    return http.get('/portfolios', { params: _params })
  },
}

export default portfolioService
