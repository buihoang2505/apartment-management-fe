export type ApartmentStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE'

export type ApartmentType = 'STUDIO' | 'ONE_BEDROOM' | 'TWO_BEDROOM' | 'THREE_BEDROOM' | 'PENTHOUSE'

export type FurnitureStatus = 'FULL' | 'PARTIAL' | 'NONE'

export interface Apartment {
  id: number
  code: string
  area: number
  price: number
  status: ApartmentStatus
  type: ApartmentType
  furniture: FurnitureStatus
  images: string[]
  zoneId: number
  portfolioId: number
  createdAt: string
  updatedAt: string
}
