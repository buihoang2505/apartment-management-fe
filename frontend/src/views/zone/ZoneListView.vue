<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-[#0F2E4A]">Phân khu</h1>
        <p class="text-sm text-gray-500 mt-1">Quản lý các phân khu trong dự án</p>
      </div>
      <button
        @click="openCreateModal"
        class="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap flex-shrink-0"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Thêm Phân khu
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-4 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 mb-3">{{ error }}</p>
      <button @click="fetchZones" class="text-sm text-red-500 underline">Thử lại</button>
    </div>

    <!-- Empty -->
    <div v-else-if="zones.length === 0" class="bg-white rounded-2xl border border-[#DDE8EF] p-16 text-center">
      <div class="w-16 h-16 bg-[#F0F7FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[#A9B8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
      </div>
      <p class="text-gray-500 text-sm">Chưa có phân khu nào</p>
      <button @click="openCreateModal" class="mt-4 text-sm text-[#A8845A] font-medium underline">
        Tạo phân khu đầu tiên
      </button>
    </div>

    <!-- Zone table -->
    <div v-else class="bg-white rounded-2xl border border-[#DDE8EF] overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-[#F6F9FB] border-b border-[#DDE8EF]">
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tên phân khu</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mã</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Mô tả</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Ngày tạo</th>
            <th class="px-6 py-3 w-24"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#F0F5F9]">
          <tr
            v-for="zone in zones"
            :key="zone.id"
            class="hover:bg-[#FAFCFE] transition group"
          >
            <td class="px-6 py-4">
              <button
                @click="router.push(`/zones/${zone.id}`)"
                class="font-medium text-[#0F2E4A] hover:text-[#A8845A] transition-colors text-left"
              >
                {{ zone.name }}
              </button>
            </td>
            <td class="px-6 py-4">
              <span class="font-mono text-xs bg-[#F0F5F9] text-gray-600 px-2 py-1 rounded-lg">{{ zone.code }}</span>
            </td>
            <td class="px-6 py-4 hidden md:table-cell">
              <span v-if="zone.description" class="text-gray-500 line-clamp-1">{{ zone.description }}</span>
              <span v-else class="text-gray-300 italic">—</span>
            </td>
            <td class="px-6 py-4 hidden sm:table-cell text-gray-400 text-xs">
              {{ formatDate(zone.createdAt) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                <button
                  @click="openEditModal(zone)"
                  class="p-1.5 rounded-lg text-gray-400 hover:text-[#A8845A] hover:bg-[#FFF8F2] transition"
                  title="Chỉnh sửa"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(zone)"
                  class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                  title="Xóa"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  @click="router.push(`/zones/${zone.id}`)"
                  class="p-1.5 rounded-lg text-gray-400 hover:text-[#4A90B8] hover:bg-[#E8F4FD] transition"
                  title="Xem chi tiết"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
            {{ isEditing ? 'Chỉnh sửa Phân khu' : 'Thêm Phân khu mới' }}
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
              Tên phân khu <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="VD: Khu A, Phân khu Bắc"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
              :class="{ 'border-red-400': formErrors.name }"
            />
            <p v-if="formErrors.name" class="text-xs text-red-500 mt-1">{{ formErrors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Mã phân khu <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.code"
              type="text"
              placeholder="VD: ZONE-A, KHU-BAC"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm font-mono outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition uppercase"
              :class="{ 'border-red-400': formErrors.code }"
              @input="form.code = (form.code as string).toUpperCase()"
            />
            <p v-if="formErrors.code" class="text-xs text-red-500 mt-1">{{ formErrors.code }}</p>
            <p class="text-xs text-gray-400 mt-1">Chỉ dùng chữ hoa, số, dấu gạch ngang (-) hoặc gạch dưới (_)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Mô tả (tuỳ chọn)"
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
              Xóa phân khu <span class="font-medium text-gray-700">{{ deleteTarget.name }}</span>?
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
import zoneService from '@/services/zoneService'
import type { ZoneResponse } from '@/types/zone'

const router = useRouter()

const zones = ref<ZoneResponse[]>([])
const loading = ref(false)
const error = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ name: '', code: '', description: '' })
const formErrors = ref<{ name?: string; code?: string }>({})
const submitting = ref(false)
const submitError = ref('')

const deleteTarget = ref<ZoneResponse | null>(null)
const deleting = ref(false)

const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function fetchZones() {
  loading.value = true
  error.value = ''
  try {
    const res = await zoneService.getAll()
    zones.value = res.data.data ?? []
  } catch {
    error.value = 'Không thể tải danh sách phân khu'
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

function openEditModal(zone: ZoneResponse) {
  isEditing.value = true
  editingId.value = zone.id
  form.value = { name: zone.name, code: zone.code, description: zone.description ?? '' }
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
      const res = await zoneService.update(editingId.value, payload)
      const idx = zones.value.findIndex(z => z.id === editingId.value)
      if (idx !== -1) zones.value[idx] = res.data.data
      showToast('success', 'Đã cập nhật phân khu')
    } else {
      const res = await zoneService.create(payload)
      zones.value.unshift(res.data.data)
      showToast('success', 'Đã tạo phân khu mới')
    }
    closeModal()
  } catch (e: any) {
    submitError.value = e?.response?.data?.message ?? 'Có lỗi xảy ra'
  } finally {
    submitting.value = false
  }
}

function confirmDelete(zone: ZoneResponse) {
  deleteTarget.value = zone
}

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await zoneService.deleteById(deleteTarget.value.id)
    zones.value = zones.value.filter(z => z.id !== deleteTarget.value!.id)
    showToast('success', 'Đã xóa phân khu')
    deleteTarget.value = null
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Xóa thất bại')
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(fetchZones)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
.line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
</style>
