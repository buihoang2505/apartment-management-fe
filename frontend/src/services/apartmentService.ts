import http from './http'
import type { ApartmentResponse, ApartmentStatusHistoryResponse } from '@/types/apartment'
import type { CommonResponse, PageResponse, ImageResponse } from '@/types/common'

export interface ApartmentFilter {
  zoneId?: string
  buildingId?: string
  status?: string
  type?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
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
    if (filter.minArea != null) params.minArea = filter.minArea
    if (filter.maxArea != null) params.maxArea = filter.maxArea
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

  uploadImages(id: string, files: File[]): Promise<{ data: CommonResponse<ImageResponse[]> }> {
    const fd = new FormData()
    files.forEach(f => fd.append('files', f))
    // Do NOT set Content-Type manually — let axios/browser set it with the correct boundary
    return http.post(`/apartments/${id}/images`, fd)
  },

  deleteImage(id: string, imageId: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/apartments/${id}/images/${imageId}`)
  },

  reorderImages(id: string, imageIds: string[]): Promise<{ data: CommonResponse<void> }> {
    return http.patch(`/apartments/${id}/images/order`, { imageIds })
  },

  getStatusHistory(id: string): Promise<{ data: CommonResponse<ApartmentStatusHistoryResponse[]> }> {
    return http.get(`/apartments/${id}/status-history`)
  },

  move(id: string, payload: { newBuildingId: string; note?: string }): Promise<{ data: CommonResponse<ApartmentResponse> }> {
    return http.patch(`/apartments/${id}/move`, payload)
  },
}

export default apartmentService
