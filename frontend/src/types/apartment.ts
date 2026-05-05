import type { ImageResponse } from './common'

export type ApartmentStatus = 'DANG_BAN' | 'DA_COC' | 'DA_BAN' | 'GIU_CHO' | 'KHOA'

export type ApartmentType =
  | 'STUDIO'
  | 'ONE_BEDROOM'
  | 'TWO_BEDROOM'
  | 'TWO_BEDROOM_PLUS'
  | 'THREE_BEDROOM'
  | 'THREE_BEDROOM_PLUS'
  | 'PENTHOUSE'
  | 'DUPLEX'
  | 'OTHER'

export interface ApartmentStatusHistoryResponse {
  id: string
  oldStatus: ApartmentStatus | null
  newStatus: ApartmentStatus
  changedBy: string
  note: string
  createdAt: string
}

export interface ApartmentResponse {
  id: string
  unitCode: string
  displayCode: string
  area: number
  sellingPrice: number
  tax: number
  status: ApartmentStatus
  furnitureDescription: string
  apartmentType: ApartmentType
  floorNumber: number
  direction: string
  bedroomCount: number
  buildingId: string
  buildingName: string
  buildingCode: string
  zoneId: string
  zoneName: string
  images: ImageResponse[]
  createdAt: string
  updatedAt: string
}

export type Apartment = ApartmentResponse
