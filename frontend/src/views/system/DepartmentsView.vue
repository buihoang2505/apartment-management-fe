<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-[#0F2E4A]">Phòng ban</h1>
        <p class="text-sm text-[#414A4D]/60 mt-1">Quản lý các phòng ban trong tổ chức</p>
      </div>
      <button
        @click="openCreateModal"
        class="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap flex-shrink-0"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Thêm Phòng ban
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-4 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 mb-3">{{ error }}</p>
      <button @click="fetchDepartments" class="text-sm text-red-500 underline">Thử lại</button>
    </div>

    <!-- Empty -->
    <div v-else-if="departments.length === 0" class="bg-white rounded-2xl border border-[#DDE8EF] p-16 text-center">
      <div class="w-16 h-16 bg-[#F0F7FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[#A9B8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <p class="text-[#414A4D]/60 text-sm">Chưa có phòng ban nào</p>
      <button @click="openCreateModal" class="mt-4 text-sm text-[#A8845A] font-medium underline">
        Tạo phòng ban đầu tiên
      </button>
    </div>

    <!-- Card Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="dept in departments"
        :key="dept.id"
        class="bg-white rounded-2xl border border-[#DDE8EF] p-5 hover:shadow-md hover:border-[#A9B8A8]/60 transition-all group"
      >
        <!-- Card Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#A8845A]/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-[#A8845A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-[#0F2E4A] text-sm leading-tight truncate">{{ dept.name }}</h3>
              <span class="inline-block font-mono text-xs bg-[#F0F5F9] text-[#414A4D] px-2 py-0.5 rounded-md mt-1">
                {{ dept.code }}
              </span>
            </div>
          </div>

          <!-- Actions (visible on hover) -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1">
            <button
              @click="openEditModal(dept)"
              class="p-1.5 rounded-lg text-[#414A4D]/40 hover:text-[#A8845A] hover:bg-[#FFF8F2] transition"
              title="Chỉnh sửa"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(dept)"
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

        <!-- Description -->
        <p v-if="dept.description" class="text-xs text-[#414A4D]/60 line-clamp-2 mb-4">{{ dept.description }}</p>
        <p v-else class="text-xs text-[#414A4D]/30 italic mb-4">Chưa có mô tả</p>

        <!-- Employee Count -->
        <div class="flex items-center gap-2 pt-3 border-t border-[#F0F5F9]">
          <svg class="w-4 h-4 text-[#A9B8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-xs text-[#414A4D]/60">
            <span class="font-semibold text-[#414A4D]">{{ dept.employeeCount ?? employeeCountMap[dept.id] ?? 0 }}</span> nhân viên
          </span>
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
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#DDE8EF]">
          <h2 class="text-base font-semibold text-[#0F2E4A]">
            {{ isEditing ? 'Chỉnh sửa Phòng ban' : 'Thêm Phòng ban mới' }}
          </h2>
          <button @click="closeModal" class="p-1 text-[#414A4D]/40 hover:text-[#414A4D] rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <!-- Tên -->
          <div>
            <label class="block text-sm font-medium text-[#414A4D] mb-1.5">
              Tên phòng ban <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="VD: Phòng Kinh doanh, Phòng Kỹ thuật"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/30"
              :class="{ 'border-red-400': formErrors.name }"
            />
            <p v-if="formErrors.name" class="text-xs text-red-500 mt-1">{{ formErrors.name }}</p>
          </div>

          <!-- Mã -->
          <div>
            <label class="block text-sm font-medium text-[#414A4D] mb-1.5">
              Mã phòng ban <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.code"
              type="text"
              placeholder="VD: DEPT-KD, TECH"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm font-mono text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition uppercase placeholder:normal-case placeholder:text-[#414A4D]/30"
              :class="{ 'border-red-400': formErrors.code }"
              @input="form.code = (form.code as string).toUpperCase()"
            />
            <p v-if="formErrors.code" class="text-xs text-red-500 mt-1">{{ formErrors.code }}</p>
            <p class="text-xs text-[#414A4D]/40 mt-1">Chỉ dùng chữ hoa, số, dấu gạch ngang (-) hoặc gạch dưới (_)</p>
          </div>

          <!-- Mô tả -->
          <div>
            <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Mô tả</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Mô tả chức năng, nhiệm vụ của phòng ban (tuỳ chọn)"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition resize-none placeholder:text-[#414A4D]/30"
            />
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
              Xóa phòng ban <span class="font-medium text-[#414A4D]">{{ deleteTarget.name }}</span>?
            </p>
          </div>
        </div>
        <p class="text-xs text-[#414A4D]/40 mb-5">Hành động này không thể hoàn tác. Các nhân viên trong phòng ban sẽ không bị xóa.</p>
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
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import departmentService from '@/services/departmentService'
import employeeService from '@/services/employeeService'
import type { DepartmentResponse } from '@/types/department'

const departments = ref<DepartmentResponse[]>([])
// departmentId → số nhân viên (tính client-side vì BE không trả về field này)
const employeeCountMap = ref<Record<string, number>>({})
const loading = ref(false)
const error = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ name: '', code: '', description: '' })
const formErrors = ref<{ name?: string; code?: string }>({})
const submitting = ref(false)
const submitError = ref('')

const deleteTarget = ref<DepartmentResponse | null>(null)
const deleting = ref(false)

const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

async function fetchDepartments() {
  loading.value = true
  error.value = ''
  try {
    const [deptRes, empRes] = await Promise.all([
      departmentService.getAll(),
      employeeService.getList({ size: 500 }),
    ])

    // Parse departments
    const rawDept: any = deptRes.data?.data ?? deptRes.data
    departments.value = Array.isArray(rawDept) ? rawDept : (rawDept?.content ?? [])

    // Build count map từ employees
    const rawEmp = (empRes.data as any)?.data ?? empRes.data
    const empList: any[] = Array.isArray(rawEmp) ? rawEmp : (rawEmp?.content ?? [])
    const countMap: Record<string, number> = {}
    empList.forEach(e => {
      if (e.departmentId) countMap[e.departmentId] = (countMap[e.departmentId] ?? 0) + 1
    })
    employeeCountMap.value = countMap
  } catch {
    error.value = 'Không thể tải danh sách phòng ban'
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', code: '', description: '' }
  formErrors.value = {}
  submitError.value = ''
  showModal.value = true
}

function openEditModal(dept: DepartmentResponse) {
  isEditing.value = true
  editingId.value = dept.id
  form.value = { name: dept.name, code: dept.code, description: dept.description ?? '' }
  formErrors.value = {}
  submitError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function validateForm(): boolean {
  formErrors.value = {}
  if (!form.value.name.trim()) formErrors.value.name = 'Tên không được để trống'
  if (!form.value.code.trim()) {
    formErrors.value.code = 'Mã không được để trống'
  } else if (!/^[-A-Z0-9_]+$/.test(form.value.code)) {
    formErrors.value.code = 'Chỉ dùng chữ hoa, số, dấu - hoặc _'
  }
  return Object.keys(formErrors.value).length === 0
}

async function submitForm() {
  if (!validateForm()) return
  submitting.value = true
  submitError.value = ''
  try {
    const payload = {
      name: form.value.name.trim(),
      code: form.value.code.trim(),
      description: form.value.description.trim() || undefined,
    }
    if (isEditing.value && editingId.value) {
      await departmentService.update(editingId.value, payload)
      showToast('success', 'Đã cập nhật phòng ban')
    } else {
      await departmentService.create(payload)
      showToast('success', 'Đã tạo phòng ban mới')
    }
    closeModal()
    await fetchDepartments()
  } catch (e: any) {
    submitError.value = e?.response?.data?.message
      || e?.response?.data?.error
      || 'Có lỗi xảy ra'
  } finally {
    submitting.value = false
  }
}

function confirmDelete(dept: DepartmentResponse) {
  deleteTarget.value = dept
}

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await departmentService.deleteById(deleteTarget.value.id)
    departments.value = departments.value.filter(d => d.id !== deleteTarget.value!.id)
    showToast('success', 'Đã xóa phòng ban')
    deleteTarget.value = null
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Xóa thất bại')
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(fetchDepartments)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
.line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
</style>
