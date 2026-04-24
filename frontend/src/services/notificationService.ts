import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import http from './http'
import type { CommonResponse } from '@/types/common'

export interface NotificationResponse {
  id: string
  title: string
  message: string
  type: 'APARTMENT' | 'EMPLOYEE' | 'PORTFOLIO'
  isRead: boolean
  targetId?: string
  createdAt: string
}

let stompClient: Client | null = null

const WS_URL = import.meta.env.VITE_WS_BASE_URL ?? 'http://localhost:8080/api/ws'

const notificationService = {
  getAll(): Promise<{ data: CommonResponse<NotificationResponse[]> }> {
    return http.get('/notifications')
  },

  markAsRead(id: string): Promise<{ data: CommonResponse<void> }> {
    return http.put(`/notifications/${id}/read`)
  },

  markAllRead(): Promise<{ data: CommonResponse<void> }> {
    return http.put('/notifications/read-all')
  },

  connect(onMessage: (notif: NotificationResponse) => void): void {
    if (stompClient?.active) {
      return
    }

    const token = localStorage.getItem('token')
    const connectHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
    const wsUrlWithToken = token ? `${WS_URL}?token=${token}` : WS_URL

    stompClient = new Client({
      // SockJS factory — /api/ws + SockJS suffix handling
      webSocketFactory: () => new SockJS(wsUrlWithToken),
      connectHeaders,
      reconnectDelay: 0,
      onConnect() {
        stompClient!.subscribe('/topic/notifications', (frame) => {
          try {
            const notif: NotificationResponse = JSON.parse(frame.body)
            onMessage(notif)
          } catch {
            // malformed frame — ignore
          }
        })
      },
      onStompError(frame) {
        console.error('STOMP error:', frame.headers['message'] ?? frame.body)
      },
      onWebSocketError(error) {
        console.error('WebSocket error:', error)
      },
    })

    stompClient.activate()
  },

  disconnect(): void {
    stompClient?.deactivate()
    stompClient = null
  },
}

export default notificationService
