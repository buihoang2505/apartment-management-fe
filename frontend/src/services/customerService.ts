import http from './http'
import type {
  CustomerResponse,
  CustomerFilter,
  CustomerStats,
  CustomerStatus,
} from '@/types/customer'
import type { CommonResponse, PageResponse } from '@/types/common'

const customerService = {
  getList(filter: CustomerFilter = {}): Promise<{
    data: CommonResponse<PageResponse<CustomerResponse>> | CustomerResponse[]
  }> {
    const params: Record<string, unknown> = {}
    if (filter.keyword) params.keyword = filter.keyword
    if (filter.status) params.status = filter.status
    if (filter.source) params.source = filter.source
    if (filter.assignedToId) params.assignedToId = filter.assignedToId
    params.page = filter.page ?? 0
    params.size = filter.size ?? 20
    return http.get('/customers', { params })
  },

  getStats(): Promise<{ data: CommonResponse<CustomerStats> }> {
    return http.get('/customers/stats')
  },

  getById(id: string): Promise<{ data: CommonResponse<CustomerResponse> }> {
    return http.get(`/customers/${id}`)
  },

  create(payload: Record<string, unknown>): Promise<{ data: CommonResponse<CustomerResponse> }> {
    return http.post('/customers', payload)
  },

  update(id: string, payload: Record<string, unknown>): Promise<{ data: CommonResponse<CustomerResponse> }> {
    return http.put(`/customers/${id}`, payload)
  },

  updateStatus(id: string, status: CustomerStatus): Promise<{ data: CommonResponse<CustomerResponse> }> {
    return http.patch(`/customers/${id}/status`, { status })
  },

  deleteById(id: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/customers/${id}`)
  },
}

export default customerService
