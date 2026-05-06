<template>
  <div class="notif-wrapper" ref="notifRef">

    <!-- Bell button + badge -->
    <button
      class="notif-btn w-9 h-9 rounded-[10px] hover:bg-[#F5F6FA] flex items-center justify-center transition-colors relative"
      title="Thông báo"
      @click="toggleDropdown"
    >
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M8.5 2a5 5 0 0 1 5 5v3l1 2H3l1-2V7a5 5 0 0 1 5-5Z" stroke="#6B7280" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M7 14a1.5 1.5 0 0 0 3 0" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </button>

    <!-- Dropdown -->
    <Transition name="notif-drop">
      <div v-if="isOpen" class="notif-dropdown">

        <!-- Header -->
        <div class="notif-header">
          <span>Thông báo</span>
          <button @click="markAllRead" class="mark-all">Đánh dấu tất cả đã đọc</button>
        </div>

        <!-- List -->
        <div class="notif-list">
          <template v-if="notifications.length > 0">
            <div
              v-for="notif in notifications"
              :key="notif.id"
              class="notif-item"
              :class="{ unread: !notif.isRead }"
              @click="onClickNotif(notif)"
            >
              <!-- Icon theo type -->
              <div class="notif-icon" :class="notif.type.toLowerCase()">
                <!-- APARTMENT -->
                <svg v-if="notif.type === 'APARTMENT'" width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M2 10.5L10 3.5l8 7V17a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-6.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  <rect x="7" y="13" width="6" height="5" rx="1" fill="currentColor" fill-opacity="0.5"/>
                </svg>
                <!-- EMPLOYEE -->
                <svg v-else-if="notif.type === 'EMPLOYEE'" width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2.5 18c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <!-- PORTFOLIO / default -->
                <svg v-else width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="5" width="16" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M6 5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2 10h16" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </div>

              <!-- Content -->
              <div class="notif-content">
                <p class="notif-title">{{ notif.title }}</p>
                <p class="notif-message">{{ notif.message }}</p>
                <p class="notif-time">{{ formatTime(notif.createdAt) }}</p>
              </div>

              <span v-if="!notif.isRead" class="unread-dot" />
            </div>
          </template>

          <div v-else class="notif-empty">
            Không có thông báo nào
          </div>
        </div>

        <!-- Footer -->
        <div class="notif-footer">
          <router-link to="/notifications" @click="isOpen = false">Xem tất cả</router-link>
        </div>

      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import notificationService, { type NotificationResponse } from '@/services/notificationService'

const router   = useRouter()
const isOpen   = ref(false)
const notifRef = ref<HTMLElement | null>(null)

const notifications = ref<NotificationResponse[]>([])
const unreadCount   = computed(() => notifications.value.filter(n => !n.isRead).length)

/* ── REST: load initial list ── */
async function loadNotifications() {
  try {
    const res = await notificationService.getAll()
    notifications.value = res.data.data ?? []
  } catch {
    // nếu endpoint chưa có, giữ list rỗng
  }
}

/* ── WebSocket: nhận realtime ── */
function onWsMessage(notif: NotificationResponse) {
  notifications.value.unshift(notif)
}

/* ── Actions ── */
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

async function markAllRead() {
  const snapshot = notifications.value.map(n => ({ id: n.id, isRead: n.isRead }))
  notifications.value.forEach(n => { n.isRead = true })
  window.dispatchEvent(new CustomEvent('notif:mark-all-read'))
  try {
    await notificationService.markAllRead()
  } catch {
    const map = new Map(snapshot.map(s => [s.id, s.isRead]))
    notifications.value.forEach(n => { n.isRead = map.get(n.id) ?? n.isRead })
  }
}

function onExternalMarkAllRead() {
  notifications.value.forEach(n => { n.isRead = true })
}
function onExternalMarkRead(e: Event) {
  const id = (e as CustomEvent<{ id: string }>).detail?.id
  if (!id) return
  const n = notifications.value.find(x => x.id === id)
  if (n) n.isRead = true
}
function onExternalRefresh() {
  loadNotifications()
}

async function onClickNotif(notif: NotificationResponse) {
  if (!notif.isRead) {
    notif.isRead = true
    window.dispatchEvent(new CustomEvent('notif:mark-read', { detail: { id: notif.id } }))
    try { await notificationService.markAsRead(notif.id) } catch { /* ignore */ }
  }
  isOpen.value = false
  if (notif.targetId) {
    if (notif.type === 'APARTMENT')       router.push(`/apartments/${notif.targetId}`)
    else if (notif.type === 'EMPLOYEE')   router.push(`/employees/${notif.targetId}`)
    else if (notif.type === 'PORTFOLIO')  router.push(`/portfolios/${notif.targetId}`)
  }
}

/* ── Helpers ── */
function formatTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return 'Vừa xong'
  if (mins < 60)  return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  return `${Math.floor(hours / 24)} ngày trước`
}

function onDocumentClick(e: MouseEvent) {
  if (notifRef.value && !notifRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  loadNotifications()
  notificationService.connect(onWsMessage)
  document.addEventListener('mousedown', onDocumentClick)
  window.addEventListener('notif:mark-all-read', onExternalMarkAllRead)
  window.addEventListener('notif:mark-read', onExternalMarkRead)
  window.addEventListener('notif:refresh', onExternalRefresh)
})

onUnmounted(() => {
  notificationService.disconnect()
  document.removeEventListener('mousedown', onDocumentClick)
  window.removeEventListener('notif:mark-all-read', onExternalMarkAllRead)
  window.removeEventListener('notif:mark-read', onExternalMarkRead)
  window.removeEventListener('notif:refresh', onExternalRefresh)
})
</script>

<style scoped>
.notif-wrapper { position: relative; }

.badge {
  position: absolute;
  top: 3px; right: 3px;
  background: #ef4444;
  color: white;
  font-size: 9px;
  font-weight: 700;
  border-radius: 999px;
  padding: 1px 4px;
  min-width: 15px;
  text-align: center;
  line-height: 1.4;
  border: 1.5px solid white;
}

.notif-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  max-width: calc(100vw - 24px);
  background: white;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13), 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  z-index: 1000;
  overflow: hidden;
}

@media (max-width: 480px) {
  .notif-dropdown {
    position: fixed;
    top: 68px;
    left: 12px;
    right: 12px;
    width: auto;
    max-width: none;
  }
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 16px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.mark-all {
  font-size: 12px;
  color: #c9a96e;
  cursor: pointer;
  transition: color 0.15s;
  background: none;
  border: none;
  padding: 0;
}
.mark-all:hover { color: #b8934d; }

.notif-list { max-height: 380px; overflow-y: auto; }
.notif-list::-webkit-scrollbar { width: 4px; }
.notif-list::-webkit-scrollbar-track { background: transparent; }
.notif-list::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}
.notif-item:hover   { background: #f9fafb; }
.notif-item.unread  { background: #f0f7ff; }
.notif-item.unread:hover { background: #e8f2ff; }

.notif-icon {
  width: 36px; height: 36px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.notif-icon.apartment { background: #dbeafe; color: #2563eb; }
.notif-icon.employee  { background: #dcfce7; color: #16a34a; }
.notif-icon.portfolio { background: #fef9c3; color: #ca8a04; }

.notif-content { flex: 1; min-width: 0; }
.notif-title   { font-size: 13px; font-weight: 600; color: #111827; line-height: 1.4; }
.notif-message { font-size: 12px; color: #6b7280; margin-top: 2px; line-height: 1.4; }
.notif-time    { font-size: 11px; color: #9ca3af; margin-top: 4px; }

.unread-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  flex-shrink: 0;
  margin-top: 5px;
}

.notif-footer {
  padding: 11px 16px;
  text-align: center;
  border-top: 1px solid #f3f4f6;
}
.notif-footer a {
  font-size: 13px;
  color: #c9a96e;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.notif-footer a:hover { color: #b8934d; }

.notif-empty {
  padding: 36px 16px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
}

/* Dropdown animation */
.notif-drop-enter-active,
.notif-drop-leave-active { transition: all 0.15s ease; }
.notif-drop-enter-from,
.notif-drop-leave-to     { opacity: 0; transform: translateY(-6px) scale(0.97); }
</style>
