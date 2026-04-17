export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

export interface CommonResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ImageResponse {
  id: string
  url: string
  label: string
  sortOrder: number
}
