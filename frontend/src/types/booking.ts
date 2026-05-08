export type BookingType = 'VIEWING' | 'CONSULTATION' | 'SIGNING' | 'MAINTENANCE' | 'OTHER'
export type BookingStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'

export interface BookingResponse {
  id: string
  title: string
  type: BookingType
  status: BookingStatus
  startTime: string
  endTime: string
  location: string | null
  customerId: string | null
  customerName: string | null
  customerPhone: string | null
  apartmentId: string | null
  apartmentCode: string | null
  assignedToId: string | null
  assignedToName: string | null
  note: string | null
}

export interface BookingFilter {
  from: string
  to: string
  type?: BookingType | ''
  status?: BookingStatus | ''
  assignedToId?: string
  customerId?: string
}
