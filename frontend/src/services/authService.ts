import http from './http'
import type { LoginRequest, TokenResponse } from '@/types/auth'
import type { CommonResponse } from '@/types/common'

const authService = {
  login(credentials: LoginRequest): Promise<{ data: CommonResponse<TokenResponse> }> {
    return http.post('/auth/login', credentials)
  },
}

export default authService
