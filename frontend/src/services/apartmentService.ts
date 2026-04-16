import http from './http'
import type { Apartment } from '@/types/apartment'
import type { PageResponse } from '@/types/common'

const apartmentService = {
  getList(_params?: Record<string, unknown>): Promise<{ data: PageResponse<Apartment> }> {
    // TODO: implement
    return http.get('/apartments', { params: _params })
  },

  getById(_id: number): Promise<{ data: Apartment }> {
    // TODO: implement
    return http.get(`/apartments/${_id}`)
  },
}

export default apartmentService
