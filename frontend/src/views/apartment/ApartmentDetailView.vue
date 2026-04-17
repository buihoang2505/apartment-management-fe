<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <button
            @click="$router.push('/apartments')"
            class="text-[#A9B8A8] hover:text-[#414A4D] transition-colors"
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>
          <span class="text-[#A9B8A8] text-sm">Căn hộ</span>
        </div>
        <h2 class="text-[#0F2E4A] font-bold text-2xl">
          {{ isNew ? 'Thêm căn hộ mới' : 'Thông tin căn hộ' }}
        </h2>
        <p v-if="!isNew && original" class="text-[#7A9AAD] text-sm mt-0.5">
          Unit Reference: <strong class="text-[#414A4D]">{{ original.displayCode || original.unitCode }}</strong>
        </p>
      </div>

      <!-- Status badge -->
      <span
        v-if="!isNew && form.status"
        class="mt-1 text-xs font-bold px-3 py-1.5 rounded-full"
        :class="statusBadgeClass(form.status)"
      >
        {{ statusLabel(form.status) }}
      </span>
    </div>

    <!-- Page loading -->
    <div v-if="pageLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl h-20 animate-pulse" />
      </div>
      <div class="space-y-4">
        <div class="bg-white rounded-2xl h-48 animate-pulse" />
        <div class="bg-white rounded-2xl h-32 animate-pulse" />
      </div>
    </div>

    <!-- Page error -->
    <div v-else-if="pageError" class="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600 text-sm">
      {{ pageError }}
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" novalidate>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- LEFT: Core Details (2 cols) -->
        <div class="lg:col-span-2 space-y-5">

          <!-- Section: Core Details -->
          <div class="bg-white rounded-2xl p-6">
            <div class="flex items-center gap-2.5 mb-5">
              <div class="w-7 h-7 bg-[#0F2E4A] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="12" height="12" rx="2" stroke="white" stroke-width="1.3"/>
                  <path d="M4 5h6M4 8h4" stroke="white" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
              </div>
              <h3 class="text-[#0F2E4A] font-bold text-base">Core Details</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Unit Code -->
              <div class="sm:col-span-2">
                <FormField
                  label="MÃ CĂN (UNIT CODE)"
                  :error="errors.unitCode"
                  required
                >
                  <input
                    v-model="form.unitCode"
                    type="text"
                    placeholder="VD: D2503"
                    class="form-input"
                    :class="errors.unitCode ? 'border-red-400 focus:border-red-400' : ''"
                    @input="errors.unitCode = ''"
                  />
                </FormField>
              </div>

              <!-- Display Code -->
              <div>
                <FormField label="MÃ HIỂN THỊ (DISPLAY CODE)">
                  <input v-model="form.displayCode" type="text" placeholder="VD: Căn hộ A-1205" class="form-input" />
                </FormField>
              </div>

              <!-- Floor -->
              <div>
                <FormField label="TẦNG (FLOOR)">
                  <input v-model.number="form.floorNumber" type="number" min="0" placeholder="VD: 12" class="form-input" />
                </FormField>
              </div>

              <!-- Area -->
              <div>
                <FormField label="DIỆN TÍCH (S) (AREA)" :error="errors.area" required>
                  <div class="relative">
                    <input
                      v-model.number="form.area"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="VD: 54"
                      class="form-input pr-12"
                      :class="errors.area ? 'border-red-400 focus:border-red-400' : ''"
                      @input="errors.area = ''"
                    />
                    <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A9B8A8] text-sm font-medium">m²</span>
                  </div>
                </FormField>
              </div>

              <!-- Bedroom count -->
              <div>
                <FormField label="SỐ PHÒNG NGỦ (BEDROOMS)">
                  <input v-model.number="form.bedroomCount" type="number" min="0" placeholder="VD: 2" class="form-input" />
                </FormField>
              </div>

              <!-- Selling price -->
              <div>
                <FormField label="GIÁ BÁN (SELLING PRICE)" :error="errors.sellingPrice" required>
                  <div class="relative">
                    <input
                      v-model.number="form.sellingPrice"
                      type="number"
                      min="0"
                      placeholder="VD: 3200000000"
                      class="form-input pr-14"
                      :class="errors.sellingPrice ? 'border-red-400 focus:border-red-400' : ''"
                      @input="errors.sellingPrice = ''"
                    />
                    <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A9B8A8] text-xs font-medium">VND</span>
                  </div>
                  <p v-if="form.sellingPrice" class="text-[#A8845A] text-xs mt-1 font-medium">
                    ≈ {{ formatPrice(form.sellingPrice) }}
                  </p>
                </FormField>
              </div>

              <!-- Tax -->
              <div>
                <FormField label="THUẾ (TAX %)">
                  <div class="relative">
                    <input v-model.number="form.tax" type="number" min="0" max="100" step="0.1" placeholder="VD: 10" class="form-input pr-8" />
                    <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A9B8A8] text-sm font-medium">%</span>
                  </div>
                </FormField>
              </div>

              <!-- Direction -->
              <div>
                <FormField label="HƯỚNG (DIRECTION)">
                  <input v-model="form.direction" type="text" placeholder="VD: Đông Nam" class="form-input" />
                </FormField>
              </div>

              <!-- Status -->
              <div>
                <FormField label="TRẠNG THÁI (STATUS)">
                  <select v-model="form.status" class="form-input cursor-pointer">
                    <option value="">Chọn trạng thái</option>
                    <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                  </select>
                </FormField>
              </div>

              <!-- Type -->
              <div>
                <FormField label="LOẠI CĂN (TYPE)">
                  <div class="relative">
                    <select
                      v-model="form.apartmentType"
                      class="form-input cursor-pointer"
                      :class="typeLoadError ? 'border-red-300 bg-red-50 text-[#A9B8A8] cursor-not-allowed' : ''"
                      :disabled="loadingTypes || typeLoadError"
                    >
                      <option value="">
                        {{ loadingTypes ? 'Đang tải...' : typeLoadError ? 'Không thể tải' : 'Chọn loại căn' }}
                      </option>
                      <option v-for="t in typeOptions" :key="t.value" :value="t.value">
                        {{ t.label }}
                      </option>
                    </select>
                    <svg
                      v-if="loadingTypes"
                      class="absolute right-9 top-1/2 -translate-y-1/2 animate-spin pointer-events-none"
                      width="13" height="13" viewBox="0 0 13 13" fill="none"
                    >
                      <circle cx="6.5" cy="6.5" r="5" stroke="#A9B8A8" stroke-width="1.8" stroke-dasharray="14 10"/>
                    </svg>
                  </div>
                  <div v-if="typeLoadError" class="flex items-center justify-between mt-1.5">
                    <p class="text-red-500 text-xs">Không thể tải danh sách loại căn hộ</p>
                    <button
                      type="button"
                      class="text-[#A8845A] text-xs font-medium hover:underline"
                      @click="fetchTypes"
                    >Thử lại</button>
                  </div>
                </FormField>
              </div>

              <!-- Status note -->
              <div class="sm:col-span-2">
                <FormField label="GHI CHÚ TRẠNG THÁI">
                  <textarea v-model="form.statusNote" rows="2" placeholder="Ghi chú thêm về trạng thái căn hộ..." class="form-input resize-none" />
                </FormField>
              </div>

              <!-- Furniture description -->
              <div class="sm:col-span-2">
                <FormField label="NỘI THẤT (FURNITURE DESCRIPTION)">
                  <textarea v-model="form.furnitureDescription" rows="2" placeholder="Mô tả nội thất: full nội thất cao cấp, bếp đầy đủ..." class="form-input resize-none" />
                </FormField>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Location + Gallery -->
        <div class="space-y-5">

          <!-- Location -->
          <div class="bg-white rounded-2xl p-6">
            <div class="flex items-center gap-2.5 mb-5">
              <div class="w-7 h-7 bg-[#A8845A] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="6" r="2.5" stroke="white" stroke-width="1.3"/>
                  <path d="M7 1a5 5 0 0 1 5 5c0 3.5-5 8-5 8S2 9.5 2 6a5 5 0 0 1 5-5z" stroke="white" stroke-width="1.3"/>
                </svg>
              </div>
              <h3 class="text-[#0F2E4A] font-bold text-base">Vị trí</h3>
            </div>

            <div class="space-y-4">
              <!-- Zone selector -->
              <FormField label="PHÂN KHU (ZONE)" :error="errors.zoneId">
                <select
                  v-model="selectedZoneId"
                  class="form-input cursor-pointer"
                  :class="errors.zoneId ? 'border-red-400' : ''"
                  @change="onZoneChange"
                >
                  <option value="">Chọn phân khu</option>
                  <option v-for="z in zones" :key="z.id" :value="z.id">{{ z.name }}</option>
                </select>
              </FormField>

              <!-- Building selector -->
              <FormField label="TÒA NHÀ (BUILDING)" :error="errors.buildingId" required>
                <select
                  v-model="form.buildingId"
                  class="form-input cursor-pointer"
                  :class="errors.buildingId ? 'border-red-400 focus:border-red-400' : ''"
                  :disabled="!selectedZoneId"
                  @change="errors.buildingId = ''"
                >
                  <option value="">{{ selectedZoneId ? 'Chọn tòa nhà' : 'Chọn phân khu trước' }}</option>
                  <option v-for="b in buildings" :key="b.id" :value="b.id">{{ b.name }} ({{ b.code }})</option>
                </select>
                <div v-if="loadingBuildings" class="flex items-center gap-1.5 mt-1">
                  <svg class="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="#A9B8A8" stroke-width="1.5" stroke-dasharray="12 10"/>
                  </svg>
                  <span class="text-[#A9B8A8] text-xs">Đang tải...</span>
                </div>
              </FormField>
            </div>
          </div>

          <!-- Gallery -->
          <div class="bg-white rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 bg-[#A9B8A8] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="1" width="12" height="12" rx="2" stroke="white" stroke-width="1.3"/>
                    <circle cx="4.5" cy="4.5" r="1.5" fill="white"/>
                    <path d="M1 9l3-3 2.5 2.5 2-2L13 11" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3 class="text-[#0F2E4A] font-bold text-base">Hình ảnh</h3>
              </div>
              <span class="text-[#A9B8A8] text-xs">{{ form.images.length }} ảnh</span>
            </div>

            <!-- Image grid -->
            <div v-if="form.images.length" class="grid grid-cols-3 gap-2 mb-3">
              <div
                v-for="(img, idx) in form.images"
                :key="idx"
                class="relative aspect-square rounded-xl overflow-hidden bg-[#F0F4F8] group cursor-pointer"
                @click="openGallery"
              >
                <img
                  :src="img.url"
                  :alt="img.label || `Ảnh ${idx + 1}`"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  @error="(e) => (e.target as HTMLImageElement).parentElement!.style.display='none'"
                />
                <button
                  type="button"
                  @click.stop="removeImage(idx)"
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 1l6 6M7 1L1 7" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Empty gallery -->
            <div v-else class="flex flex-col items-center justify-center py-6 mb-3 border-2 border-dashed border-[#E8EFF5] rounded-xl">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="mb-2">
                <rect x="2" y="2" width="28" height="28" rx="4" stroke="#C5D5DF" stroke-width="1.5"/>
                <circle cx="10" cy="10" r="3" fill="#C5D5DF"/>
                <path d="M2 21l7-7 5 5 5-6 8 9" stroke="#C5D5DF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="text-[#A9B8A8] text-xs text-center">Chưa có ảnh nào</p>
            </div>

            <!-- Add image URL input -->
            <div class="flex gap-2">
              <input
                v-model="newImageUrl"
                type="text"
                placeholder="Dán URL ảnh..."
                class="flex-1 px-3 py-2 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-xs text-[#414A4D] placeholder-[#C5D5DF] outline-none focus:border-[#414A4D] transition-colors"
                @keydown.enter.prevent="addImageUrl"
              />
              <button
                type="button"
                @click="addImageUrl"
                :disabled="!newImageUrl.trim()"
                class="px-3 py-2 bg-[#0F2E4A] text-white rounded-xl text-xs font-medium disabled:opacity-40 hover:bg-[#1a4060] transition-colors"
              >
                Thêm
              </button>
            </div>

            <!-- View gallery link -->
            <button
              v-if="!isNew && form.images.length"
              type="button"
              @click="openGallery"
              class="mt-3 w-full py-2 border border-[#E8EFF5] rounded-xl text-[#414A4D] text-xs font-medium hover:bg-[#F0F4F8] transition-colors flex items-center justify-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.2"/>
                <path d="M1 8l2.5-2.5L6 8l2-2.5 3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
              Xem toàn bộ gallery
            </button>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center justify-between mt-6 pt-6 border-t border-[#E8EFF5]">
        <button
          type="button"
          @click="handleDiscard"
          class="flex items-center gap-2 text-[#414A4D] font-semibold text-sm px-5 py-3 rounded-xl hover:bg-[#F0F4F8] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
          Discard Changes
        </button>

        <div class="flex items-center gap-3">
          <span v-if="submitError" class="text-red-500 text-sm">{{ submitError }}</span>
          <button
            type="submit"
            :disabled="submitting"
            class="flex items-center gap-2 bg-[#0F2E4A] hover:bg-[#1a4060] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            <svg v-if="submitting" class="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5" stroke="white" stroke-width="2" stroke-dasharray="16 14"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l4 4 6-7" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ isNew ? 'Tạo căn hộ' : 'Update Portfolio Item' }}
          </button>
        </div>
      </div>
    </form>
  </div>

  <!-- Discard confirm dialog -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="discardDialog" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="discardDialog = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <h3 class="text-[#0F2E4A] font-bold text-lg mb-2">Hủy thay đổi?</h3>
          <p class="text-[#7A9AAD] text-sm mb-5">Tất cả thay đổi chưa lưu sẽ bị mất.</p>
          <div class="flex gap-3">
            <button @click="discardDialog = false" class="flex-1 py-2.5 rounded-xl border border-[#E8EFF5] text-[#414A4D] font-medium text-sm hover:bg-[#F0F4F8] transition-colors">
              Tiếp tục chỉnh sửa
            </button>
            <button @click="executeDiscard" class="flex-1 py-2.5 rounded-xl bg-[#414A4D] text-white font-semibold text-sm hover:bg-[#2e3537] transition-colors">
              Hủy thay đổi
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Toast -->
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-medium"
        :class="toast.type === 'success' ? 'bg-[#0F2E4A]' : 'bg-red-500'"
      >
        <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="white" stroke-width="1.5"/>
          <path d="M5 8l2.5 2.5 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="white" stroke-width="1.5"/>
          <path d="M8 5v3.5M8 11h.01" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apartmentService from '@/services/apartmentService'
import zoneService from '@/services/zoneService'
import type { ApartmentResponse, ApartmentStatus } from '@/types/apartment'
import type { Zone, BuildingResponse } from '@/types/zone'

// Inline FormField component to avoid extra file
const FormField = defineComponent({
  props: {
    label: { type: String, required: true },
    error: { type: String, default: '' },
    required: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => h('div', [
      h('label', {
        class: 'block text-[#7A9AAD] text-[10px] font-semibold tracking-widest uppercase mb-1.5',
      }, [
        props.label,
        props.required ? h('span', { class: 'text-red-400 ml-0.5' }, '*') : null,
      ]),
      slots.default?.(),
      props.error
        ? h('p', { class: 'text-red-500 text-xs mt-1' }, props.error)
        : null,
    ])
  },
})

const route = useRoute()
const router = useRouter()

const isNew = computed(() => route.path === '/apartments/new')
const apartmentId = computed(() => isNew.value ? null : route.params.id as string)

// Page state
const pageLoading = ref(false)
const pageError = ref('')
const original = ref<ApartmentResponse | null>(null)

// Form
const form = reactive({
  unitCode: '',
  displayCode: '',
  area: null as number | null,
  sellingPrice: null as number | null,
  tax: null as number | null,
  status: '',
  apartmentType: '',
  furnitureDescription: '',
  floorNumber: null as number | null,
  direction: '',
  bedroomCount: null as number | null,
  statusNote: '',
  buildingId: '',
  images: [] as { url: string; label: string; sortOrder: number }[],
})
const errors = reactive({
  unitCode: '', area: '', sellingPrice: '', buildingId: '', zoneId: '',
})

// Location
const zones = ref<Zone[]>([])
const buildings = ref<BuildingResponse[]>([])
const selectedZoneId = ref('')
const loadingBuildings = ref(false)

// UI
const submitting = ref(false)
const submitError = ref('')
const discardDialog = ref(false)
const newImageUrl = ref('')
const toast = reactive({ show: false, type: 'success', message: '' })

const statusOptions = [
  { value: 'DANG_BAN', label: 'Đang bán' },
  { value: 'DA_COC', label: 'Đã cọc' },
  { value: 'DA_BAN', label: 'Đã bán' },
  { value: 'GIU_CHO', label: 'Giữ chỗ' },
  { value: 'KHOA', label: 'Khoá' },
]
const typeOptions = ref<{ value: string; label: string }[]>([])
const loadingTypes = ref(false)
const typeLoadError = ref(false)

async function fetchTypes() {
  loadingTypes.value = true
  typeLoadError.value = false
  try {
    const res = await apartmentService.getTypes()
    typeOptions.value = res.data.data.map(t => ({ value: t.code, label: t.label }))
  } catch {
    typeLoadError.value = true
    typeOptions.value = []
  } finally {
    loadingTypes.value = false
  }
}

function statusLabel(s: string) {
  return statusOptions.find(x => x.value === s)?.label ?? s
}
function statusBadgeClass(s: string) {
  const map: Record<string, string> = {
    DANG_BAN: 'bg-emerald-100 text-emerald-700',
    DA_COC: 'bg-amber-100 text-amber-700',
    DA_BAN: 'bg-blue-100 text-blue-700',
    GIU_CHO: 'bg-purple-100 text-purple-700',
    KHOA: 'bg-red-100 text-red-600',
  }
  return map[s] ?? 'bg-[#F0F4F8] text-[#414A4D]'
}
function formatPrice(v: number | null) {
  if (!v) return ''
  const ty = v / 1_000_000_000
  return ty >= 1 ? `${ty.toFixed(2).replace(/\.?0+$/, '')} tỷ` : `${(v / 1_000_000).toFixed(0)} triệu`
}

// Load buildings when zone changes
async function onZoneChange() {
  form.buildingId = ''
  buildings.value = []
  errors.buildingId = ''
  if (!selectedZoneId.value) return
  loadingBuildings.value = true
  try {
    const res = await zoneService.getBuildingsByZone(selectedZoneId.value)
    buildings.value = res.data.data ?? []
  } catch { /* silent */ } finally {
    loadingBuildings.value = false
  }
}

// Populate form from API response
function populateForm(apt: ApartmentResponse) {
  form.unitCode = apt.unitCode ?? ''
  form.displayCode = apt.displayCode ?? ''
  form.area = apt.area ?? null
  form.sellingPrice = apt.sellingPrice ?? null
  form.tax = apt.tax ?? null
  form.status = apt.status ?? ''
  form.apartmentType = apt.apartmentType ?? ''
  form.furnitureDescription = apt.furnitureDescription ?? ''
  form.floorNumber = apt.floorNumber ?? null
  form.direction = apt.direction ?? ''
  form.bedroomCount = apt.bedroomCount ?? null
  form.statusNote = ''
  form.buildingId = apt.buildingId ?? ''
  form.images = (apt.images ?? []).map((img, i) => ({
    url: img.url,
    label: img.label ?? '',
    sortOrder: img.sortOrder ?? i,
  }))
  selectedZoneId.value = apt.zoneId ?? ''
  if (apt.zoneId) onZoneChange()
}

// Image helpers
function addImageUrl() {
  const url = newImageUrl.value.trim()
  if (!url) return
  form.images.push({ url, label: '', sortOrder: form.images.length })
  newImageUrl.value = ''
}
function removeImage(idx: number) {
  form.images.splice(idx, 1)
}
function openGallery() {
  if (!isNew.value && apartmentId.value) {
    router.push(`/apartments/${apartmentId.value}/gallery`)
  }
}

// Validate
function validate() {
  let ok = true
  errors.unitCode = ''
  errors.area = ''
  errors.sellingPrice = ''
  errors.buildingId = ''
  if (!form.unitCode.trim()) { errors.unitCode = 'Mã căn không được trống'; ok = false }
  if (!form.area) { errors.area = 'Diện tích không được trống'; ok = false }
  if (!form.sellingPrice) { errors.sellingPrice = 'Giá bán không được trống'; ok = false }
  if (!form.buildingId) { errors.buildingId = 'Vui lòng chọn tòa nhà'; ok = false }
  return ok
}

// Submit
async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = ''
  const payload: Record<string, unknown> = {
    unitCode: form.unitCode,
    displayCode: form.displayCode || undefined,
    area: form.area,
    sellingPrice: form.sellingPrice,
    tax: form.tax ?? undefined,
    status: form.status || undefined,
    apartmentType: form.apartmentType || undefined,
    furnitureDescription: form.furnitureDescription || undefined,
    floorNumber: form.floorNumber ?? undefined,
    direction: form.direction || undefined,
    bedroomCount: form.bedroomCount ?? undefined,
    statusNote: form.statusNote || undefined,
    buildingId: form.buildingId,
    images: form.images.length ? form.images : undefined,
  }
  try {
    if (isNew.value) {
      const res = await apartmentService.create(payload)
      showToast('success', 'Tạo căn hộ thành công!')
      router.push(`/apartments/${res.data.data.id}`)
    } else {
      await apartmentService.update(apartmentId.value!, payload)
      showToast('success', 'Cập nhật thành công!')
      const res = await apartmentService.getById(apartmentId.value!)
      original.value = res.data.data
    }
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    submitError.value = e.response?.data?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.'
    showToast('error', submitError.value)
  } finally {
    submitting.value = false
  }
}

// Discard
function handleDiscard() {
  discardDialog.value = true
}
function executeDiscard() {
  discardDialog.value = false
  if (isNew.value) {
    router.push('/apartments')
  } else if (original.value) {
    populateForm(original.value)
  }
}

// Toast helper
let toastTimer: ReturnType<typeof setTimeout>
function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.type = type
  toast.message = message
  toast.show = true
  toastTimer = setTimeout(() => { toast.show = false }, 3000)
}

// Init
onMounted(async () => {
  // Load zones + types in parallel
  await Promise.all([
    zoneService.getAll().then(res => { zones.value = res.data.data ?? [] }).catch(() => {}),
    fetchTypes(),
  ])

  if (!isNew.value && apartmentId.value) {
    pageLoading.value = true
    try {
      const res = await apartmentService.getById(apartmentId.value)
      original.value = res.data.data
      populateForm(res.data.data)
    } catch {
      pageError.value = 'Không thể tải thông tin căn hộ.'
    } finally {
      pageLoading.value = false
    }
  }
})
</script>

<style scoped>
.form-input {
  @apply w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-[#414A4D] text-sm placeholder-[#C5D5DF] outline-none focus:border-[#414A4D] transition-colors;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.toast-enter-active { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateY(12px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateY(4px); }
</style>
