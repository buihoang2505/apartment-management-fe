export interface ZoneResponse {
  id: string
  name: string
  code: string
  description: string
  createdAt: string
}

export type Zone = ZoneResponse

export interface BuildingResponse {
  id: string
  zoneId: string
  zoneName: string
  name: string
  code: string
  type: 'CHUNG_CU' | 'SHOPHOUSE' | 'VILLAS' | 'OFFICETEL' | 'OTHER'
  totalFloors: number
  description: string
  createdAt: string
}

export type Building = BuildingResponse
