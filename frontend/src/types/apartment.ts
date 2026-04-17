import type { ImageResponse } from './common'

export type ApartmentStatus = 'DANG_BAN' | 'DA_COC' | 'DA_BAN' | 'GIU_CHO' | 'KHOA'

export type ApartmentType =
  | 'STUDIO'
  | 'ONE_BR'
  | 'TWO_BR'
  | 'TWO_BR_PLUS'
  | 'THREE_BR'
  | 'THREE_BR_PLUS'
  | 'PENTHOUSE'
  | 'DUPLEX'
  | 'OTHER'

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
