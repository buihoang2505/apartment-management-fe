<template>
  <div class="p-6 space-y-5">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="flex-1">
        <h2 class="text-[#0F2E4A] font-bold text-xl">Danh sách căn hộ</h2>
        <p class="text-[#7A9AAD] text-sm mt-0.5">Quản lý kho hàng bất động sản</p>
      </div>

      <!-- Search bar -->
      <div class="relative sm:w-72">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A9B8A8]" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="searchInput"
          type="text"
          placeholder="Tìm theo mã căn, diện tích..."
          class="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8EFF5] rounded-xl text-sm text-[#414A4D] placeholder-[#C5D5DF] outline-none focus:border-[#414A4D] transition-colors"
          @keydown.enter="applySearch"
        />
      </div>
    </div>

    <!-- Toolbar: action buttons + filters -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Action buttons -->
      <button
        @click="$router.push('/apartments/new')"
        class="flex items-center gap-2 bg-[#414A4D] hover:bg-[#2e3537] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        Thêm
      </button>

      <button
        :disabled="selectedIds.size === 0"
        @click="handleBulkDelete"
        class="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-colors"
        :class="selectedIds.size > 0
          ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
          : 'bg-white border-[#E8EFF5] text-[#C5D5DF] cursor-not-allowed'"
      >
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
          <path d="M1 3.5h11M4 3.5V2h5v1.5M5 6v5M8 6v5M2 3.5l.8 8.5h7.4L11 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Xóa{{ selectedIds.size > 0 ? ` (${selectedIds.size})` : '' }}
      </button>

      <div class="flex-1" />

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="filter.zoneId"
          class="bg-white border border-[#E8EFF5] text-[#414A4D] text-sm px-3 py-2.5 rounded-xl outline-none focus:border-[#414A4D] transition-colors cursor-pointer"
          @change="onFilterChange"
        >
          <option value="">Tất cả phân khu</option>
          <option v-for="z in zones" :key="z.id" :value="z.id">{{ z.name }}</option>
        </select>

        <select
          v-model="filter.status"
          class="bg-white border border-[#E8EFF5] text-[#414A4D] text-sm px-3 py-2.5 rounded-xl outline-none focus:border-[#414A4D] transition-colors cursor-pointer"
          @change="onFilterChange"
        >
          <option value="">Tất cả trạng thái</option>
          <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>

        <select
          v-model="filter.type"
          class="bg-white border border-[#E8EFF5] text-[#414A4D] text-sm px-3 py-2.5 rounded-xl outline-none focus:border-[#414A4D] transition-colors cursor-pointer"
          @change="onFilterChange"
        >
          <option value="">Tất cả loại căn</option>
          <option v-for="t in typeOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="bg-white rounded-2xl overflow-hidden animate-pulse">
        <div class="h-44 bg-[#E8EFF5]" />
        <div class="p-4 space-y-2.5">
          <div class="h-3 bg-[#E8EFF5] rounded w-1/3" />
          <div class="h-4 bg-[#E8EFF5] rounded w-2/3" />
          <div class="h-3 bg-[#E8EFF5] rounded w-1/2" />
          <div class="h-5 bg-[#E8EFF5] rounded w-1/4" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600 text-sm flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 5v3M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="!apartments.length" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-20 h-20 bg-[#F0F4F8] rounded-2xl flex items-center justify-center mb-4">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="4" y="16" width="32" height="22" rx="2.5" stroke="#A9B8A8" stroke-width="2"/>
          <path d="M4 22L20 8l16 14" stroke="#A9B8A8" stroke-width="2" stroke-linejoin="round"/>
          <rect x="15" y="27" width="10" height="11" rx="1" fill="#A9B8A8" fill-opacity="0.5"/>
        </svg>
      </div>
      <p class="text-[#414A4D] font-semibold text-lg">Không có căn hộ nào</p>
      <p class="text-[#7A9AAD] text-sm mt-1">Thử thay đổi bộ lọc hoặc thêm căn hộ mới</p>
    </div>

    <!-- Apartment cards grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="apt in apartments"
        :key="apt.id"
        class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative"
        :class="selectedIds.has(apt.id) ? 'ring-2 ring-[#A8845A]' : ''"
      >
        <!-- Checkbox overlay -->
        <div
          class="absolute top-3 left-3 z-10"
          @click.stop="toggleSelect(apt.id)"
        >
          <div
            class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer"
            :class="selectedIds.has(apt.id)
              ? 'bg-[#A8845A] border-[#A8845A]'
              : 'bg-white/80 border-white backdrop-blur-sm opacity-0 group-hover:opacity-100'"
          >
            <svg v-if="selectedIds.has(apt.id)" width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Thumbnail -->
        <div class="relative h-44 bg-[#E8EFF5] overflow-hidden cursor-pointer" @click="goToDetail(apt.id)">
          <img
            v-if="apt.images?.length"
            :src="apt.images[0].url"
            :alt="apt.unitCode"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="18" width="40" height="27" rx="3" stroke="#C5D5DF" stroke-width="2"/>
              <path d="M4 27L24 10l20 17" stroke="#C5D5DF" stroke-width="2" stroke-linejoin="round"/>
              <rect x="18" y="33" width="12" height="12" rx="1.5" fill="#C5D5DF" fill-opacity="0.5"/>
            </svg>
          </div>

          <!-- Status badge -->
          <span
            class="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg"
            :class="statusBadgeClass(apt.status)"
          >
            {{ statusLabel(apt.status) }}
          </span>
        </div>

        <!-- Card body -->
        <div class="p-4">
          <!-- Zone + building -->
          <p class="text-[#A9B8A8] text-xs font-medium truncate mb-1">
            {{ apt.zoneName }}{{ apt.buildingName ? ' · ' + apt.buildingName : '' }}
          </p>

          <!-- Apartment name -->
          <p class="text-[#0F2E4A] font-bold text-base truncate cursor-pointer hover:text-[#A8845A] transition-colors"
            @click="goToDetail(apt.id)">
            Căn hộ {{ apt.displayCode || apt.unitCode }}
          </p>

          <!-- Meta row -->
          <div class="flex items-center gap-4 mt-2">
            <div>
              <p class="text-[#A9B8A8] text-[10px] font-semibold uppercase tracking-wide">Mã căn</p>
              <p class="text-[#414A4D] text-xs font-medium">{{ apt.unitCode }}</p>
            </div>
            <div>
              <p class="text-[#A9B8A8] text-[10px] font-semibold uppercase tracking-wide">Diện tích</p>
              <p class="text-[#414A4D] text-xs font-medium">{{ apt.area }} m²</p>
            </div>
          </div>

          <!-- Price + actions -->
          <div class="flex items-center justify-between mt-3">
            <span class="text-[#0F2E4A] font-bold text-xl">
              {{ formatPrice(apt.sellingPrice) }}
            </span>
            <div class="flex items-center gap-1">
              <button
                @click="goToDetail(apt.id)"
                class="w-8 h-8 rounded-xl bg-[#F0F4F8] hover:bg-[#E0E8F0] flex items-center justify-center transition-colors"
                title="Chỉnh sửa"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M9.5 1.5l2 2L4 11H2V9L9.5 1.5z" stroke="#414A4D" stroke-width="1.4" stroke-linejoin="round"/>
                </svg>
              </button>
              <button
                @click="confirmDelete(apt)"
                class="w-8 h-8 rounded-xl bg-[#F0F4F8] hover:bg-red-50 flex items-center justify-center transition-colors group/del"
                title="Xóa"
              >
                <svg class="group-hover/del:stroke-red-500" width="12" height="13" viewBox="0 0 12 13" fill="none">
                  <path d="M1 3h10M4 3V2h4v1M4.5 5.5v5M7.5 5.5v5M2 3l.7 8h6.6L10 3" stroke="#A9B8A8" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between pt-2">
      <p class="text-[#7A9AAD] text-sm">
        {{ totalElements.toLocaleString('vi') }} căn hộ · Trang {{ currentPage + 1 }}/{{ totalPages }}
      </p>
      <div class="flex items-center gap-1">
        <button
          :disabled="currentPage === 0"
          @click="goToPage(currentPage - 1)"
          class="w-9 h-9 rounded-xl flex items-center justify-center border border-[#E8EFF5] transition-colors"
          :class="currentPage === 0 ? 'text-[#C5D5DF] cursor-not-allowed' : 'text-[#414A4D] hover:bg-[#F0F4F8]'"
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>

        <button
          v-for="page in paginationPages"
          :key="page"
          @click="page !== '…' && goToPage(Number(page) - 1)"
          class="w-9 h-9 rounded-xl text-sm font-medium flex items-center justify-center transition-colors"
          :class="page === currentPage + 1
            ? 'bg-[#0F2E4A] text-white'
            : page === '…'
              ? 'text-[#A9B8A8] cursor-default'
              : 'text-[#414A4D] hover:bg-[#F0F4F8]'"
        >
          {{ page }}
        </button>

        <button
          :disabled="currentPage >= totalPages - 1"
          @click="goToPage(currentPage + 1)"
          class="w-9 h-9 rounded-xl flex items-center justify-center border border-[#E8EFF5] transition-colors"
          :class="currentPage >= totalPages - 1 ? 'text-[#C5D5DF] cursor-not-allowed' : 'text-[#414A4D] hover:bg-[#F0F4F8]'"
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>

  <!-- Delete confirm dialog -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="deleteDialog.show" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="deleteDialog.show = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 5h18M7 5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1M8 9v8M14 9v8M3 5l1.5 14h13L19 5" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="text-[#0F2E4A] font-bold text-lg mb-1">Xác nhận xóa</h3>
          <p class="text-[#7A9AAD] text-sm mb-5">
            Bạn có chắc muốn xóa căn hộ <strong class="text-[#414A4D]">{{ deleteDialog.apartment?.unitCode }}</strong>? Hành động này không thể hoàn tác.
          </p>
          <div class="flex gap-3">
            <button
              @click="deleteDialog.show = false"
              class="flex-1 py-2.5 rounded-xl border border-[#E8EFF5] text-[#414A4D] font-medium text-sm hover:bg-[#F0F4F8] transition-colors"
            >
              Hủy
            </button>
            <button
              @click="executeDelete"
              :disabled="deleteDialog.loading"
              class="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              <span v-if="deleteDialog.loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="white" stroke-width="2" stroke-dasharray="16 14"/></svg>
                Đang xóa...
              </span>
              <span v-else>Xóa căn hộ</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import apartmentService from '@/services/apartmentService'
import zoneService from '@/services/zoneService'
import type { ApartmentResponse, ApartmentStatus } from '@/types/apartment'
import type { Zone } from '@/types/zone'

const router = useRouter()

// State
const loading = ref(true)
const error = ref('')
const apartments = ref<ApartmentResponse[]>([])
const zones = ref<Zone[]>([])
const selectedIds = reactive<Set<string>>(new Set())

// Pagination
const currentPage = ref(0)
const totalPages = ref(0)
const totalElements = ref(0)
const PAGE_SIZE = 20

// Filter
const searchInput = ref('')
const filter = reactive({
  zoneId: '',
  status: '',
  type: '',
})

// Delete dialog
const deleteDialog = reactive({
  show: false,
  loading: false,
  apartment: null as ApartmentResponse | null,
})

const statusOptions = [
  { value: 'DANG_BAN', label: 'Đang bán' },
  { value: 'DA_COC', label: 'Đã cọc' },
  { value: 'DA_BAN', label: 'Đã bán' },
  { value: 'GIU_CHO', label: 'Giữ chỗ' },
  { value: 'KHOA', label: 'Khoá' },
]

const typeOptions = [
  { value: 'STUDIO', label: 'Studio' },
  { value: 'ONE_BR', label: '1 phòng ngủ' },
  { value: 'TWO_BR', label: '2 phòng ngủ' },
  { value: 'TWO_BR_PLUS', label: '2 phòng ngủ +' },
  { value: 'THREE_BR', label: '3 phòng ngủ' },
  { value: 'THREE_BR_PLUS', label: '3 phòng ngủ +' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
  { value: 'DUPLEX', label: 'Duplex' },
  { value: 'OTHER', label: 'Khác' },
]

// Pagination display
const paginationPages = computed<(number | string)[]>(() => {
  const total = totalPages.value
  const current = currentPage.value + 1
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
})

// Helpers
function statusLabel(status: ApartmentStatus) {
  const map: Record<string, string> = {
    DANG_BAN: 'Đang bán', DA_COC: 'Đã cọc', DA_BAN: 'Đã bán', GIU_CHO: 'Giữ chỗ', KHOA: 'Khoá',
  }
  return map[status] ?? status
}

function statusBadgeClass(status: ApartmentStatus) {
  const map: Record<string, string> = {
    DANG_BAN: 'bg-emerald-500 text-white',
    DA_COC: 'bg-amber-500 text-white',
    DA_BAN: 'bg-blue-500 text-white',
    GIU_CHO: 'bg-purple-500 text-white',
    KHOA: 'bg-red-500 text-white',
  }
  return map[status] ?? 'bg-gray-400 text-white'
}

function formatPrice(price: number) {
  if (!price) return '—'
  const ty = price / 1_000_000_000
  return ty >= 1 ? `${ty.toFixed(1).replace(/\.0$/, '')} tỷ` : `${(price / 1_000_000).toFixed(0)} tr`
}

// Actions
function toggleSelect(id: string) {
  if (selectedIds.has(id)) selectedIds.delete(id)
  else selectedIds.add(id)
}

function goToDetail(id: string) {
  router.push(`/apartments/${id}`)
}

function goToPage(page: number) {
  currentPage.value = page
  selectedIds.clear()
  fetchApartments()
}

function applySearch() {
  currentPage.value = 0
  fetchApartments()
}

function onFilterChange() {
  currentPage.value = 0
  fetchApartments()
}

function confirmDelete(apt: ApartmentResponse) {
  deleteDialog.apartment = apt
  deleteDialog.show = true
}

async function executeDelete() {
  if (!deleteDialog.apartment) return
  deleteDialog.loading = true
  try {
    await apartmentService.deleteById(deleteDialog.apartment.id)
    deleteDialog.show = false
    selectedIds.delete(deleteDialog.apartment.id)
    fetchApartments()
  } catch {
    // silent — keep dialog open
  } finally {
    deleteDialog.loading = false
  }
}

async function handleBulkDelete() {
  if (selectedIds.size === 0) return
  // For now navigate — bulk delete can be extended
  const confirmed = window.confirm(`Xóa ${selectedIds.size} căn hộ đã chọn?`)
  if (!confirmed) return
  try {
    await Promise.all([...selectedIds].map(id => apartmentService.deleteById(id)))
    selectedIds.clear()
    fetchApartments()
  } catch { /* silent */ }
}

// Fetch
async function fetchApartments() {
  loading.value = true
  error.value = ''
  try {
    const res = await apartmentService.getList({
      search: searchInput.value.trim() || undefined,
      zoneId: filter.zoneId || undefined,
      status: filter.status || undefined,
      type: filter.type || undefined,
      page: currentPage.value,
      size: PAGE_SIZE,
    })
    const page = res.data.data
    apartments.value = page.content
    totalPages.value = page.totalPages
    totalElements.value = Number(page.totalElements)
  } catch {
    error.value = 'Không thể tải danh sách căn hộ. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

async function fetchZones() {
  try {
    const res = await zoneService.getAll()
    zones.value = res.data.data ?? []
  } catch { /* silent */ }
}

// Debounce search
let searchTimer: ReturnType<typeof setTimeout>
watch(searchInput, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 0
    fetchApartments()
  }, 400)
})

onMounted(() => {
  fetchApartments()
  fetchZones()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
