<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#0F2E4A]">Nhân viên</h1>
        <p class="text-sm text-[#414A4D]/60 mt-1">Quản lý nhân viên trong tổ chức</p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] text-white text-sm font-medium rounded-xl transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Thêm nhân viên
      </button>
    </div>

    <!-- Filter bar -->
    <div class="flex flex-wrap gap-3">
      <select
        v-model="filterDepartmentId"
        @change="fetchEmployees"
        class="px-3 py-2 bg-white border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition min-w-[180px]"
      >
        <option value="">Tất cả phòng ban</option>
        <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
      </select>

      <select
        v-model="filterStatus"
        @change="fetchEmployees"
        class="px-3 py-2 bg-white border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition min-w-[150px]"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="ACTIVE">Đang làm việc</option>
        <option value="INACTIVE">Đã nghỉ</option>
      </select>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white rounded-2xl border border-[#DDE8EF] p-5 animate-pulse"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-[#F0F5F9]" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-[#F0F5F9] rounded-lg w-3/4" />
            <div class="h-3 bg-[#F0F5F9] rounded-lg w-1/2" />
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-3 bg-[#F0F5F9] rounded-lg w-full" />
          <div class="h-3 bg-[#F0F5F9] rounded-lg w-4/5" />
        </div>
        <div class="flex gap-2 mt-4">
          <div class="h-6 bg-[#F0F5F9] rounded-full w-20" />
          <div class="h-6 bg-[#F0F5F9] rounded-full w-16" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 mb-3">{{ error }}</p>
      <button @click="fetchEmployees" class="text-sm text-red-500 underline">Thử lại</button>
    </div>

    <!-- Empty — no data at all -->
    <div
      v-else-if="employees.length === 0 && !filterDepartmentId && !filterStatus"
      class="bg-white rounded-2xl border border-[#DDE8EF] p-16 text-center"
    >
      <div class="w-16 h-16 bg-[#F0F7FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[#A9B8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p class="text-[#414A4D]/60 text-sm">Chưa có nhân viên nào</p>
      <button @click="openCreateModal" class="mt-4 text-sm text-[#A8845A] font-medium underline">
        Thêm nhân viên đầu tiên
      </button>
    </div>

    <!-- Empty — filter no result -->
    <div
      v-else-if="employees.length === 0"
      class="bg-white rounded-2xl border border-[#DDE8EF] p-12 text-center"
    >
      <div class="w-12 h-12 bg-[#F0F5F9] rounded-xl flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6 text-[#A9B8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <p class="text-[#414A4D]/60 text-sm">Không tìm thấy nhân viên phù hợp</p>
      <button @click="clearFilters" class="mt-3 text-sm text-[#A8845A] font-medium underline">
        Xoá bộ lọc
      </button>
    </div>

    <!-- Employee Card Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="emp in employees"
        :key="emp.id"
        class="bg-white rounded-2xl border border-[#DDE8EF] p-5 hover:shadow-md hover:border-[#A9B8A8]/60 transition-all group"
      >
        <!-- Top row: avatar + name + actions -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Avatar -->
            <div class="w-12 h-12 rounded-full bg-[#A8845A] flex items-center justify-center flex-shrink-0 text-white font-bold text-lg select-none">
              {{ avatarLetter(emp.fullName) }}
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-[#0F2E4A] text-sm leading-tight truncate">{{ emp.fullName }}</p>
              <p class="text-xs text-[#414A4D]/50 mt-0.5 truncate">{{ emp.position || '—' }}</p>
            </div>
          </div>

          <!-- Edit / Delete -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1">
            <button
              @click="openEditModal(emp)"
              class="p-1.5 rounded-lg text-[#414A4D]/40 hover:text-[#A8845A] hover:bg-[#FFF8F2] transition"
              title="Chỉnh sửa"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(emp)"
              class="p-1.5 rounded-lg text-[#414A4D]/40 hover:text-red-500 hover:bg-red-50 transition"
              title="Xóa"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Contact info -->
        <div class="space-y-1.5 mb-4">
          <div class="flex items-center gap-2 text-xs text-[#414A4D]/60">
            <svg class="w-3.5 h-3.5 text-[#A9B8A8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="truncate">{{ emp.email }}</span>
          </div>
          <div v-if="emp.phone" class="flex items-center gap-2 text-xs text-[#414A4D]/60">
            <svg class="w-3.5 h-3.5 text-[#A9B8A8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{{ emp.phone }}</span>
          </div>
        </div>

        <!-- Badges -->
        <div class="flex items-center gap-2 flex-wrap pt-3 border-t border-[#F0F5F9]">
          <span
            v-if="emp.departmentName"
            class="inline-flex items-center text-xs bg-[#A8845A]/10 text-[#A8845A] font-medium px-2.5 py-1 rounded-full"
          >
            {{ emp.departmentName }}
          </span>
          <span
            class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
            :class="emp.status === 'ACTIVE'
              ? 'bg-[#1D9E75]/10 text-[#1D9E75]'
              : 'bg-[#414A4D]/10 text-[#414A4D]/60'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="emp.status === 'ACTIVE' ? 'bg-[#1D9E75]' : 'bg-[#414A4D]/40'"
            />
            {{ emp.status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ' }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Create / Edit Modal -->
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#DDE8EF] sticky top-0 bg-white z-10">
          <h2 class="text-base font-semibold text-[#0F2E4A]">
            {{ isEditing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới' }}
          </h2>
          <button @click="closeModal" class="p-1 text-[#414A4D]/40 hover:text-[#414A4D] rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <!-- Họ tên -->
          <div>
            <label class="block text-sm font-medium text-[#414A4D] mb-1.5">
              Họ tên <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/30"
              :class="{ 'border-red-400': formErrors.fullName }"
            />
            <p v-if="formErrors.fullName" class="text-xs text-red-500 mt-1">{{ formErrors.fullName }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-[#414A4D] mb-1.5">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="example@company.com"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/30"
              :class="{ 'border-red-400': formErrors.email }"
            />
            <p v-if="formErrors.email" class="text-xs text-red-500 mt-1">{{ formErrors.email }}</p>
          </div>

          <!-- Phone + Position (2 cols) -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Số điện thoại</label>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="0901 234 567"
                class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/30"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Chức vụ</label>
              <input
                v-model="form.position"
                type="text"
                placeholder="Trưởng phòng, NV..."
                class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/30"
              />
            </div>
          </div>

          <!-- Phòng ban -->
          <div>
            <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Phòng ban</label>
            <select
              v-model="form.departmentId"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
            >
              <option value="">— Chọn phòng ban —</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
            </select>
          </div>

          <!-- Trạng thái -->
          <div>
            <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Trạng thái</label>
            <select
              v-model="form.status"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
            >
              <option value="ACTIVE">Đang làm việc</option>
              <option value="INACTIVE">Đã nghỉ</option>
            </select>
          </div>

          <p v-if="submitError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ submitError }}</p>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2.5 border border-[#DDE8EF] text-[#414A4D] text-sm font-medium rounded-xl hover:bg-[#F6F9FB] transition"
            >
              Huỷ
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {{ isEditing ? 'Lưu thay đổi' : 'Tạo mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Delete Confirm -->
  <Teleport to="body">
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="deleteTarget = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-[#0F2E4A]">Xác nhận xóa</h3>
            <p class="text-sm text-[#414A4D]/60 mt-0.5">
              Bạn có chắc muốn xóa nhân viên
              <span class="font-medium text-[#414A4D]">{{ deleteTarget.fullName }}</span> không?
            </p>
          </div>
        </div>
        <p class="text-xs text-[#414A4D]/40 mb-5">Hành động này không thể hoàn tác.</p>
        <div class="flex gap-3">
          <button
            @click="deleteTarget = null"
            class="flex-1 px-4 py-2.5 border border-[#DDE8EF] text-[#414A4D] text-sm font-medium rounded-xl hover:bg-[#F6F9FB] transition"
          >
            Huỷ
          </button>
          <button
            @click="doDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
          >
            <span v-if="deleting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Toast -->
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toast"
        class="fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl text-white text-sm shadow-xl flex items-center gap-2"
        :class="toast.type === 'success' ? 'bg-[#0F2E4A]' : 'bg-red-500'"
      >
        <svg v-if="toast.type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import employeeService from '@/services/employeeService'
import departmentService from '@/services/departmentService'
import type { EmployeeResponse, EmployeeStatus } from '@/types/employee'
import type { DepartmentResponse } from '@/types/department'

// ── State ──────────────────────────────────────────────
const employees = ref<EmployeeResponse[]>([])
const departments = ref<DepartmentResponse[]>([])
const loading = ref(false)
const error = ref('')

const filterDepartmentId = ref('')
const filterStatus = ref<EmployeeStatus | ''>('')

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const emptyForm = () => ({ fullName: '', email: '', phone: '', position: '', departmentId: '', status: 'ACTIVE' as EmployeeStatus })
const form = ref(emptyForm())
const formErrors = ref<{ fullName?: string; email?: string }>({})
const submitting = ref(false)
const submitError = ref('')

const deleteTarget = ref<EmployeeResponse | null>(null)
const deleting = ref(false)

const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

// ── Helpers ────────────────────────────────────────────
function avatarLetter(name: string): string {
  return (name || '?').trim().charAt(0).toUpperCase()
}

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

function clearFilters() {
  filterDepartmentId.value = ''
  filterStatus.value = ''
  fetchEmployees()
}

// ── Data fetching ──────────────────────────────────────
async function fetchEmployees() {
  loading.value = true
  error.value = ''
  try {
    const res = await employeeService.getList({
      departmentId: filterDepartmentId.value || undefined,
      status: filterStatus.value || undefined,
    })
    const raw = (res.data as any)?.data ?? res.data
    employees.value = Array.isArray(raw) ? raw : (raw?.content ?? [])
  } catch {
    error.value = 'Không thể tải danh sách nhân viên'
  } finally {
    loading.value = false
  }
}

async function fetchDepartments() {
  try {
    const res = await departmentService.getAll()
    const raw: any = res.data?.data ?? (res.data as any)
    departments.value = Array.isArray(raw) ? raw : (raw?.content ?? [])
  } catch {
    // departments optional for filter — silent fail
  }
}

// ── Modal ──────────────────────────────────────────────
function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  form.value = emptyForm()
  formErrors.value = {}
  submitError.value = ''
  showModal.value = true
}

function openEditModal(emp: EmployeeResponse) {
  isEditing.value = true
  editingId.value = emp.id
  form.value = {
    fullName: emp.fullName,
    email: emp.email,
    phone: emp.phone ?? '',
    position: emp.position ?? '',
    departmentId: emp.departmentId ?? '',
    status: emp.status,
  }
  formErrors.value = {}
  submitError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function validateForm(): boolean {
  formErrors.value = {}
  if (!form.value.fullName.trim()) formErrors.value.fullName = 'Họ tên không được để trống'
  if (!form.value.email.trim()) {
    formErrors.value.email = 'Email không được để trống'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim())) {
    formErrors.value.email = 'Email không đúng định dạng'
  }
  return Object.keys(formErrors.value).length === 0
}

async function submitForm() {
  if (!validateForm()) return
  submitting.value = true
  submitError.value = ''
  try {
    const payload: Record<string, unknown> = {
      fullName: form.value.fullName.trim(),
      email: form.value.email.trim(),
      status: form.value.status,
    }
    if (form.value.phone.trim()) payload.phone = form.value.phone.trim()
    if (form.value.position.trim()) payload.position = form.value.position.trim()
    if (form.value.departmentId) payload.departmentId = form.value.departmentId

    if (isEditing.value && editingId.value) {
      await employeeService.update(editingId.value, payload)
      showToast('success', 'Đã cập nhật nhân viên')
    } else {
      await employeeService.create(payload)
      showToast('success', 'Đã thêm nhân viên mới')
    }
    closeModal()
    await fetchEmployees()
  } catch (e: any) {
    submitError.value = e?.response?.data?.message
      || e?.response?.data?.error
      || 'Có lỗi xảy ra'
  } finally {
    submitting.value = false
  }
}

// ── Delete ─────────────────────────────────────────────
function confirmDelete(emp: EmployeeResponse) {
  deleteTarget.value = emp
}

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await employeeService.deleteById(deleteTarget.value.id)
    showToast('success', 'Đã xóa nhân viên')
    deleteTarget.value = null
    await fetchEmployees()
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Xóa thất bại')
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchEmployees(), fetchDepartments()])
})
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
