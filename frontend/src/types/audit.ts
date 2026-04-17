export interface AuditLogResponse {
  id: string
  username: string
  action: string
  entityType: string
  entityId: string
  oldValue: string
  newValue: string
  ipAddress: string
  createdAt: string
}
