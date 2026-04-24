export type UserRole = 'ADMIN' | 'MANAGER'

export interface AdminUserResponse {
  id: string
  username: string
  fullName?: string
  email: string
  phone?: string
  role: UserRole
  active: boolean
  avatarUrl?: string
  createdAt: string
  headline?: string
  biography?: string
  language?: string
  website?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  tiktok?: string
  github?: string
}
