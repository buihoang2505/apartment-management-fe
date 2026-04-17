import http from './http'
import type { Zone, BuildingResponse } from '@/types/zone'
import type { CommonResponse } from '@/types/common'

export interface CreateZoneRequest {
  name: string
  code: string
  description?: string
}

export interface UpdateZoneRequest {
  name: string
  code: string
  description?: string
}

export interface CreateBuildingRequest {
  name: string
  code: string
  type?: 'CHUNG_CU' | 'SHOPHOUSE' | 'VILLAS' | 'OFFICETEL' | 'OTHER'
  totalFloors?: number
  description?: string
}

export interface UpdateBuildingRequest {
  name: string
  code: string
  type?: 'CHUNG_CU' | 'SHOPHOUSE' | 'VILLAS' | 'OFFICETEL' | 'OTHER'
  totalFloors?: number
  description?: string
}

const zoneService = {
  getAll(): Promise<{ data: CommonResponse<Zone[]> }> {
    return http.get('/zones')
  },

  getById(id: string): Promise<{ data: CommonResponse<Zone> }> {
    return http.get(`/zones/${id}`)
  },

  create(payload: CreateZoneRequest): Promise<{ data: CommonResponse<Zone> }> {
    return http.post('/zones', payload)
  },

  update(id: string, payload: UpdateZoneRequest): Promise<{ data: CommonResponse<Zone> }> {
    return http.put(`/zones/${id}`, payload)
  },

  deleteById(id: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/zones/${id}`)
  },

  getBuildingsByZone(zoneId: string): Promise<{ data: CommonResponse<BuildingResponse[]> }> {
    return http.get(`/zones/${zoneId}/buildings`)
  },

  createBuilding(zoneId: string, payload: CreateBuildingRequest): Promise<{ data: CommonResponse<BuildingResponse> }> {
    return http.post(`/zones/${zoneId}/buildings`, payload)
  },

  updateBuilding(buildingId: string, payload: UpdateBuildingRequest): Promise<{ data: CommonResponse<BuildingResponse> }> {
    return http.put(`/zones/buildings/${buildingId}`, payload)
  },

  deleteBuilding(buildingId: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/zones/buildings/${buildingId}`)
  },
}

export default zoneService
