<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-[#0F2E4A]">Hợp đồng</h1>
        <p class="text-sm text-[#414A4D]/60 mt-1">Quản lý hợp đồng thuê/bán và công nợ</p>
      </div>
      <button
        @click="openCreateModal"
        class="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] text-white text-sm font-medium rounded-xl transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tạo hợp đồng
      </button>
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="bg-white rounded-xl border border-[#DDE8EF] p-4">
        <p class="text-xs text-[#414A4D]/60 mb-1">Tổng hợp đồng</p>
        <p class="text-xl font-bold text-[#0F2E4A]">{{ stats.total }}</p>
      </div>
      <div class="bg-white rounded-xl border border-[#DDE8EF] p-4">
        <p class="text-xs text-[#414A4D]/60 mb-1">Đang hiệu lực</p>
        <p class="text-xl font-bold text-[#16A34A]">{{ stats.byStatus.ACTIVE ?? 0 }}</p>
      </div>
      <div class="bg-white rounded-xl border border-[#DDE8EF] p-4">
        <p class="text-xs text-[#414A4D]/60 mb-1">Công nợ</p>
        <p class="text-xl font-bold text-[#A8845A]">{{ formatVND(stats.outstandingAmount) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-red-200 p-4">
        <p class="text-xs text-red-500 mb-1">Quá hạn</p>
        <p class="text-xl font-bold text-red-600">{{ formatVND(stats.overdueAmount) }}</p>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="flex flex-wrap gap-2 sm:gap-3 items-center">
      <div class="relative flex-1 min-w-[200px]">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#414A4D]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchInput"
          @input="onSearchInput"
          type="text"
          placeholder="Tìm theo mã hợp đồng..."
          class="w-full pl-10 pr-3 py-2 bg-white border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
        />
      </div>
      <select
        v-model="filterType"
        @change="fetchList"
        class="px-3 py-2 bg-white border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
      >
        <option value="">Tất cả loại</option>
        <option value="RENT">Thuê</option>
        <option value="SALE">Bán</option>
      </select>
      <select
        v-model="filterStatus"
        @change="fetchList"
        class="px-3 py-2 bg-white border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
      >
        <option value="">Tất cả trạng thái</option>
        <option v-for="s in STATUS_ORDER" :key="s" :value="s">{{ STATUS_META[s].label }}</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 5" :key="i" class="bg-white rounded-xl border border-[#DDE8EF] p-4 animate-pulse h-20" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 mb-3">{{ error }}</p>
      <button @click="fetchList" class="text-sm text-red-500 underline">Thử lại</button>
    </div>

    <!-- Empty -->
    <div v-else-if="contracts.length === 0" class="bg-white rounded-2xl border border-[#DDE8EF] p-16 text-center">
      <p class="text-[#414A4D]/60 text-sm">Chưa có hợp đồng nào</p>
      <button @click="openCreateModal" class="mt-4 text-sm text-[#A8845A] font-medium underline">
        Tạo hợp đồng đầu tiên
      </button>
    </div>

    <!-- List -->
    <div v-else class="bg-white rounded-2xl border border-[#DDE8EF] overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-[#F6F9FB] text-[#414A4D]/70 text-xs uppercase">
          <tr>
            <th class="text-left px-4 py-3 font-medium">Mã</th>
            <th class="text-left px-4 py-3 font-medium hidden sm:table-cell">Loại</th>
            <th class="text-left px-4 py-3 font-medium">Khách hàng</th>
            <th class="text-left px-4 py-3 font-medium hidden md:table-cell">Căn hộ</th>
            <th class="text-right px-4 py-3 font-medium">Giá trị</th>
            <th class="text-right px-4 py-3 font-medium hidden lg:table-cell">Còn nợ</th>
            <th class="text-left px-4 py-3 font-medium">Trạng thái</th>
            <th class="px-2 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="c in contracts"
            :key="c.id"
            class="border-t border-[#F0F5F9] hover:bg-[#F6F9FB] cursor-pointer transition"
            @click="goDetail(c.id)"
          >
            <td class="px-4 py-3 font-medium text-[#0F2E4A]">{{ c.code }}</td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <span class="text-xs px-2 py-0.5 rounded-full" :class="c.type === 'RENT' ? 'bg-[#DBEAFE] text-[#2563EB]' : 'bg-[#FEF9C3] text-[#CA8A04]'">
                {{ c.type === 'RENT' ? 'Thuê' : 'Bán' }}
              </span>
            </td>
            <td class="px-4 py-3 text-[#414A4D]">
              <p class="font-medium truncate max-w-[160px]">{{ c.customerName }}</p>
              <p class="text-xs text-[#414A4D]/50">{{ c.customerPhone }}</p>
            </td>
            <td class="px-4 py-3 hidden md:table-cell text-[#414A4D]/70">{{ c.apartmentCode }}</td>
            <td class="px-4 py-3 text-right font-medium text-[#0F2E4A]">{{ formatVND(c.totalAmount) }}</td>
            <td class="px-4 py-3 text-right hidden lg:table-cell" :class="num(c.outstandingAmount) > 0 ? 'text-[#A8845A] font-medium' : 'text-[#414A4D]/40'">
              {{ formatVND(c.outstandingAmount) }}
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full" :class="STATUS_META[c.status].badge">
                <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_META[c.status].dot" />
                {{ STATUS_META[c.status].label }}
              </span>
            </td>
            <td class="px-2 py-3 text-[#414A4D]/40">›</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && totalPages > 1" class="flex items-center justify-center gap-2 pt-2">
      <button @click="goPage(page - 1)" :disabled="page === 0" class="px-3 py-1.5 text-sm border border-[#DDE8EF] rounded-lg disabled:opacity-40 hover:bg-[#F6F9FB]">←</button>
      <span class="text-sm text-[#414A4D]/60">{{ page + 1 }} / {{ totalPages }}</span>
      <button @click="goPage(page + 1)" :disabled="page + 1 >= totalPages" class="px-3 py-1.5 text-sm border border-[#DDE8EF] rounded-lg disabled:opacity-40 hover:bg-[#F6F9FB]">→</button>
    </div>

    <!-- Create modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#DDE8EF] sticky top-0 bg-white z-10">
            <h2 class="text-base font-semibold text-[#0F2E4A]">Tạo hợp đồng mới</h2>
            <button @click="closeModal" class="p-1 text-[#414A4D]/40 hover:text-[#414A4D] rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Mã HĐ <span class="text-red-500">*</span></label>
                <input v-model="form.code" type="text" placeholder="HD-2026-001" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" :class="{ 'border-red-400': errors.code }" />
                <p v-if="errors.code" class="text-xs text-red-500 mt-1">{{ errors.code }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Loại <span class="text-red-500">*</span></label>
                <select v-model="form.type" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition">
                  <option value="RENT">Thuê</option>
                  <option value="SALE">Bán</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Khách hàng <span class="text-red-500">*</span></label>
              <select v-model="form.customerId" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" :class="{ 'border-red-400': errors.customerId }">
                <option value="">— Chọn khách hàng —</option>
                <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.fullName }} — {{ c.phone }}</option>
              </select>
              <p v-if="errors.customerId" class="text-xs text-red-500 mt-1">{{ errors.customerId }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Căn hộ <span class="text-red-500">*</span></label>
              <select v-model="form.apartmentId" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" :class="{ 'border-red-400': errors.apartmentId }">
                <option value="">— Chọn căn hộ —</option>
                <option v-for="a in apartments" :key="a.id" :value="a.id">{{ a.unitCode }}</option>
              </select>
              <p v-if="errors.apartmentId" class="text-xs text-red-500 mt-1">{{ errors.apartmentId }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Ngày bắt đầu <span class="text-red-500">*</span></label>
                <input v-model="form.startDate" type="date" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" :class="{ 'border-red-400': errors.startDate }" />
                <p v-if="errors.startDate" class="text-xs text-red-500 mt-1">{{ errors.startDate }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">
                  Ngày kết thúc <span v-if="form.type === 'RENT'" class="text-red-500">*</span>
                </label>
                <input v-model="form.endDate" type="date" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" :class="{ 'border-red-400': errors.endDate }" />
                <p v-if="errors.endDate" class="text-xs text-red-500 mt-1">{{ errors.endDate }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Tổng giá trị <span class="text-red-500">*</span></label>
                <input v-model.number="form.totalAmount" type="number" min="0" placeholder="3000000000" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" :class="{ 'border-red-400': errors.totalAmount }" />
                <p v-if="errors.totalAmount" class="text-xs text-red-500 mt-1">{{ errors.totalAmount }}</p>
              </div>
              <div v-if="form.type === 'RENT'">
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Tiền thuê / tháng</label>
                <input v-model.number="form.monthlyAmount" type="number" min="0" placeholder="15000000" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" />
              </div>
              <div v-else>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Tiền cọc</label>
                <input v-model.number="form.depositAmount" type="number" min="0" placeholder="100000000" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" />
              </div>
            </div>

            <label v-if="form.type === 'RENT'" class="flex items-start gap-2 cursor-pointer">
              <input v-model="form.autoGenerateSchedule" type="checkbox" class="mt-1 accent-[#A8845A]" />
              <div>
                <p class="text-sm text-[#414A4D]">Tự sinh lịch thanh toán hàng tháng</p>
                <p class="text-xs text-[#414A4D]/50">Tạo các kỳ thanh toán đều theo tháng từ ngày bắt đầu → kết thúc</p>
              </div>
            </label>

            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Ghi chú</label>
              <textarea v-model="form.note" rows="2" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition resize-none" />
            </div>

            <p v-if="submitError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ submitError }}</p>

            <div class="flex gap-3 pt-2">
              <button type="button" @click="closeModal" class="flex-1 px-4 py-2.5 border border-[#DDE8EF] text-[#414A4D] text-sm font-medium rounded-xl hover:bg-[#F6F9FB] transition">Huỷ</button>
              <button type="submit" :disabled="submitting" class="flex-1 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2">
                <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Tạo hợp đồng
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import contractService from '@/services/contractService'
import customerService from '@/services/customerService'
import http from '@/services/http'
import type { ContractResponse, ContractType, ContractStatus, ContractStats } from '@/types/contract'
import type { CustomerResponse } from '@/types/customer'

const router = useRouter()

const STATUS_ORDER: ContractStatus[] = ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']
const STATUS_META: Record<ContractStatus, { label: string; dot: string; badge: string }> = {
  DRAFT:     { label: 'Nháp',         dot: 'bg-[#414A4D]', badge: 'bg-[#414A4D]/10 text-[#414A4D]/70' },
  ACTIVE:    { label: 'Hiệu lực',     dot: 'bg-[#16A34A]', badge: 'bg-[#DCFCE7] text-[#16A34A]' },
  COMPLETED: { label: 'Hoàn tất',     dot: 'bg-[#2563EB]', badge: 'bg-[#DBEAFE] text-[#2563EB]' },
  CANCELLED: { label: 'Đã huỷ',       dot: 'bg-[#DC2626]', badge: 'bg-red-50 text-red-600' },
}

const contracts = ref<ContractResponse[]>([])
const customers = ref<CustomerResponse[]>([])
const apartments = ref<{ id: string; unitCode: string }[]>([])
const stats = ref<ContractStats>({ total: 0, byStatus: {}, outstandingAmount: 0, overdueAmount: 0 })

const loading = ref(false)
const error = ref('')
const searchInput = ref('')
const filterType = ref<ContractType | ''>('')
const filterStatus = ref<ContractStatus | ''>('')
const page = ref(0)
const totalPages = ref(0)

const showModal = ref(false)
const emptyForm = () => ({
  code: '',
  type: 'RENT' as ContractType,
  customerId: '',
  apartmentId: '',
  startDate: '',
  endDate: '',
  totalAmount: 0,
  monthlyAmount: 0,
  depositAmount: 0,
  autoGenerateSchedule: true,
  note: '',
})
const form = ref(emptyForm())
const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const submitError = ref('')

let searchDebounce: ReturnType<typeof setTimeout>

function num(v: string | number | null | undefined): number {
  if (v == null) return 0
  return typeof v === 'string' ? parseFloat(v) : v
}

function formatVND(v: string | number | null | undefined): string {
  const n = num(v)
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ'
}

function onSearchInput() {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => { page.value = 0; fetchList() }, 350)
}

function goPage(p: number) {
  if (p < 0 || p >= totalPages.value) return
  page.value = p
  fetchList()
}

function goDetail(id: string) {
  router.push(`/contracts/${id}`)
}

async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    const res = await contractService.getList({
      keyword: searchInput.value.trim() || undefined,
      type: filterType.value || undefined,
      status: filterStatus.value || undefined,
      page: page.value,
    })
    const raw = (res.data as any)?.data ?? res.data
    if (Array.isArray(raw)) {
      contracts.value = raw
      totalPages.value = 1
    } else {
      contracts.value = raw?.content ?? []
      totalPages.value = raw?.totalPages ?? 0
    }
  } catch {
    error.value = 'Không thể tải danh sách hợp đồng'
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    const res = await contractService.getStats()
    stats.value = res.data?.data ?? stats.value
  } catch { /* silent */ }
}

async function fetchCustomers() {
  try {
    const res = await customerService.getList({ size: 200 })
    const raw: any = (res.data as any)?.data ?? res.data
    customers.value = Array.isArray(raw) ? raw : (raw?.content ?? [])
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

function openCreateModal() {
  form.value = emptyForm()
  errors.value = {}
  submitError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function validate(): boolean {
  errors.value = {}
  if (!form.value.code.trim()) errors.value.code = 'Mã không được để trống'
  if (!form.value.customerId) errors.value.customerId = 'Chọn khách hàng'
  if (!form.value.apartmentId) errors.value.apartmentId = 'Chọn căn hộ'
  if (!form.value.startDate) errors.value.startDate = 'Chọn ngày bắt đầu'
  if (form.value.type === 'RENT' && !form.value.endDate) errors.value.endDate = 'Hợp đồng thuê cần ngày kết thúc'
  if (form.value.startDate && form.value.endDate && form.value.endDate < form.value.startDate) {
    errors.value.endDate = 'Ngày kết thúc phải sau ngày bắt đầu'
  }
  if (!form.value.totalAmount || form.value.totalAmount <= 0) errors.value.totalAmount = 'Nhập tổng giá trị'
  return Object.keys(errors.value).length === 0
}

async function submitForm() {
  if (!validate()) return
  submitting.value = true
  submitError.value = ''
  try {
    const payload: Record<string, unknown> = {
      code: form.value.code.trim(),
      type: form.value.type,
      customerId: form.value.customerId,
      apartmentId: form.value.apartmentId,
      startDate: form.value.startDate,
      endDate: form.value.endDate || null,
      totalAmount: form.value.totalAmount,
      autoGenerateSchedule: form.value.autoGenerateSchedule,
    }
    if (form.value.monthlyAmount) payload.monthlyAmount = form.value.monthlyAmount
    if (form.value.depositAmount) payload.depositAmount = form.value.depositAmount
    if (form.value.note.trim()) payload.note = form.value.note.trim()

    const res = await contractService.create(payload)
    closeModal()
    await Promise.all([fetchList(), fetchStats()])
    const id = res.data?.data?.id
    if (id) router.push(`/contracts/${id}`)
  } catch (e: any) {
    submitError.value = e?.response?.data?.message ?? e?.response?.data?.error ?? 'Có lỗi xảy ra'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchList()
  fetchStats()
  fetchCustomers()
  fetchApartments()
})
</script>
