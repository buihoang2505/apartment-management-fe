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

  resetPassword(id: string, payload: { currentPassword?: string; newPassword: string }): Promise<{ data: CommonResponse<void> }> {
    return http.patch(`/admin/users/${id}/reset-password`, payload)
  },

  uploadAvatar(id: string, file: File): Promise<{ data: CommonResponse<{ avatarUrl: string }> }> {
    const fd = new FormData()
    fd.append('file', file)
    // Do NOT set Content-Type manually — let axios/browser set it with the correct boundary
    return http.post(`/admin/users/${id}/avatar`, fd)
  },
}

export default adminUserService
