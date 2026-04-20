export type EmployeeStatus = 'ACTIVE' | 'INACTIVE'

export interface EmployeeResponse {
  id: string
  fullName: string
  email: string
  phone?: string
  position?: string
  status: EmployeeStatus
  departmentId?: string
  departmentName?: string
  createdAt: string
  updatedAt: string
}

export interface EmployeeFilter {
  departmentId?: string
  status?: EmployeeStatus | ''
  page?: number
  size?: number
}
