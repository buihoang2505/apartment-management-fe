export interface LoginRequest {
  username: string
  password: string
}

// Backend trả về TokenResponse (không có User object riêng)
export interface TokenResponse {
  token: string
  username: string
  role: string
  expiresIn: number
}

// Alias cho compatibility
export type LoginResponse = TokenResponse

export interface User {
  username: string
  role: string
}
