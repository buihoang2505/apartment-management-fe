import http from './http'
import type { DepartmentResponse } from '@/types/department'
import type { CommonResponse } from '@/types/common'

const departmentService = {
  getAll(): Promise<{ data: CommonResponse<DepartmentResponse[]> }> {
    return http.get('/departments')
  },

  getById(id: string): Promise<{ data: CommonResponse<DepartmentResponse> }> {
    return http.get(`/departments/${id}`)
  },

  create(payload: Record<string, unknown>): Promise<{ data: CommonResponse<DepartmentResponse> }> {
    return http.post('/departments', payload)
  },

  update(id: string, payload: Record<string, unknown>): Promise<{ data: CommonResponse<DepartmentResponse> }> {
    return http.put(`/departments/${id}`, payload)
  },

  deleteById(id: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/departments/${id}`)
  },
}

export default departmentService
