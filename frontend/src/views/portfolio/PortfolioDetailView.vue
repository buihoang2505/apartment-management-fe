<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">

    <!-- Back -->
    <button @click="router.push('/portfolios')" class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#A8845A] transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Quay lại Portfolio
    </button>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-4 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 mb-3">{{ loadError }}</p>
      <button @click="fetchPortfolio" class="text-sm text-red-500 underline">Thử lại</button>
    </div>

    <template v-else-if="portfolio">
      <!-- Header card -->
      <div class="bg-white rounded-2xl border border-[#DDE8EF] p-6">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div v-if="!editingInfo">
              <h1 class="text-2xl font-bold text-[#0F2E4A]">{{ portfolio.name }}</h1>
              <p v-if="portfolio.description" class="text-gray-500 text-sm mt-1">{{ portfolio.description }}</p>
              <p v-else class="text-gray-300 text-sm mt-1 italic">Không có mô tả</p>
              <p class="text-xs text-gray-400 mt-3">
                Tạo lúc {{ formatDate(portfolio.createdAt) }}
              </p>
            </div>
            <form v-else @submit.prevent="saveInfo" class="space-y-3">
              <div>
                <input
                  v-model="infoForm.name"
                  type="text"
                  placeholder="Tên portfolio"
                  class="w-full px-4 py-2.5 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
                  :class="{ 'border-red-400': infoErrors.name }"
                />
                <p v-if="infoErrors.name" class="text-xs text-red-500 mt-1">{{ infoErrors.name }}</p>
              </div>
              <textarea
                v-model="infoForm.description"
                rows="2"
                placeholder="Mô tả (tuỳ chọn)"
                class="w-full px-4 py-2.5 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition resize-none"
              />
              <p v-if="infoError" class="text-xs text-red-500">{{ infoError }}</p>
              <div class="flex gap-2">
                <button
                  type="submit"
                  :disabled="savingInfo"
                  class="px-4 py-2 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center gap-2"
                >
                  <span v-if="savingInfo" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Lưu
                </button>
                <button type="button" @click="cancelEditInfo" class="px-4 py-2 border border-[#DDE8EF] text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition">
                  Huỷ
                </button>
              </div>
            </form>
          </div>
          <button
            v-if="!editingInfo"
            @click="startEditInfo"
            class="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-[#A8845A] border border-[#DDE8EF] hover:border-[#A8845A] rounded-xl transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Chỉnh sửa
          </button>
        </div>
      </div>

      <!-- Zones section -->
      <div class="bg-white rounded-2xl border border-[#DDE8EF]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#DDE8EF]">
          <div>
            <h2 class="font-semibold text-[#0F2E4A]">Phân khu</h2>
            <p class="text-xs text-gray-400 mt-0.5">{{ portfolio.zones?.length ?? 0 }} phân khu trong portfolio này</p>
          </div>
          <button
            @click="openAddZoneModal"
            class="flex items-center gap-1.5 px-3 py-2 bg-[#A8845A] hover:bg-[#8f6e4a] text-white text-sm font-medium rounded-xl transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Thêm Phân khu
          </button>
        </div>

        <!-- Empty zones -->
        <div v-if="!portfolio.zones?.length" class="px-6 py-12 text-center">
          <div class="w-12 h-12 bg-[#F0F7FF] rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-[#A9B8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <p class="text-sm text-gray-400">Chưa có phân khu nào</p>
        </div>

        <!-- Zone list -->
        <div v-else class="divide-y divide-[#F0F5F9]">
          <div
            v-for="zone in portfolio.zones"
            :key="zone.id"
            class="flex items-center justify-between px-6 py-4 hover:bg-[#FAFCFE] transition group"
          >
            <div
              class="flex items-center gap-3 flex-1 cursor-pointer"
              @click="router.push(`/zones/${zone.id}`)"
            >
              <div class="w-9 h-9 rounded-xl bg-[#E8F4FD] flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-[#4A90B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-[#0F2E4A] group-hover:text-[#A8845A] transition-colors">
                  {{ zone.name }}
                </p>
                <p class="text-xs text-gray-400 mt-0.5">
                  <span class="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{{ zone.code }}</span>
                  <span v-if="zone.description" class="ml-2">{{ zone.description }}</span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click="router.push(`/zones/${zone.id}`)"
                class="p-1.5 text-gray-400 hover:text-[#A8845A] rounded-lg transition"
                title="Xem chi tiết"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                @click="confirmRemoveZone(zone)"
                class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Gỡ khỏi portfolio"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

  <!-- Add Zone Modal -->
  <Teleport to="body">
    <div
      v-if="showZoneModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="closeZoneModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#DDE8EF]">
          <h2 class="text-base font-semibold text-[#0F2E4A]">Thêm Phân khu mới</h2>
          <button @click="closeZoneModal" class="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitAddZone" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Tên phân khu <span class="text-red-500">*</span>
            </label>
            <input
              v-model="zoneForm.name"
              type="text"
              placeholder="VD: Khu A, Phân khu Bắc"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
              :class="{ 'border-red-400': zoneErrors.name }"
            />
            <p v-if="zoneErrors.name" class="text-xs text-red-500 mt-1">{{ zoneErrors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Mã phân khu <span class="text-red-500">*</span>
            </label>
            <input
              v-model="zoneForm.code"
              type="text"
              placeholder="VD: ZONE-A, KHU-BAC"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm font-mono outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition uppercase"
              :class="{ 'border-red-400': zoneErrors.code }"
              @input="zoneForm.code = (zoneForm.code as string).toUpperCase()"
            />
            <p v-if="zoneErrors.code" class="text-xs text-red-500 mt-1">{{ zoneErrors.code }}</p>
            <p class="text-xs text-gray-400 mt-1">Chỉ dùng chữ hoa, số, dấu gạch ngang (-) hoặc gạch dưới (_)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea
              v-model="zoneForm.description"
              rows="2"
              placeholder="Mô tả (tuỳ chọn)"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition resize-none"
            />
          </div>

          <p v-if="zoneSubmitError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ zoneSubmitError }}</p>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="closeZoneModal"
              class="flex-1 px-4 py-2.5 border border-[#DDE8EF] text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Huỷ
            </button>
            <button
              type="submit"
              :disabled="submittingZone"
              class="flex-1 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              <span v-if="submittingZone" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Tạo & Thêm vào Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Remove Zone Confirm -->
  <Teleport to="body">
    <div
      v-if="removeZoneTarget"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="removeZoneTarget = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-[#0F2E4A]">Gỡ khỏi Portfolio?</h3>
            <p class="text-sm text-gray-500 mt-0.5">
              Phân khu <span class="font-medium text-gray-700">{{ removeZoneTarget.name }}</span> sẽ bị gỡ.
            </p>
          </div>
        </div>
        <p class="text-xs text-gray-400 mb-5">Zone vẫn tồn tại trong hệ thống, chỉ bị gỡ khỏi portfolio này.</p>
        <div class="flex gap-3">
          <button
            @click="removeZoneTarget = null"
            class="flex-1 px-4 py-2.5 border border-[#DDE8EF] text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
          >
            Huỷ
          </button>
          <button
            @click="doRemoveZone"
            :disabled="removingZone"
            class="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
          >
            <span v-if="removingZone" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Gỡ
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
import { useRouter, useRoute } from 'vue-router'
import portfolioService from '@/services/portfolioService'
import zoneService from '@/services/zoneService'
import type { Portfolio } from '@/types/portfolio'
import type { ZoneResponse } from '@/types/zone'

const router = useRouter()
const route = useRoute()
const portfolioId = route.params.id as string

const portfolio = ref<Portfolio | null>(null)
const loading = ref(false)
const loadError = ref('')

// Edit info
const editingInfo = ref(false)
const infoForm = ref({ name: '', description: '' })
const infoErrors = ref<{ name?: string }>({})
const infoError = ref('')
const savingInfo = ref(false)

// Add zone modal
const showZoneModal = ref(false)
const zoneForm = ref({ name: '', code: '', description: '' })
const zoneErrors = ref<{ name?: string; code?: string }>({})
const zoneSubmitError = ref('')
const submittingZone = ref(false)

// Remove zone
const removeZoneTarget = ref<ZoneResponse | null>(null)
const removingZone = ref(false)

// Toast
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

async function fetchPortfolio() {
  loading.value = true
  loadError.value = ''
  try {
    const res = await portfolioService.getById(portfolioId)
    portfolio.value = res.data.data
  } catch {
    loadError.value = 'Không thể tải thông tin portfolio'
  } finally {
    loading.value = false
  }
}

// --- Edit info ---
function startEditInfo() {
  if (!portfolio.value) return
  infoForm.value = { name: portfolio.value.name, description: portfolio.value.description ?? '' }
  infoErrors.value = {}
  infoError.value = ''
  editingInfo.value = true
}

function cancelEditInfo() {
  editingInfo.value = false
}

async function saveInfo() {
  infoErrors.value = {}
  if (!infoForm.value.name.trim()) {
    infoErrors.value.name = 'Tên không được để trống'
    return
  }
  savingInfo.value = true
  infoError.value = ''
  try {
    const currentZoneIds = portfolio.value?.zones?.map(z => z.id) ?? []
    const res = await portfolioService.update(portfolioId, {
      name: infoForm.value.name.trim(),
      description: infoForm.value.description.trim() || undefined,
      zoneIds: currentZoneIds,
    })
    portfolio.value = res.data.data
    editingInfo.value = false
    showToast('success', 'Đã lưu thay đổi')
  } catch (e: any) {
    infoError.value = e?.response?.data?.message ?? 'Lưu thất bại'
  } finally {
    savingInfo.value = false
  }
}

// --- Add zone ---
function openAddZoneModal() {
  zoneForm.value = { name: '', code: '', description: '' }
  zoneErrors.value = {}
  zoneSubmitError.value = ''
  showZoneModal.value = true
}

function closeZoneModal() {
  showZoneModal.value = false
}

function validateZoneForm(): boolean {
  zoneErrors.value = {}
  if (!zoneForm.value.name.trim()) {
    zoneErrors.value.name = 'Tên phân khu không được để trống'
  }
  if (!zoneForm.value.code.trim()) {
    zoneErrors.value.code = 'Mã phân khu không được để trống'
  } else if (!/^[-A-Z0-9_]+$/.test(zoneForm.value.code)) {
    zoneErrors.value.code = 'Chỉ dùng chữ hoa, số, dấu - hoặc _'
  }
  return Object.keys(zoneErrors.value).length === 0
}

async function submitAddZone() {
  if (!validateZoneForm()) return
  submittingZone.value = true
  zoneSubmitError.value = ''
  try {
    // 1. Create zone
    const zoneRes = await zoneService.create({
      name: zoneForm.value.name.trim(),
      code: zoneForm.value.code.trim(),
      description: zoneForm.value.description.trim() || undefined,
    })
    const newZone = zoneRes.data.data

    // 2. Add zone to portfolio
    const currentZoneIds = portfolio.value?.zones?.map(z => z.id) ?? []
    const updated = await portfolioService.update(portfolioId, {
      name: portfolio.value!.name,
      description: portfolio.value!.description,
      zoneIds: [...currentZoneIds, newZone.id],
    })
    portfolio.value = updated.data.data
    closeZoneModal()
    showToast('success', `Đã thêm phân khu "${newZone.name}"`)
  } catch (e: any) {
    zoneSubmitError.value = e?.response?.data?.message ?? 'Có lỗi xảy ra'
  } finally {
    submittingZone.value = false
  }
}

// --- Remove zone ---
function confirmRemoveZone(zone: ZoneResponse) {
  removeZoneTarget.value = zone
}

async function doRemoveZone() {
  if (!removeZoneTarget.value || !portfolio.value) return
  removingZone.value = true
  try {
    const remainingIds = portfolio.value.zones
      .filter(z => z.id !== removeZoneTarget.value!.id)
      .map(z => z.id)
    const res = await portfolioService.update(portfolioId, {
      name: portfolio.value.name,
      description: portfolio.value.description,
      zoneIds: remainingIds,
    })
    portfolio.value = res.data.data
    showToast('success', `Đã gỡ phân khu "${removeZoneTarget.value.name}"`)
    removeZoneTarget.value = null
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Gỡ phân khu thất bại')
    removeZoneTarget.value = null
  } finally {
    removingZone.value = false
  }
}

onMounted(fetchPortfolio)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
