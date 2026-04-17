import http from './http'
import type { ApartmentResponse } from '@/types/apartment'
import type { CommonResponse, PageResponse } from '@/types/common'

export interface ApartmentFilter {
  zoneId?: string
  buildingId?: string
  status?: string
  type?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
}

const apartmentService = {
  getList(filter: ApartmentFilter = {}): Promise<{ data: CommonResponse<PageResponse<ApartmentResponse>> }> {
    const params: Record<string, unknown> = {}
    if (filter.zoneId) params.zoneId = filter.zoneId
    if (filter.buildingId) params.buildingId = filter.buildingId
    if (filter.status) params.status = filter.status
    if (filter.type) params.type = filter.type
    if (filter.search) params.search = filter.search
    if (filter.minPrice != null) params.minPrice = filter.minPrice
    if (filter.maxPrice != null) params.maxPrice = filter.maxPrice
    params.page = filter.page ?? 0
    params.size = filter.size ?? 20
    return http.get('/apartments', { params })
  },

  getById(id: string): Promise<{ data: CommonResponse<ApartmentResponse> }> {
    return http.get(`/apartments/${id}`)
  },

  getTypes(): Promise<{ data: CommonResponse<{ code: string; label: string }[]> }> {
    return http.get('/apartments/types')
  },

  create(payload: Record<string, unknown>): Promise<{ data: CommonResponse<ApartmentResponse> }> {
    return http.post('/apartments', payload)
  },

  update(id: string, payload: Record<string, unknown>): Promise<{ data: CommonResponse<ApartmentResponse> }> {
    return http.put(`/apartments/${id}`, payload)
  },

  deleteById(id: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/apartments/${id}`)
  },
}

export default apartmentService
