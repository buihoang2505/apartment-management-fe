<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-[#0F2E4A]">Thông báo</h1>
        <p class="text-[#7A9AAD] text-sm mt-0.5">
          {{ totalElements.toLocaleString('vi') }} thông báo
          <span v-if="unreadCount > 0" class="text-[#A8845A] font-medium">· {{ unreadCount }} chưa đọc</span>
        </p>
      </div>
      <button
        v-if="unreadCount > 0"
        @click="markAll"
        :disabled="markingAll"
        class="self-start sm:self-auto flex items-center gap-2 bg-white border border-[#E8EFF5] text-[#414A4D] hover:border-[#A8845A] hover:text-[#A8845A] text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2 6.5l3 3 6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ markingAll ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc' }}
      </button>
    </div>

    <!-- Filter chips -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="t in typeChips"
        :key="t.value"
        @click="setType(t.value)"
        class="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border"
        :class="filter.type === t.value
          ? 'bg-[#0F2E4A] text-white border-[#0F2E4A]'
          : 'bg-white text-[#414A4D] border-[#E8EFF5] hover:border-[#0F2E4A]'"
      >
        {{ t.label }}
      </button>

      <span class="mx-1 h-5 w-px bg-[#E8EFF5]" />

      <button
        @click="toggleUnread"
        class="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border flex items-center gap-1.5"
        :class="filter.unreadOnly
          ? 'bg-[#A8845A] text-white border-[#A8845A]'
          : 'bg-white text-[#414A4D] border-[#E8EFF5] hover:border-[#A8845A]'"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="filter.unreadOnly ? 'bg-white' : 'bg-[#A8845A]'" />
        Chỉ chưa đọc
      </button>
    </div>

    <!-- List -->
    <div v-if="loadingFirstPage" class="flex items-center justify-center py-16">
      <svg class="animate-spin text-[#A8845A]" width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="currentColor" stroke-width="2.5" stroke-dasharray="32 40"/>
      </svg>
    </div>

    <div v-else-if="!notifications.length" class="bg-white rounded-2xl border border-[#E8EFF5] py-16 flex flex-col items-center text-center px-6">
      <div class="w-16 h-16 rounded-2xl bg-[#F6F9FB] flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 3a8 8 0 0 1 8 8v5l1.5 3H4.5L6 16v-5a8 8 0 0 1 8-8z" stroke="#A9B8A8" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M11 22a3 3 0 0 0 6 0" stroke="#A9B8A8" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="text-[#414A4D] font-semibold">Chưa có thông báo nào</p>
      <p class="text-[#7A9AAD] text-sm mt-1">{{ filter.unreadOnly || filter.type ? 'Thử bỏ bộ lọc để xem nhiều thông báo hơn.' : 'Khi có hoạt động mới, bạn sẽ thấy ở đây.' }}</p>
    </div>

    <div v-else class="bg-white rounded-2xl border border-[#E8EFF5] divide-y divide-[#F0F4F8] overflow-hidden">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="flex items-start gap-3 px-4 sm:px-5 py-4 cursor-pointer transition-colors"
        :class="n.isRead ? 'hover:bg-[#F9FBFC]' : 'bg-[#F0F7FF] hover:bg-[#E8F2FF]'"
        @click="onClickItem(n)"
      >
        <div class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" :class="iconWrapClass(n.type)">
          <component :is="iconFor(n.type)" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start gap-2">
            <p class="font-semibold text-[#111827] text-sm flex-1 min-w-0">{{ n.title }}</p>
            <span v-if="!n.isRead" class="mt-1.5 w-2 h-2 rounded-full bg-[#3B82F6] flex-shrink-0" />
          </div>
          <p class="text-[#6B7280] text-xs mt-0.5 line-clamp-2">{{ n.message }}</p>
          <div class="flex items-center gap-2 mt-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md" :class="typeBadgeClass(n.type)">
              {{ typeLabel(n.type) }}
            </span>
            <span class="text-[#9CA3AF] text-[11px]">{{ formatTime(n.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Sentinel for infinite scroll -->
      <div ref="sentinelRef" class="py-4 flex items-center justify-center">
        <svg v-if="loadingMore" class="animate-spin text-[#A8845A]" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="22 28"/>
        </svg>
        <span v-else-if="!hasMore" class="text-[#A9B8A8] text-xs">Đã hết</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import notificationService, { type NotificationResponse, type NotificationType } from '@/services/notificationService'

const router = useRouter()

type TypeFilter = NotificationType | ''

const typeChips: Array<{ value: TypeFilter; label: string }> = [
  { value: '', label: 'Tất cả' },
  { value: 'APARTMENT', label: 'Căn hộ' },
  { value: 'EMPLOYEE', label: 'Nhân viên' },
  { value: 'PORTFOLIO', label: 'Phân khu' },
]

const filter = reactive({
  type: '' as TypeFilter,
  unreadOnly: false,
})

const PAGE_SIZE = 20
const notifications = ref<NotificationResponse[]>([])
const page = ref(0)
const totalPages = ref(0)
const totalElements = ref(0)
const loadingFirstPage = ref(true)
const loadingMore = ref(false)
const markingAll = ref(false)

const hasMore = computed(() => page.value < totalPages.value - 1)
const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

async function fetchPage(reset = false) {
  if (reset) {
    page.value = 0
    notifications.value = []
    loadingFirstPage.value = true
  } else {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
  }

  try {
    const res = await notificationService.getPage({
      type: filter.type || undefined,
      unreadOnly: filter.unreadOnly,
      page: page.value,
      size: PAGE_SIZE,
    })
    const data = res.data.data
    notifications.value = reset ? data.content : [...notifications.value, ...data.content]
    totalPages.value = data.totalPages
    totalElements.value = Number(data.totalElements)
  } catch {
    // silent
  } finally {
    loadingFirstPage.value = false
    loadingMore.value = false
  }
}

function setType(value: TypeFilter) {
  if (filter.type === value) return
  filter.type = value
}
function toggleUnread() {
  filter.unreadOnly = !filter.unreadOnly
}

watch(() => [filter.type, filter.unreadOnly], () => fetchPage(true))

async function loadNextPage() {
  if (!hasMore.value || loadingMore.value) return
  page.value++
  await fetchPage(false)
}

function setupObserver() {
  observer?.disconnect()
  if (!sentinelRef.value) return
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadNextPage()
  }, { rootMargin: '120px' })
  observer.observe(sentinelRef.value)
}

watch(sentinelRef, () => setupObserver())

async function onClickItem(n: NotificationResponse) {
  if (!n.isRead) {
    n.isRead = true
    window.dispatchEvent(new CustomEvent('notif:mark-read', { detail: { id: n.id } }))
    try { await notificationService.markAsRead(n.id) } catch { /* ignore */ }
  }
  if (n.targetId) {
    if (n.type === 'APARTMENT')      router.push(`/apartments/${n.targetId}`)
    else if (n.type === 'EMPLOYEE')  router.push(`/employees/${n.targetId}`)
    else if (n.type === 'PORTFOLIO') router.push(`/portfolios/${n.targetId}`)
  }
}

async function markAll() {
  if (markingAll.value || unreadCount.value === 0) return
  markingAll.value = true
  // Optimistic: cập nhật local trước
  const snapshot = notifications.value.map(n => ({ id: n.id, isRead: n.isRead }))
  notifications.value.forEach(n => { n.isRead = true })
  window.dispatchEvent(new CustomEvent('notif:mark-all-read'))
  try {
    await notificationService.markAllRead()
    if (filter.unreadOnly) await fetchPage(true)
  } catch {
    // Rollback nếu BE fail
    const map = new Map(snapshot.map(s => [s.id, s.isRead]))
    notifications.value.forEach(n => { n.isRead = map.get(n.id) ?? n.isRead })
    window.dispatchEvent(new CustomEvent('notif:refresh'))
  } finally {
    markingAll.value = false
  }
}

const ApartmentIcon = defineComponent({ render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none' }, [
  h('path', { d: 'M2 10.5L10 3.5l8 7V17a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-6.5Z', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linejoin': 'round' }),
  h('rect', { x: 7, y: 13, width: 6, height: 5, rx: 1, fill: 'currentColor', 'fill-opacity': 0.5 }),
])})
const EmployeeIcon = defineComponent({ render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none' }, [
  h('circle', { cx: 10, cy: 7, r: 4, stroke: 'currentColor', 'stroke-width': '1.5' }),
  h('path', { d: 'M2.5 18c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round' }),
])})
const PortfolioIcon = defineComponent({ render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none' }, [
  h('rect', { x: 2, y: 5, width: 16, height: 12, rx: 1.5, stroke: 'currentColor', 'stroke-width': '1.5' }),
  h('path', { d: 'M6 5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1', stroke: 'currentColor', 'stroke-width': '1.5' }),
  h('path', { d: 'M2 10h16', stroke: 'currentColor', 'stroke-width': '1.5' }),
])})

const TYPE_META: Record<NotificationType, { label: string; classes: string; icon: ReturnType<typeof defineComponent> }> = {
  APARTMENT: { label: 'Căn hộ',    classes: 'bg-[#DBEAFE] text-[#2563EB]', icon: ApartmentIcon },
  EMPLOYEE:  { label: 'Nhân viên', classes: 'bg-[#DCFCE7] text-[#16A34A]', icon: EmployeeIcon  },
  PORTFOLIO: { label: 'Phân khu',  classes: 'bg-[#FEF9C3] text-[#CA8A04]', icon: PortfolioIcon },
}
function typeLabel(t: NotificationType)      { return TYPE_META[t].label }
function typeBadgeClass(t: NotificationType) { return TYPE_META[t].classes }
function iconWrapClass(t: NotificationType)  { return TYPE_META[t].classes }
function iconFor(t: NotificationType)        { return TYPE_META[t].icon }

function formatTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(() => fetchPage(true))
onUnmounted(() => observer?.disconnect())
</script>
