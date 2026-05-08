export type ContractType = 'RENT' | 'SALE'
export type ContractStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
export type PaymentScheduleStatus = 'PENDING' | 'PAID' | 'OVERDUE'

export interface PaymentScheduleResponse {
  id: string
  periodIndex: number
  dueDate: string
  amount: string | number
  paidAmount: string | number | null
  paidDate: string | null
  status: PaymentScheduleStatus
  note: string | null
}

export interface ContractResponse {
  id: string
  code: string
  type: ContractType
  status: ContractStatus
  apartmentId: string
  apartmentCode: string
  customerId: string
  customerName: string
  customerPhone: string
  startDate: string
  endDate: string | null
  signedDate: string | null
  totalAmount: string | number
  monthlyAmount: string | number | null
  depositAmount: string | number | null
  paidAmount: string | number
  outstandingAmount: string | number
  note: string | null
  schedules: PaymentScheduleResponse[]
}

export interface ContractFilter {
  keyword?: string
  type?: ContractType | ''
  status?: ContractStatus | ''
  page?: number
  size?: number
}

export interface ContractStats {
  total: number
  byStatus: Partial<Record<ContractStatus, number>>
  outstandingAmount: string | number
  overdueAmount: string | number
}
