export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
