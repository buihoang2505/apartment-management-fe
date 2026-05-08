import http from './http'
import type { CommonResponse } from '@/types/common'
import type { CustomerResponse, LeadSource } from '@/types/customer'

export interface PublicLeadPayload {
  fullName: string
  email?: string
  phone: string
  source?: LeadSource
  interestedApartmentId?: string
  note?: string
}

const publicLeadService = {
  register(payload: PublicLeadPayload): Promise<{ data: CommonResponse<CustomerResponse> }> {
    return http.post('/public/leads', payload)
  },
}

export default publicLeadService
