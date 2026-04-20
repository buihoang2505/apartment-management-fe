export type UserRole   = 'ADMIN' | 'MANAGER'

export interface AdminUserResponse {
  id: string
  username: string
  fullName?: string
  email: string
  phone?: string
  role: UserRole
  active: boolean
  createdAt: string
}
