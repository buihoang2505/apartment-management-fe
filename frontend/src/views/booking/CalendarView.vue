<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-[#0F2E4A]">Lịch hẹn</h1>
        <p class="text-sm text-[#414A4D]/60 mt-1">Lịch xem nhà, tư vấn, ký hợp đồng, bảo trì</p>
      </div>
      <button
        @click="openCreate(null)"
        class="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] text-white text-sm font-medium rounded-xl transition"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tạo lịch hẹn
      </button>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-wrap gap-2 sm:gap-3 items-center">
      <div class="flex items-center bg-white border border-[#DDE8EF] rounded-xl">
        <button @click="navMonth(-1)" class="px-3 py-2 hover:bg-[#F6F9FB] rounded-l-xl">‹</button>
        <span class="px-4 py-2 text-sm font-medium text-[#0F2E4A] min-w-[140px] text-center">
          {{ monthLabel }}
        </span>
        <button @click="navMonth(1)" class="px-3 py-2 hover:bg-[#F6F9FB] rounded-r-xl">›</button>
      </div>
      <button @click="goToday" class="px-3 py-2 text-sm text-[#A8845A] hover:bg-[#FFF8F2] border border-[#DDE8EF] rounded-xl">Hôm nay</button>

      <select v-model="filterType" @change="fetchBookings" class="px-3 py-2 bg-white border border-[#DDE8EF] rounded-xl text-sm">
        <option value="">Tất cả loại</option>
        <option v-for="t in TYPE_ORDER" :key="t" :value="t">{{ TYPE_META[t].label }}</option>
      </select>
      <select v-model="filterStatus" @change="fetchBookings" class="px-3 py-2 bg-white border border-[#DDE8EF] rounded-xl text-sm">
        <option value="">Tất cả trạng thái</option>
        <option v-for="s in STATUS_ORDER" :key="s" :value="s">{{ STATUS_META[s].label }}</option>
      </select>
    </div>

    <!-- Calendar grid -->
    <div class="bg-white rounded-2xl border border-[#DDE8EF] overflow-hidden">
      <div class="grid grid-cols-7 bg-[#F6F9FB] text-center text-xs font-medium text-[#414A4D]/70 uppercase">
        <div v-for="d in WEEKDAY_LABELS" :key="d" class="py-2">{{ d }}</div>
      </div>
      <div class="grid grid-cols-7">
        <div
          v-for="(cell, idx) in calendarCells"
          :key="idx"
          @click="selectDay(cell.date)"
          class="min-h-[88px] sm:min-h-[110px] border-t border-r border-[#F0F5F9] p-1.5 cursor-pointer hover:bg-[#F6F9FB] transition relative"
          :class="[
            !cell.inMonth && 'bg-[#FAFBFC] text-[#414A4D]/30',
            isSameDay(cell.date, today) && 'bg-[#FFF8F2]',
            selectedDay && isSameDay(cell.date, selectedDay) && 'ring-2 ring-[#A8845A] ring-inset',
          ]"
        >
          <p class="text-xs font-medium" :class="isSameDay(cell.date, today) ? 'text-[#A8845A]' : 'text-[#0F2E4A]'">
            {{ cell.date.getDate() }}
          </p>
          <div class="mt-1 space-y-1">
            <div
              v-for="b in cell.bookings.slice(0, 3)"
              :key="b.id"
              class="truncate text-[10px] sm:text-xs px-1.5 py-0.5 rounded text-white font-medium"
              :class="TYPE_META[b.type].bg"
              @click.stop="openEdit(b)"
            >
              {{ formatTime(b.startTime) }} {{ b.title }}
            </div>
            <p v-if="cell.bookings.length > 3" class="text-[10px] text-[#414A4D]/50 px-1">+{{ cell.bookings.length - 3 }} nữa</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Side panel: events of selected day -->
    <div v-if="selectedDay" class="bg-white rounded-2xl border border-[#DDE8EF] p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-[#0F2E4A]">
          {{ formatDateLabel(selectedDay) }} — {{ selectedDayBookings.length }} lịch hẹn
        </h2>
        <button @click="openCreate(selectedDay)" class="text-sm text-[#A8845A] hover:underline font-medium">+ Thêm</button>
      </div>
      <div v-if="selectedDayBookings.length === 0" class="text-center text-sm text-[#414A4D]/50 py-6">
        Không có lịch nào trong ngày
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="b in selectedDayBookings"
          :key="b.id"
          class="flex items-start gap-3 p-3 border border-[#F0F5F9] rounded-xl hover:bg-[#F6F9FB] cursor-pointer transition"
          @click="openEdit(b)"
        >
          <div class="w-1 self-stretch rounded" :class="TYPE_META[b.type].bg" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-medium text-sm text-[#0F2E4A]">{{ b.title }}</p>
              <span class="text-xs px-2 py-0.5 rounded-full" :class="TYPE_META[b.type].badge">
                {{ TYPE_META[b.type].label }}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full" :class="STATUS_META[b.status].badge">
                {{ STATUS_META[b.status].label }}
              </span>
            </div>
            <p class="text-xs text-[#414A4D]/60 mt-1">
              {{ formatTime(b.startTime) }} – {{ formatTime(b.endTime) }}
              <span v-if="b.location"> · {{ b.location }}</span>
            </p>
            <div class="flex flex-wrap gap-3 mt-1 text-xs text-[#414A4D]/60">
              <span v-if="b.customerName">👤 {{ b.customerName }}</span>
              <span v-if="b.apartmentCode">🏠 {{ b.apartmentCode }}</span>
              <span v-if="b.assignedToName">🧑‍💼 {{ b.assignedToName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#DDE8EF] sticky top-0 bg-white z-10">
            <h2 class="text-base font-semibold text-[#0F2E4A]">
              {{ editingId ? 'Chỉnh sửa lịch hẹn' : 'Tạo lịch hẹn mới' }}
            </h2>
            <button @click="closeModal" class="p-1 text-[#414A4D]/40 hover:text-[#414A4D] rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="submitForm" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Tiêu đề <span class="text-red-500">*</span></label>
              <input v-model="form.title" type="text" placeholder="Xem căn A-1203" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" :class="{ 'border-red-400': errors.title }" />
              <p v-if="errors.title" class="text-xs text-red-500 mt-1">{{ errors.title }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Loại</label>
                <select v-model="form.type" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm">
                  <option v-for="t in TYPE_ORDER" :key="t" :value="t">{{ TYPE_META[t].label }}</option>
                </select>
              </div>
              <div v-if="editingId">
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Trạng thái</label>
                <select v-model="form.status" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm">
                  <option v-for="s in STATUS_ORDER" :key="s" :value="s">{{ STATUS_META[s].label }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Bắt đầu <span class="text-red-500">*</span></label>
                <input v-model="form.startTime" type="datetime-local" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm" :class="{ 'border-red-400': errors.startTime }" />
                <p v-if="errors.startTime" class="text-xs text-red-500 mt-1">{{ errors.startTime }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Kết thúc <span class="text-red-500">*</span></label>
                <input v-model="form.endTime" type="datetime-local" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm" :class="{ 'border-red-400': errors.endTime }" />
                <p v-if="errors.endTime" class="text-xs text-red-500 mt-1">{{ errors.endTime }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Địa điểm</label>
              <input v-model="form.location" type="text" placeholder="Văn phòng / địa chỉ căn hộ..." class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm" />
            </div>

            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Khách hàng</label>
              <select v-model="form.customerId" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm">
                <option value="">— Không gán —</option>
                <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.fullName }} — {{ c.phone }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Căn hộ</label>
              <select v-model="form.apartmentId" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm">
                <option value="">— Không gán —</option>
                <option v-for="a in apartments" :key="a.id" :value="a.id">{{ a.unitCode }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Nhân viên phụ trách</label>
              <select v-model="form.assignedToId" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm">
                <option value="">— Chưa phân công —</option>
                <option v-for="e in employees" :key="e.id" :value="e.id">{{ e.fullName }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Ghi chú</label>
              <textarea v-model="form.note" rows="2" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm resize-none" />
            </div>

            <p v-if="submitError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ submitError }}</p>

            <div class="flex gap-3 pt-2">
              <button v-if="editingId" type="button" @click="confirmDelete" class="px-4 py-2.5 border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-50 transition">Xoá</button>
              <button type="button" @click="closeModal" class="flex-1 px-4 py-2.5 border border-[#DDE8EF] text-[#414A4D] text-sm rounded-xl hover:bg-[#F6F9FB]">Huỷ</button>
              <button type="submit" :disabled="submitting" class="flex-1 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm rounded-xl flex items-center justify-center gap-2">
                <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {{ editingId ? 'Lưu' : 'Tạo' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast" class="fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl text-white text-sm shadow-xl"
             :class="toast.type === 'success' ? 'bg-[#0F2E4A]' : 'bg-red-500'">
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import bookingService from '@/services/bookingService'
import customerService from '@/services/customerService'
import employeeService from '@/services/employeeService'
import http from '@/services/http'
import type { BookingResponse, BookingType, BookingStatus } from '@/types/booking'
import type { CustomerResponse } from '@/types/customer'
import type { EmployeeResponse } from '@/types/employee'

const TYPE_ORDER: BookingType[] = ['VIEWING', 'CONSULTATION', 'SIGNING', 'MAINTENANCE', 'OTHER']
const TYPE_META: Record<BookingType, { label: string; bg: string; badge: string }> = {
  VIEWING:      { label: 'Xem nhà',     bg: 'bg-[#2563EB]',          badge: 'bg-[#DBEAFE] text-[#2563EB]' },
  CONSULTATION: { label: 'Tư vấn',       bg: 'bg-[#A8845A]',          badge: 'bg-[#FFF1E0] text-[#A8845A]' },
  SIGNING:      { label: 'Ký hợp đồng',  bg: 'bg-[#16A34A]',          badge: 'bg-[#DCFCE7] text-[#16A34A]' },
  MAINTENANCE:  { label: 'Bảo trì',      bg: 'bg-[#7C3AED]',          badge: 'bg-[#EDE9FE] text-[#7C3AED]' },
  OTHER:        { label: 'Khác',         bg: 'bg-[#414A4D]',          badge: 'bg-[#414A4D]/10 text-[#414A4D]/70' },
}

const STATUS_ORDER: BookingStatus[] = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
const STATUS_META: Record<BookingStatus, { label: string; badge: string }> = {
  SCHEDULED: { label: 'Đã đặt',     badge: 'bg-[#FEF9C3] text-[#CA8A04]' },
  CONFIRMED: { label: 'Đã xác nhận', badge: 'bg-[#DBEAFE] text-[#2563EB]' },
  COMPLETED: { label: 'Hoàn tất',    badge: 'bg-[#DCFCE7] text-[#16A34A]' },
  CANCELLED: { label: 'Đã huỷ',      badge: 'bg-red-50 text-red-600' },
  NO_SHOW:   { label: 'Vắng mặt',    badge: 'bg-[#414A4D]/10 text-[#414A4D]/70' },
}

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

const today = new Date()
today.setHours(0, 0, 0, 0)

const cursor = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const bookings = ref<BookingResponse[]>([])
const selectedDay = ref<Date | null>(today)
const filterType = ref<BookingType | ''>('')
const filterStatus = ref<BookingStatus | ''>('')

const customers = ref<CustomerResponse[]>([])
const employees = ref<EmployeeResponse[]>([])
const apartments = ref<{ id: string; unitCode: string }[]>([])

const showModal = ref(false)
const editingId = ref<string | null>(null)
const emptyForm = () => ({
  title: '',
  type: 'VIEWING' as BookingType,
  status: 'SCHEDULED' as BookingStatus,
  startTime: '',
  endTime: '',
  location: '',
  customerId: '',
  apartmentId: '',
  assignedToId: '',
  note: '',
})
const form = ref(emptyForm())
const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const submitError = ref('')

const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

const monthLabel = computed(() => {
  return `Tháng ${cursor.value.getMonth() + 1} / ${cursor.value.getFullYear()}`
})

interface CalCell {
  date: Date
  inMonth: boolean
  bookings: BookingResponse[]
}

const calendarCells = computed<CalCell[]>(() => {
  const year = cursor.value.getFullYear()
  const month = cursor.value.getMonth()
  const first = new Date(year, month, 1)
  const startOffset = first.getDay() // 0=Sunday
  const start = new Date(year, month, 1 - startOffset)

  const byDay = new Map<string, BookingResponse[]>()
  for (const b of bookings.value) {
    const k = b.startTime.slice(0, 10)
    if (!byDay.has(k)) byDay.set(k, [])
    byDay.get(k)!.push(b)
  }

  const cells: CalCell[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    cells.push({
      date: d,
      inMonth: d.getMonth() === month,
      bookings: byDay.get(key) ?? [],
    })
  }
  return cells
})

const selectedDayBookings = computed(() => {
  if (!selectedDay.value) return []
  return bookings.value.filter(b => isSameDay(new Date(b.startTime), selectedDay.value!))
})

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatDateLabel(d: Date): string {
  return `${WEEKDAY_LABELS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function navMonth(delta: number) {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + delta, 1)
}

function goToday() {
  cursor.value = new Date(today.getFullYear(), today.getMonth(), 1)
  selectedDay.value = today
}

function selectDay(d: Date) {
  selectedDay.value = d
}

function toLocalIso(d: Date): string {
  // ISO without timezone offset for backend LocalDateTime
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
}

async function fetchBookings() {
  // Fetch the 6-week visible window
  const cells = calendarCells.value
  if (cells.length === 0) return
  const from = new Date(cells[0].date); from.setHours(0, 0, 0, 0)
  const to = new Date(cells[cells.length - 1].date); to.setHours(23, 59, 59, 999)
  try {
    const res = await bookingService.getList({
      from: toLocalIso(from),
      to: toLocalIso(to),
      type: filterType.value || undefined,
      status: filterStatus.value || undefined,
    })
    bookings.value = res.data?.data ?? []
  } catch {
    showToast('error', 'Không tải được lịch hẹn')
  }
}

async function fetchCustomers() {
  try {
    const res = await customerService.getList({ size: 200 })
    const raw: any = (res.data as any)?.data ?? res.data
    customers.value = Array.isArray(raw) ? raw : (raw?.content ?? [])
  } catch { /* silent */ }
}

async function fetchEmployees() {
  try {
    const res = await employeeService.getList({ status: 'ACTIVE', size: 100 })
    const raw: any = (res.data as any)?.data ?? res.data
    employees.value = Array.isArray(raw) ? raw : (raw?.content ?? [])
  } catch { /* silent */ }
}

async function fetchApartments() {
  try {
    const res = await http.get('/apartments', { params: { size: 200 } })
    const raw: any = (res.data as any)?.data ?? res.data
    const list = Array.isArray(raw) ? raw : (raw?.content ?? [])
    apartments.value = list.map((a: any) => ({ id: a.id, unitCode: a.unitCode }))
  } catch { /* silent */ }
}

function openCreate(day: Date | null) {
  editingId.value = null
  form.value = emptyForm()
  if (day) {
    const start = new Date(day); start.setHours(9, 0, 0, 0)
    const end = new Date(day); end.setHours(10, 0, 0, 0)
    form.value.startTime = toLocalIso(start).slice(0, 16)
    form.value.endTime = toLocalIso(end).slice(0, 16)
  }
  errors.value = {}
  submitError.value = ''
  showModal.value = true
}

function openEdit(b: BookingResponse) {
  editingId.value = b.id
  form.value = {
    title: b.title,
    type: b.type,
    status: b.status,
    startTime: b.startTime.slice(0, 16),
    endTime: b.endTime.slice(0, 16),
    location: b.location ?? '',
    customerId: b.customerId ?? '',
    apartmentId: b.apartmentId ?? '',
    assignedToId: b.assignedToId ?? '',
    note: b.note ?? '',
  }
  errors.value = {}
  submitError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function validate(): boolean {
  errors.value = {}
  if (!form.value.title.trim()) errors.value.title = 'Nhập tiêu đề'
  if (!form.value.startTime) errors.value.startTime = 'Chọn thời gian bắt đầu'
  if (!form.value.endTime) errors.value.endTime = 'Chọn thời gian kết thúc'
  if (form.value.startTime && form.value.endTime && form.value.endTime <= form.value.startTime) {
    errors.value.endTime = 'Phải sau thời gian bắt đầu'
  }
  return Object.keys(errors.value).length === 0
}

async function submitForm() {
  if (!validate()) return
  submitting.value = true
  submitError.value = ''
  try {
    const payload: Record<string, unknown> = {
      title: form.value.title.trim(),
      type: form.value.type,
      startTime: form.value.startTime + ':00',
      endTime: form.value.endTime + ':00',
    }
    if (form.value.location.trim()) payload.location = form.value.location.trim()
    if (form.value.customerId) payload.customerId = form.value.customerId
    if (form.value.apartmentId) payload.apartmentId = form.value.apartmentId
    if (form.value.assignedToId) payload.assignedToId = form.value.assignedToId
    if (form.value.note.trim()) payload.note = form.value.note.trim()

    if (editingId.value) {
      await bookingService.update(editingId.value, payload)
      if (form.value.status) await bookingService.updateStatus(editingId.value, form.value.status)
      showToast('success', 'Đã cập nhật')
    } else {
      await bookingService.create(payload)
      showToast('success', 'Đã tạo lịch hẹn')
    }
    closeModal()
    await fetchBookings()
  } catch (e: any) {
    submitError.value = e?.response?.data?.message ?? e?.response?.data?.error ?? 'Có lỗi xảy ra'
  } finally {
    submitting.value = false
  }
}

async function confirmDelete() {
  if (!editingId.value) return
  if (!confirm('Xoá lịch hẹn này?')) return
  try {
    await bookingService.deleteById(editingId.value)
    showToast('success', 'Đã xoá')
    closeModal()
    await fetchBookings()
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Không xoá được')
  }
}

watch(cursor, fetchBookings)

onMounted(() => {
  fetchBookings()
  fetchCustomers()
  fetchEmployees()
  fetchApartments()
})
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
