import http from './http'
import type { AdminUserResponse } from '@/types/adminUser'
import type { CommonResponse } from '@/types/common'

const adminUserService = {
  getAll(): Promise<{ data: CommonResponse<AdminUserResponse[]> }> {
    return http.get('/admin/users')
  },

  create(payload: Record<string, unknown>): Promise<{ data: CommonResponse<AdminUserResponse> }> {
    return http.post('/admin/users', payload)
  },

  update(id: string, payload: Record<string, unknown>): Promise<{ data: CommonResponse<AdminUserResponse> }> {
    return http.put(`/admin/users/${id}`, payload)
  },

  deleteById(id: string): Promise<{ data: CommonResponse<void> }> {
    return http.delete(`/admin/users/${id}`)
  },

  resetPassword(id: string, newPassword: string): Promise<{ data: CommonResponse<void> }> {
    return http.patch(`/admin/users/${id}/reset-password`, { newPassword })
  },
}

export default adminUserService
