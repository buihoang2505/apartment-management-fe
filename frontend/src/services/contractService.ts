import http from './http'
import type {
  ContractResponse,
  ContractFilter,
  ContractStats,
  ContractStatus,
  PaymentScheduleResponse,
} from '@/types/contract'
import type { CommonResponse, PageResponse } from '@/types/common'

const contractService = {
  getList(filter: ContractFilter = {}): Promise<{
    data: CommonResponse<PageResponse<ContractResponse>> | ContractResponse[]
  }> {
    const params: Record<string, unknown> = {}
    if (filter.keyword) params.keyword = filter.keyword
    if (filter.type) params.type = filter.type
    if (filter.status) params.status = filter.status
    params.page = filter.page ?? 0
    params.size = filter.size ?? 20
    return http.get('/contracts', { params })
  },

  getStats(): Promise<{ data: CommonResponse<ContractStats> }> {
    return http.get('/contracts/stats')
  },

  getById(id: string): Promise<{ data: CommonResponse<ContractResponse> }> {
    return http.get(`/contracts/${id}`)
  },

  create(payload: Record<string, unknown>): Promise<{ data: CommonResponse<ContractResponse> }> {
    return http.post('/contracts', payload)
  },

  updateStatus(id: string, status: ContractStatus): Promise<{ data: CommonResponse<ContractResponse> }> {
    return http.patch(`/contracts/${id}/status`, { status })
  },

  deleteById(id: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/contracts/${id}`)
  },

  addSchedule(contractId: string, payload: { dueDate: string; amount: number; note?: string })
      : Promise<{ data: CommonResponse<PaymentScheduleResponse> }> {
    return http.post(`/contracts/${contractId}/schedules`, payload)
  },

  markPaid(scheduleId: string, payload: { paidAmount?: number; paidDate?: string; note?: string })
      : Promise<{ data: CommonResponse<PaymentScheduleResponse> }> {
    return http.patch(`/contracts/schedules/${scheduleId}/pay`, payload)
  },

  deleteSchedule(scheduleId: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/contracts/schedules/${scheduleId}`)
  },
}

export default contractService
