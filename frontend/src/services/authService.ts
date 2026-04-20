import http from './http'
import type { LoginRequest, TokenResponse, User } from '@/types/auth'
import type { CommonResponse } from '@/types/common'

const authService = {
  login(credentials: LoginRequest): Promise<{ data: CommonResponse<TokenResponse> }> {
    return http.post('/auth/login', credentials)
  },

  getMe(): Promise<{ data: CommonResponse<User> }> {
    return http.get('/admin/users/me')
  },
}

export default authService
