<template>
  <div class="p-6 space-y-5">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-[24px] font-semibold text-[#1A1A2E] leading-tight">Quản lý người dùng</h1>
        <p class="text-sm text-[#6B7280] mt-1">Tài khoản hệ thống — chỉ dành cho ADMIN</p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2.5 bg-[#414A4D] hover:bg-[#2D3436] text-white text-sm font-medium rounded-xl transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Thêm người dùng
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-4 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 mb-3">{{ error }}</p>
      <button @click="fetchUsers" class="text-sm text-red-500 underline">Thử lại</button>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-[12px] border border-[#E5E9EE] shadow-card overflow-hidden">
      <!-- Empty -->
      <div v-if="users.length === 0" class="p-16 text-center">
        <div class="w-14 h-14 bg-[#F5F6FA] rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-7 h-7 text-[#A9B8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p class="text-[#6B7280] text-sm">Chưa có tài khoản nào</p>
      </div>

      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-[#E5E9EE] bg-[#F9FAFB]">
            <th class="text-left px-5 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Người dùng</th>
            <th class="text-left px-5 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hidden sm:table-cell">Username</th>
            <th class="text-left px-5 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hidden md:table-cell">Email</th>
            <th class="text-left px-5 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Role</th>
            <th class="text-left px-5 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Trạng thái</th>
            <th class="text-left px-5 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hidden lg:table-cell">Ngày tạo</th>
            <th class="px-5 py-3 w-28"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#F3F4F6]">
          <tr
            v-for="u in users"
            :key="u.id"
            class="hover:bg-[#FAFAFA] transition-colors group"
            :class="{ 'opacity-60': !u.active }"
          >
            <!-- Avatar + Tên -->
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0"
                  :class="u.role === 'ADMIN' ? 'bg-[#E24B4A]' : 'bg-[#A8845A]'"
                >
                  {{ avatarLetter(u.fullName || u.username) }}
                </div>
                <div class="min-w-0">
                  <p class="font-medium text-[#1A1A2E] text-[13px] truncate">{{ u.fullName || u.username }}</p>
                  <p v-if="u.phone" class="text-[11px] text-[#9CA3AF] truncate">{{ u.phone }}</p>
                </div>
              </div>
            </td>

            <!-- Username -->
            <td class="px-5 py-3.5 hidden sm:table-cell">
              <span class="font-mono text-xs bg-[#F3F4F6] text-[#414A4D] px-2 py-1 rounded-md">{{ u.username }}</span>
            </td>

            <!-- Email -->
            <td class="px-5 py-3.5 hidden md:table-cell">
              <span class="text-[#6B7280] text-[13px]">{{ u.email }}</span>
            </td>

            <!-- Role badge -->
            <td class="px-5 py-3.5">
              <span
                class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                :class="u.role === 'ADMIN'
                  ? 'bg-[#E24B4A]/10 text-[#E24B4A]'
                  : 'bg-[#EF9F27]/10 text-[#EF9F27]'"
              >
                {{ u.role }}
              </span>
            </td>

            <!-- Status badge -->
            <td class="px-5 py-3.5">
              <span
                class="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
                :class="u.active
                  ? 'bg-[#1D9E75]/10 text-[#1D9E75]'
                  : 'bg-[#6B7280]/10 text-[#6B7280]'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="u.active ? 'bg-[#1D9E75]' : 'bg-[#9CA3AF]'" />
                {{ u.active ? 'Hoạt động' : 'Vô hiệu' }}
              </span>
            </td>

            <!-- Ngày tạo -->
            <td class="px-5 py-3.5 hidden lg:table-cell text-[#9CA3AF] text-[12px]">
              {{ formatDate(u.createdAt) }}
            </td>

            <!-- Actions -->
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <!-- Edit -->
                <button
                  @click="openEditModal(u)"
                  class="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#A8845A] hover:bg-[#FFF8F2] transition"
                  title="Chỉnh sửa"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <!-- Reset password -->
                <button
                  @click="openResetModal(u)"
                  class="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#414A4D] hover:bg-[#F0F2F3] transition"
                  title="Đặt lại mật khẩu"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </button>
                <!-- Delete (ẩn nếu là chính mình) -->
                <button
                  v-if="u.username !== currentUsername"
                  @click="confirmDelete(u)"
                  class="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition"
                  title="Xóa"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <!-- Self-delete disabled hint -->
                <span
                  v-else
                  class="p-1.5 rounded-lg text-[#D1D5DB] cursor-not-allowed"
                  title="Không thể xóa tài khoản của chính mình"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Modal Thêm/Sửa ── -->
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-[16px] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#E5E9EE] sticky top-0 bg-white z-10">
          <h2 class="text-[16px] font-semibold text-[#1A1A2E]">
            {{ isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới' }}
          </h2>
          <button @click="closeModal" class="p-1 text-[#9CA3AF] hover:text-[#414A4D] rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <!-- Họ tên -->
          <div>
            <label class="block text-[13px] font-medium text-[#414A4D] mb-1.5">Họ tên</label>
            <input
              v-model="form.fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              class="field"
            />
          </div>

          <!-- Username -->
          <div>
            <label class="block text-[13px] font-medium text-[#414A4D] mb-1.5">
              Username <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.username"
              type="text"
              placeholder="admin_user"
              :disabled="isEditing"
              class="field"
              :class="{ 'field-error': formErrors.username, 'opacity-60 cursor-not-allowed': isEditing }"
            />
            <p v-if="formErrors.username" class="text-xs text-red-500 mt-1">{{ formErrors.username }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-[13px] font-medium text-[#414A4D] mb-1.5">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="user@company.com"
              class="field"
              :class="{ 'field-error': formErrors.email }"
            />
            <p v-if="formErrors.email" class="text-xs text-red-500 mt-1">{{ formErrors.email }}</p>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-[13px] font-medium text-[#414A4D] mb-1.5">Số điện thoại</label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="0901 234 567"
              class="field"
            />
          </div>

          <!-- Mật khẩu — chỉ khi tạo mới -->
          <div v-if="!isEditing">
            <label class="block text-[13px] font-medium text-[#414A4D] mb-1.5">
              Mật khẩu <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              class="field"
              :class="{ 'field-error': formErrors.password }"
            />
            <p v-if="formErrors.password" class="text-xs text-red-500 mt-1">{{ formErrors.password }}</p>
          </div>

          <!-- Role + Status (2 cols) -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[13px] font-medium text-[#414A4D] mb-1.5">
                Role <span class="text-red-500">*</span>
              </label>
              <select v-model="form.role" class="field">
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <label class="block text-[13px] font-medium text-[#414A4D] mb-1.5">Trạng thái</label>
              <select v-model="form.active" class="field">
                <option :value="true">Hoạt động</option>
                <option :value="false">Vô hiệu</option>
              </select>
            </div>
          </div>

          <p v-if="submitError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ submitError }}</p>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeModal" class="btn-secondary flex-1">Huỷ</button>
            <button type="submit" :disabled="submitting" class="btn-primary flex-1">
              <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {{ isEditing ? 'Lưu thay đổi' : 'Tạo tài khoản' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- ── Modal Reset Password ── -->
  <Teleport to="body">
    <div
      v-if="resetTarget"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="resetTarget = null"
    >
      <div class="bg-white rounded-[16px] shadow-2xl w-full max-w-sm">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#E5E9EE]">
          <div>
            <h2 class="text-[16px] font-semibold text-[#1A1A2E]">Đặt lại mật khẩu</h2>
            <p class="text-[12px] text-[#6B7280] mt-0.5">
              Tài khoản: <span class="font-mono font-medium text-[#414A4D]">{{ resetTarget.username }}</span>
            </p>
          </div>
          <button @click="resetTarget = null" class="p-1 text-[#9CA3AF] hover:text-[#414A4D] rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitReset" class="p-6 space-y-4">
          <div>
            <label class="block text-[13px] font-medium text-[#414A4D] mb-1.5">
              Mật khẩu mới <span class="text-red-500">*</span>
            </label>
            <input
              v-model="resetForm.newPassword"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              class="field"
              :class="{ 'field-error': resetErrors.newPassword }"
            />
            <p v-if="resetErrors.newPassword" class="text-xs text-red-500 mt-1">{{ resetErrors.newPassword }}</p>
          </div>
          <div>
            <label class="block text-[13px] font-medium text-[#414A4D] mb-1.5">
              Xác nhận mật khẩu <span class="text-red-500">*</span>
            </label>
            <input
              v-model="resetForm.confirm"
              type="password"
              placeholder="Nhập lại mật khẩu"
              class="field"
              :class="{ 'field-error': resetErrors.confirm }"
            />
            <p v-if="resetErrors.confirm" class="text-xs text-red-500 mt-1">{{ resetErrors.confirm }}</p>
          </div>

          <p v-if="resetError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ resetError }}</p>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="resetTarget = null" class="btn-secondary flex-1">Huỷ</button>
            <button type="submit" :disabled="resetting" class="btn-primary flex-1">
              <span v-if="resetting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đặt lại
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- ── Confirm Delete ── -->
  <Teleport to="body">
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="deleteTarget = null"
    >
      <div class="bg-white rounded-[16px] shadow-2xl w-full max-w-sm p-6">
        <div class="flex items-start gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-[#1A1A2E]">Xác nhận xóa tài khoản</h3>
            <p class="text-[13px] text-[#6B7280] mt-1">
              Bạn có chắc muốn xóa tài khoản
              <span class="font-mono font-semibold text-[#414A4D]">{{ deleteTarget.username }}</span> không?
            </p>
          </div>
        </div>
        <div class="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-5 flex items-center gap-2">
          <svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <p class="text-[12px] text-red-600">Hành động này không thể hoàn tác.</p>
        </div>
        <div class="flex gap-3">
          <button @click="deleteTarget = null" class="btn-secondary flex-1">Huỷ</button>
          <button
            @click="doDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
          >
            <span v-if="deleting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Xóa tài khoản
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
        :class="toast.type === 'success' ? 'bg-[#1A1A2E]' : 'bg-red-500'"
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
import { ref, computed, onMounted } from 'vue'
import adminUserService from '@/services/adminUserService'
import { useAuthStore } from '@/stores/authStore'
import type { AdminUserResponse, UserRole } from '@/types/adminUser'

const authStore = useAuthStore()
const currentUsername = computed(() => authStore.user?.username ?? '')

// ── State ───────────────────────────────────────────
const users   = ref<AdminUserResponse[]>([])
const loading = ref(false)
const error   = ref('')

// Create/Edit modal
const showModal  = ref(false)
const isEditing  = ref(false)
const editingId  = ref<string | null>(null)

const emptyForm = () => ({
  fullName: '', username: '', email: '', phone: '',
  password: '', role: 'MANAGER' as UserRole, active: true,
})
const form       = ref(emptyForm())
const formErrors = ref<{ username?: string; email?: string; password?: string }>({})
const submitting = ref(false)
const submitError = ref('')

// Reset password modal
const resetTarget = ref<AdminUserResponse | null>(null)
const resetForm   = ref({ newPassword: '', confirm: '' })
const resetErrors = ref<{ newPassword?: string; confirm?: string }>({})
const resetting   = ref(false)
const resetError  = ref('')

// Delete
const deleteTarget = ref<AdminUserResponse | null>(null)
const deleting     = ref(false)

// Toast
const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

// ── Helpers ─────────────────────────────────────────
function avatarLetter(name: string) {
  return (name || '?').trim().charAt(0).toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

// ── Fetch ────────────────────────────────────────────
async function fetchUsers() {
  loading.value = true
  error.value = ''
  try {
    const res = await adminUserService.getAll()
    const raw: any = res.data?.data ?? (res.data as any)
    users.value = Array.isArray(raw) ? raw : (raw?.content ?? [])
  } catch {
    error.value = 'Không thể tải danh sách người dùng'
  } finally {
    loading.value = false
  }
}

// ── Create / Edit modal ──────────────────────────────
function openCreateModal() {
  isEditing.value  = false
  editingId.value  = null
  form.value       = emptyForm()
  formErrors.value = {}
  submitError.value = ''
  showModal.value  = true
}

function openEditModal(u: AdminUserResponse) {
  isEditing.value  = true
  editingId.value  = u.id
  form.value = {
    fullName: u.fullName ?? '',
    username: u.username,
    email: u.email,
    phone: u.phone ?? '',
    password: '',
    role: u.role,
    active: u.active,
  }
  formErrors.value  = {}
  submitError.value = ''
  showModal.value   = true
}

function closeModal() { showModal.value = false }

function validateForm(): boolean {
  formErrors.value = {}
  if (!form.value.username.trim()) {
    formErrors.value.username = 'Username không được để trống'
  } else if (/\s/.test(form.value.username)) {
    formErrors.value.username = 'Username không được chứa khoảng trắng'
  }
  if (!form.value.email.trim()) {
    formErrors.value.email = 'Email không được để trống'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim())) {
    formErrors.value.email = 'Email không đúng định dạng'
  }
  if (!isEditing.value) {
    if (!form.value.password) {
      formErrors.value.password = 'Mật khẩu không được để trống'
    } else if (form.value.password.length < 6) {
      formErrors.value.password = 'Mật khẩu tối thiểu 6 ký tự'
    }
  }
  return Object.keys(formErrors.value).length === 0
}

async function submitForm() {
  if (!validateForm()) return
  submitting.value  = true
  submitError.value = ''
  try {
    if (isEditing.value && editingId.value) {
      const payload: Record<string, unknown> = {
        fullName: form.value.fullName.trim() || undefined,
        email:    form.value.email.trim(),
        phone:    form.value.phone.trim() || undefined,
        role:     form.value.role,
        active:   form.value.active,
      }
      await adminUserService.update(editingId.value, payload)
      showToast('success', 'Đã cập nhật tài khoản')
    } else {
      const payload: Record<string, unknown> = {
        username: form.value.username.trim(),
        password: form.value.password,
        email:    form.value.email.trim(),
        role:     form.value.role,
      }
      if (form.value.fullName.trim()) payload.fullName = form.value.fullName.trim()
      if (form.value.phone.trim())    payload.phone    = form.value.phone.trim()
      await adminUserService.create(payload)
      showToast('success', 'Đã tạo tài khoản mới')
    }
    closeModal()
    await fetchUsers()
  } catch (e: any) {
    submitError.value = e?.response?.data?.message
      || e?.response?.data?.error
      || 'Có lỗi xảy ra'
  } finally {
    submitting.value = false
  }
}

// ── Reset password ───────────────────────────────────
function openResetModal(u: AdminUserResponse) {
  resetTarget.value = u
  resetForm.value   = { newPassword: '', confirm: '' }
  resetErrors.value = {}
  resetError.value  = ''
}

function validateReset(): boolean {
  resetErrors.value = {}
  if (!resetForm.value.newPassword) {
    resetErrors.value.newPassword = 'Mật khẩu không được để trống'
  } else if (resetForm.value.newPassword.length < 8) {
    resetErrors.value.newPassword = 'Mật khẩu tối thiểu 8 ký tự'
  }
  if (resetForm.value.newPassword !== resetForm.value.confirm) {
    resetErrors.value.confirm = 'Mật khẩu xác nhận không khớp'
  }
  return Object.keys(resetErrors.value).length === 0
}

async function submitReset() {
  if (!validateReset() || !resetTarget.value) return
  resetting.value  = true
  resetError.value = ''
  try {
    await adminUserService.resetPassword(resetTarget.value.id, { newPassword: resetForm.value.newPassword })
    showToast('success', 'Đã đặt lại mật khẩu thành công')
    resetTarget.value = null
  } catch (e: any) {
    resetError.value = e?.response?.data?.message || 'Có lỗi xảy ra'
  } finally {
    resetting.value = false
  }
}

// ── Delete ───────────────────────────────────────────
function confirmDelete(u: AdminUserResponse) {
  deleteTarget.value = u
}

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await adminUserService.deleteById(deleteTarget.value.id)
    showToast('success', 'Đã xóa tài khoản')
    deleteTarget.value = null
    await fetchUsers()
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Xóa thất bại')
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.field {
  @apply w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E9EE] rounded-xl text-[13px] text-[#414A4D] outline-none
         focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition
         placeholder:text-[#9CA3AF];
}
.field-error {
  @apply border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/20;
}
.btn-primary {
  @apply px-4 py-2.5 bg-[#414A4D] hover:bg-[#2D3436] disabled:opacity-60
         text-white text-sm font-medium rounded-xl transition
         flex items-center justify-center gap-2;
}
.btn-secondary {
  @apply px-4 py-2.5 border border-[#E5E9EE] text-[#414A4D] text-sm font-medium
         rounded-xl hover:bg-[#F5F6FA] transition;
}

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
