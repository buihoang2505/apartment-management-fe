import http from './http'
import type { LoginRequest, TokenResponse } from '@/types/auth'
import type { CommonResponse } from '@/types/common'
import type { AdminUserResponse } from '@/types/adminUser'

const authService = {
  login(credentials: LoginRequest): Promise<{ data: CommonResponse<TokenResponse> }> {
    return http.post('/auth/login', credentials)
  },

  getMe(): Promise<{ data: CommonResponse<AdminUserResponse> }> {
    return http.get('/admin/users/me')
  },

  changePassword(payload: { currentPassword: string; newPassword: string }): Promise<{ data: CommonResponse<void> }> {
    return http.patch('/users/me/change-password', payload)
  },
}

export default authService
