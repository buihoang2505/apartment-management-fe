<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#0F2E4A]">Portfolio</h1>
        <p class="text-sm text-gray-500 mt-1">Quản lý danh mục đầu tư</p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] text-white text-sm font-medium rounded-xl transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Thêm Portfolio
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-4 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 mb-3">{{ error }}</p>
      <button @click="fetchPortfolios" class="text-sm text-red-500 underline">Thử lại</button>
    </div>

    <!-- Empty -->
    <div v-else-if="portfolios.length === 0" class="bg-white rounded-2xl border border-[#DDE8EF] p-16 text-center">
      <div class="w-16 h-16 bg-[#F0F7FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[#A8845A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p class="text-gray-500 text-sm">Chưa có portfolio nào</p>
      <button @click="openCreateModal" class="mt-4 text-sm text-[#A8845A] font-medium underline">
        Tạo portfolio đầu tiên
      </button>
    </div>

    <!-- Portfolio Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="p in portfolios"
        :key="p.id"
        class="bg-white rounded-2xl border border-[#DDE8EF] p-5 hover:shadow-md transition-shadow group"
      >
        <!-- Card header -->
        <div class="flex items-start justify-between mb-3">
          <div
            class="flex-1 cursor-pointer"
            @click="router.push(`/portfolios/${p.id}`)"
          >
            <h3 class="font-semibold text-[#0F2E4A] text-base group-hover:text-[#A8845A] transition-colors line-clamp-1">
              {{ p.name }}
            </h3>
            <p v-if="p.description" class="text-sm text-gray-400 mt-1 line-clamp-2">{{ p.description }}</p>
            <p v-else class="text-sm text-gray-300 mt-1 italic">Không có mô tả</p>
          </div>
          <div class="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="openEditModal(p)"
              class="p-1.5 rounded-lg text-gray-400 hover:text-[#A8845A] hover:bg-[#FFF8F2] transition-colors"
              title="Chỉnh sửa"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click.stop="confirmDelete(p)"
              class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Xóa"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-4 pt-3 border-t border-[#F0F5F9]">
          <div class="flex items-center gap-1.5 text-sm text-gray-500">
            <svg class="w-4 h-4 text-[#A9B8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{{ p.zones?.length ?? 0 }} phân khu</span>
          </div>
          <button
            @click="router.push(`/portfolios/${p.id}`)"
            class="ml-auto text-xs text-[#A8845A] hover:underline font-medium"
          >
            Xem chi tiết →
          </button>
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
            {{ isEditing ? 'Chỉnh sửa Portfolio' : 'Thêm Portfolio mới' }}
          </h2>
          <button @click="closeModal" class="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Tên Portfolio <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nhập tên portfolio"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
              :class="{ 'border-red-400': formErrors.name }"
            />
            <p v-if="formErrors.name" class="text-xs text-red-500 mt-1">{{ formErrors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Nhập mô tả (tuỳ chọn)"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition resize-none"
            />
          </div>

          <p v-if="submitError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ submitError }}</p>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2.5 border border-[#DDE8EF] text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
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
            <p class="text-sm text-gray-500 mt-0.5">
              Xóa portfolio <span class="font-medium text-gray-700">{{ deleteTarget.name }}</span>?
            </p>
          </div>
        </div>
        <p class="text-xs text-gray-400 mb-5">Hành động này không thể hoàn tác.</p>
        <div class="flex gap-3">
          <button
            @click="deleteTarget = null"
            class="flex-1 px-4 py-2.5 border border-[#DDE8EF] text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
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
import { useRouter } from 'vue-router'
import portfolioService from '@/services/portfolioService'
import type { Portfolio } from '@/types/portfolio'

const router = useRouter()

const portfolios = ref<Portfolio[]>([])
const loading = ref(false)
const error = ref('')

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ name: '', description: '' })
const formErrors = ref<{ name?: string }>({})
const submitting = ref(false)
const submitError = ref('')

// Delete state
const deleteTarget = ref<Portfolio | null>(null)
const deleting = ref(false)

// Toast
const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

async function fetchPortfolios() {
  loading.value = true
  error.value = ''
  try {
    const res = await portfolioService.getAll()
    portfolios.value = res.data.data ?? []
  } catch {
    error.value = 'Không thể tải danh sách portfolio'
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', description: '' }
  formErrors.value = {}
  submitError.value = ''
  showModal.value = true
}

function openEditModal(p: Portfolio) {
  isEditing.value = true
  editingId.value = p.id
  form.value = { name: p.name, description: p.description ?? '' }
  formErrors.value = {}
  submitError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function validateForm(): boolean {
  formErrors.value = {}
  if (!form.value.name.trim()) {
    formErrors.value.name = 'Tên portfolio không được để trống'
    return false
  }
  return true
}

async function submitForm() {
  if (!validateForm()) return
  submitting.value = true
  submitError.value = ''
  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
    }
    if (isEditing.value && editingId.value) {
      const res = await portfolioService.update(editingId.value, payload)
      const updated = res.data.data
      const idx = portfolios.value.findIndex(p => p.id === editingId.value)
      if (idx !== -1) portfolios.value[idx] = updated
      showToast('success', 'Đã cập nhật portfolio')
    } else {
      const res = await portfolioService.create(payload)
      portfolios.value.unshift(res.data.data)
      showToast('success', 'Đã tạo portfolio mới')
    }
    closeModal()
  } catch (e: any) {
    submitError.value = e?.response?.data?.message ?? 'Có lỗi xảy ra, vui lòng thử lại'
  } finally {
    submitting.value = false
  }
}

function confirmDelete(p: Portfolio) {
  deleteTarget.value = p
}

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await portfolioService.deleteById(deleteTarget.value.id)
    portfolios.value = portfolios.value.filter(p => p.id !== deleteTarget.value!.id)
    showToast('success', 'Đã xóa portfolio')
    deleteTarget.value = null
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Xóa thất bại')
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(fetchPortfolios)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
.line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
.line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
</style>
