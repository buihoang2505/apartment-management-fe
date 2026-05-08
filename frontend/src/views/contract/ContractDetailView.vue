<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-5">
    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-2xl border border-[#DDE8EF] p-8 animate-pulse h-64" />

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 mb-3">{{ error }}</p>
      <button @click="fetchDetail" class="text-sm text-red-500 underline">Thử lại</button>
    </div>

    <template v-else-if="contract">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="min-w-0">
          <button @click="router.push('/contracts')" class="text-xs text-[#A8845A] hover:underline mb-2">← Danh sách</button>
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="text-xl sm:text-2xl font-bold text-[#0F2E4A]">{{ contract.code }}</h1>
            <span class="text-xs px-2.5 py-1 rounded-full" :class="contract.type === 'RENT' ? 'bg-[#DBEAFE] text-[#2563EB]' : 'bg-[#FEF9C3] text-[#CA8A04]'">
              {{ contract.type === 'RENT' ? 'Thuê' : 'Bán' }}
            </span>
            <span class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full" :class="STATUS_META[contract.status].badge">
              <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_META[contract.status].dot" />
              {{ STATUS_META[contract.status].label }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 self-start">
          <select
            :value="contract.status"
            @change="onChangeStatus(($event.target as HTMLSelectElement).value as ContractStatus)"
            class="px-3 py-2 bg-white border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
          >
            <option v-for="s in STATUS_ORDER" :key="s" :value="s">{{ STATUS_META[s].label }}</option>
          </select>
          <button @click="confirmDelete" class="p-2 rounded-xl text-[#414A4D]/40 hover:text-red-500 hover:bg-red-50 transition" title="Xoá">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Info card -->
      <div class="bg-white rounded-2xl border border-[#DDE8EF] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <p class="text-xs text-[#414A4D]/50 mb-1">Khách hàng</p>
          <p class="text-sm font-medium text-[#0F2E4A]">{{ contract.customerName }}</p>
          <p class="text-xs text-[#414A4D]/60">{{ contract.customerPhone }}</p>
        </div>
        <div>
          <p class="text-xs text-[#414A4D]/50 mb-1">Căn hộ</p>
          <p class="text-sm font-medium text-[#0F2E4A]">{{ contract.apartmentCode }}</p>
        </div>
        <div>
          <p class="text-xs text-[#414A4D]/50 mb-1">Thời hạn</p>
          <p class="text-sm font-medium text-[#0F2E4A]">{{ contract.startDate }} → {{ contract.endDate ?? '—' }}</p>
        </div>
        <div>
          <p class="text-xs text-[#414A4D]/50 mb-1">Tổng giá trị</p>
          <p class="text-sm font-medium text-[#0F2E4A]">{{ formatVND(contract.totalAmount) }}</p>
        </div>
        <div v-if="contract.monthlyAmount">
          <p class="text-xs text-[#414A4D]/50 mb-1">Tiền thuê / tháng</p>
          <p class="text-sm font-medium text-[#0F2E4A]">{{ formatVND(contract.monthlyAmount) }}</p>
        </div>
        <div v-if="contract.depositAmount">
          <p class="text-xs text-[#414A4D]/50 mb-1">Tiền cọc</p>
          <p class="text-sm font-medium text-[#0F2E4A]">{{ formatVND(contract.depositAmount) }}</p>
        </div>
      </div>

      <!-- Money summary -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white rounded-xl border border-[#DDE8EF] p-4">
          <p class="text-xs text-[#414A4D]/60 mb-1">Đã thu</p>
          <p class="text-base sm:text-lg font-bold text-[#16A34A]">{{ formatVND(contract.paidAmount) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-[#DDE8EF] p-4">
          <p class="text-xs text-[#414A4D]/60 mb-1">Còn nợ</p>
          <p class="text-base sm:text-lg font-bold text-[#A8845A]">{{ formatVND(contract.outstandingAmount) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-[#DDE8EF] p-4">
          <p class="text-xs text-[#414A4D]/60 mb-1">Tổng</p>
          <p class="text-base sm:text-lg font-bold text-[#0F2E4A]">{{ formatVND(contract.totalAmount) }}</p>
        </div>
      </div>

      <!-- Schedule table -->
      <div class="bg-white rounded-2xl border border-[#DDE8EF] overflow-hidden">
        <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#F0F5F9]">
          <h2 class="font-semibold text-[#0F2E4A]">Lịch thanh toán</h2>
          <button @click="openAddSchedule" class="text-sm text-[#A8845A] font-medium hover:underline">+ Thêm kỳ</button>
        </div>

        <div v-if="contract.schedules.length === 0" class="p-8 text-center text-sm text-[#414A4D]/50">
          Chưa có kỳ thanh toán
        </div>

        <table v-else class="w-full text-sm">
          <thead class="bg-[#F6F9FB] text-[#414A4D]/70 text-xs uppercase">
            <tr>
              <th class="text-left px-4 py-3 font-medium w-12">#</th>
              <th class="text-left px-4 py-3 font-medium">Hạn nộp</th>
              <th class="text-right px-4 py-3 font-medium">Số tiền</th>
              <th class="text-right px-4 py-3 font-medium hidden sm:table-cell">Đã trả</th>
              <th class="text-left px-4 py-3 font-medium">Trạng thái</th>
              <th class="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in contract.schedules" :key="s.id" class="border-t border-[#F0F5F9]">
              <td class="px-4 py-3 text-[#414A4D]/60">{{ s.periodIndex }}</td>
              <td class="px-4 py-3 text-[#414A4D]">{{ s.dueDate }}</td>
              <td class="px-4 py-3 text-right font-medium text-[#0F2E4A]">{{ formatVND(s.amount) }}</td>
              <td class="px-4 py-3 text-right hidden sm:table-cell text-[#16A34A]">{{ s.paidAmount ? formatVND(s.paidAmount) : '—' }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full" :class="SCHED_META[s.status].badge">
                  <span class="w-1.5 h-1.5 rounded-full" :class="SCHED_META[s.status].dot" />
                  {{ SCHED_META[s.status].label }}
                </span>
              </td>
              <td class="px-2 py-3 whitespace-nowrap">
                <button v-if="s.status !== 'PAID'" @click="openMarkPaid(s)" class="text-xs text-[#16A34A] font-medium hover:underline mr-3">Đã thu</button>
                <button @click="confirmDeleteSchedule(s)" class="text-xs text-red-500 hover:underline">Xoá</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Add Schedule modal -->
    <Teleport to="body">
      <div v-if="addModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="addModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <h3 class="font-semibold text-[#0F2E4A] mb-4">Thêm kỳ thanh toán</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Hạn nộp</label>
              <input v-model="addForm.dueDate" type="date" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Số tiền</label>
              <input v-model.number="addForm.amount" type="number" min="0" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Ghi chú</label>
              <input v-model="addForm.note" type="text" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" />
            </div>
            <div class="flex gap-3 pt-2">
              <button @click="addModal = false" class="flex-1 px-4 py-2.5 border border-[#DDE8EF] rounded-xl text-sm">Huỷ</button>
              <button @click="submitAdd" :disabled="adding" class="flex-1 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm rounded-xl">Thêm</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Mark paid modal -->
    <Teleport to="body">
      <div v-if="payModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="payModal = null">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <h3 class="font-semibold text-[#0F2E4A] mb-1">Ghi nhận thanh toán</h3>
          <p class="text-xs text-[#414A4D]/60 mb-4">Kỳ #{{ payModal?.periodIndex }} — hạn {{ payModal?.dueDate }}</p>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Số tiền đã thu</label>
              <input v-model.number="payForm.paidAmount" type="number" min="0" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Ngày thu</label>
              <input v-model="payForm.paidDate" type="date" class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Ghi chú</label>
              <input v-model="payForm.note" type="text" placeholder="Chuyển khoản, tiền mặt..." class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition" />
            </div>
            <div class="flex gap-3 pt-2">
              <button @click="payModal = null" class="flex-1 px-4 py-2.5 border border-[#DDE8EF] rounded-xl text-sm">Huỷ</button>
              <button @click="submitPay" :disabled="paying" class="flex-1 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-60 text-white text-sm rounded-xl">Ghi nhận</button>
            </div>
          </div>
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import contractService from '@/services/contractService'
import type { ContractResponse, ContractStatus, PaymentScheduleResponse, PaymentScheduleStatus } from '@/types/contract'

const route = useRoute()
const router = useRouter()

const STATUS_ORDER: ContractStatus[] = ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']
const STATUS_META: Record<ContractStatus, { label: string; dot: string; badge: string }> = {
  DRAFT:     { label: 'Nháp',     dot: 'bg-[#414A4D]', badge: 'bg-[#414A4D]/10 text-[#414A4D]/70' },
  ACTIVE:    { label: 'Hiệu lực', dot: 'bg-[#16A34A]', badge: 'bg-[#DCFCE7] text-[#16A34A]' },
  COMPLETED: { label: 'Hoàn tất', dot: 'bg-[#2563EB]', badge: 'bg-[#DBEAFE] text-[#2563EB]' },
  CANCELLED: { label: 'Đã huỷ',   dot: 'bg-[#DC2626]', badge: 'bg-red-50 text-red-600' },
}
const SCHED_META: Record<PaymentScheduleStatus, { label: string; dot: string; badge: string }> = {
  PENDING: { label: 'Chờ thu',   dot: 'bg-[#CA8A04]', badge: 'bg-[#FEF9C3] text-[#CA8A04]' },
  PAID:    { label: 'Đã thu',    dot: 'bg-[#16A34A]', badge: 'bg-[#DCFCE7] text-[#16A34A]' },
  OVERDUE: { label: 'Quá hạn',   dot: 'bg-[#DC2626]', badge: 'bg-red-50 text-red-600' },
}

const contract = ref<ContractResponse | null>(null)
const loading = ref(false)
const error = ref('')

const addModal = ref(false)
const addForm = ref({ dueDate: '', amount: 0, note: '' })
const adding = ref(false)

const payModal = ref<PaymentScheduleResponse | null>(null)
const payForm = ref({ paidAmount: 0, paidDate: '', note: '' })
const paying = ref(false)

const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

function num(v: any): number {
  if (v == null) return 0
  return typeof v === 'string' ? parseFloat(v) : v
}

function formatVND(v: any): string {
  return new Intl.NumberFormat('vi-VN').format(num(v)) + 'đ'
}

async function fetchDetail() {
  const id = route.params.id as string
  if (!id) return
  loading.value = true
  error.value = ''
  try {
    const res = await contractService.getById(id)
    contract.value = res.data?.data ?? null
  } catch {
    error.value = 'Không thể tải hợp đồng'
  } finally {
    loading.value = false
  }
}

async function onChangeStatus(s: ContractStatus) {
  if (!contract.value || s === contract.value.status) return
  try {
    await contractService.updateStatus(contract.value.id, s)
    showToast('success', 'Đã cập nhật trạng thái')
    await fetchDetail()
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Không cập nhật được')
  }
}

async function confirmDelete() {
  if (!contract.value) return
  if (!confirm(`Xoá hợp đồng ${contract.value.code}?`)) return
  try {
    await contractService.deleteById(contract.value.id)
    router.push('/contracts')
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Không xoá được')
  }
}

function openAddSchedule() {
  addForm.value = { dueDate: '', amount: num(contract.value?.monthlyAmount) || 0, note: '' }
  addModal.value = true
}

async function submitAdd() {
  if (!contract.value || !addForm.value.dueDate || !addForm.value.amount) return
  adding.value = true
  try {
    await contractService.addSchedule(contract.value.id, {
      dueDate: addForm.value.dueDate,
      amount: addForm.value.amount,
      note: addForm.value.note || undefined,
    })
    addModal.value = false
    showToast('success', 'Đã thêm kỳ')
    await fetchDetail()
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Có lỗi xảy ra')
  } finally {
    adding.value = false
  }
}

function openMarkPaid(s: PaymentScheduleResponse) {
  payModal.value = s
  payForm.value = {
    paidAmount: num(s.amount),
    paidDate: new Date().toISOString().slice(0, 10),
    note: '',
  }
}

async function submitPay() {
  if (!payModal.value) return
  paying.value = true
  try {
    await contractService.markPaid(payModal.value.id, {
      paidAmount: payForm.value.paidAmount,
      paidDate: payForm.value.paidDate,
      note: payForm.value.note || undefined,
    })
    payModal.value = null
    showToast('success', 'Đã ghi nhận thanh toán')
    await fetchDetail()
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Có lỗi xảy ra')
  } finally {
    paying.value = false
  }
}

async function confirmDeleteSchedule(s: PaymentScheduleResponse) {
  if (!confirm(`Xoá kỳ #${s.periodIndex}?`)) return
  try {
    await contractService.deleteSchedule(s.id)
    showToast('success', 'Đã xoá kỳ')
    await fetchDetail()
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Không xoá được')
  }
}

onMounted(fetchDetail)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
