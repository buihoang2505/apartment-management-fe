import http from './http'
import type { LoginRequest, LoginResponse } from '@/types/auth'

const authService = {
  login(_credentials: LoginRequest): Promise<{ data: LoginResponse }> {
    // TODO: implement
    return http.post('/auth/login', _credentials)
  },

  logout(): Promise<void> {
    // TODO: implement
    return http.post('/auth/logout')
  },
}

export default authService
