export type CustomerStatus =
  | 'NEW'
  | 'CONTACTING'
  | 'INTERESTED'
  | 'NEGOTIATING'
  | 'WON'
  | 'LOST'

export type LeadSource =
  | 'WEBSITE'
  | 'FACEBOOK'
  | 'ZALO'
  | 'REFERRAL'
  | 'WALK_IN'
  | 'OTHER'

export interface CustomerResponse {
  id: string
  fullName: string
  email?: string
  phone?: string
  source: LeadSource
  status: CustomerStatus
  assignedToId?: string
  assignedToName?: string
  interestedApartmentId?: string
  interestedApartmentCode?: string
  note?: string
  createdAt: string
  updatedAt: string
}

export interface CustomerFilter {
  keyword?: string
  status?: CustomerStatus | ''
  source?: LeadSource | ''
  assignedToId?: string
  page?: number
  size?: number
}

export interface CustomerStats {
  total: number
  byStatus: Partial<Record<CustomerStatus, number>>
}
