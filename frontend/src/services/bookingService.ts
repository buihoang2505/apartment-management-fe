import http from './http'
import type { BookingResponse, BookingFilter, BookingStatus } from '@/types/booking'
import type { CommonResponse } from '@/types/common'

const bookingService = {
  getList(filter: BookingFilter): Promise<{ data: CommonResponse<BookingResponse[]> }> {
    const params: Record<string, unknown> = {
      from: filter.from,
      to: filter.to,
    }
    if (filter.type) params.type = filter.type
    if (filter.status) params.status = filter.status
    if (filter.assignedToId) params.assignedToId = filter.assignedToId
    if (filter.customerId) params.customerId = filter.customerId
    return http.get('/bookings', { params })
  },

  getById(id: string): Promise<{ data: CommonResponse<BookingResponse> }> {
    return http.get(`/bookings/${id}`)
  },

  create(payload: Record<string, unknown>): Promise<{ data: CommonResponse<BookingResponse> }> {
    return http.post('/bookings', payload)
  },

  update(id: string, payload: Record<string, unknown>): Promise<{ data: CommonResponse<BookingResponse> }> {
    return http.put(`/bookings/${id}`, payload)
  },

  updateStatus(id: string, status: BookingStatus): Promise<{ data: CommonResponse<BookingResponse> }> {
    return http.patch(`/bookings/${id}/status`, { status })
  },

  deleteById(id: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/bookings/${id}`)
  },
}

export default bookingService
