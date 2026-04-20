import http from './http'
import type { EmployeeResponse, EmployeeFilter } from '@/types/employee'
import type { CommonResponse, PageResponse } from '@/types/common'

const employeeService = {
  getList(filter: EmployeeFilter = {}): Promise<{ data: CommonResponse<PageResponse<EmployeeResponse>> | EmployeeResponse[] }> {
    const params: Record<string, unknown> = {}
    if (filter.departmentId) params.departmentId = filter.departmentId
    if (filter.status) params.status = filter.status
    params.page = filter.page ?? 0
    params.size = filter.size ?? 20
    return http.get('/employees', { params })
  },

  create(payload: Record<string, unknown>): Promise<{ data: CommonResponse<EmployeeResponse> }> {
    return http.post('/employees', payload)
  },

  update(id: string, payload: Record<string, unknown>): Promise<{ data: CommonResponse<EmployeeResponse> }> {
    return http.put(`/employees/${id}`, payload)
  },

  deleteById(id: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/employees/${id}`)
  },
}

export default employeeService
