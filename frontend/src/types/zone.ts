export interface Zone {
  id: number
  code: string
  name: string
  portfolioId: number
}

export interface Building {
  id: number
  code: string
  name: string
  zoneId: number
  floors: number
}
