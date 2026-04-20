import http from './http'
import type { CommonResponse, PageResponse } from '@/types/common'
import type { AuditLogResponse } from '@/types/audit'

const auditService = {
  getAll(page = 0, size = 500): Promise<{ data: CommonResponse<PageResponse<AuditLogResponse>> }> {
    return http.get('/admin/audit-logs', { params: { page, size } })
  },
}

export default auditService
