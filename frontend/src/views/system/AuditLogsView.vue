<template>
  <div class="p-6 space-y-5">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-[24px] font-semibold text-[#1A1A2E] leading-tight">Lịch sử Audit</h1>
        <p class="text-sm text-[#6B7280] mt-1">Toàn bộ thao tác trong hệ thống</p>
      </div>
      <div class="flex items-center gap-2 bg-white border border-[#E5E9EE] rounded-xl px-4 py-2 shadow-card">
        <svg class="w-4 h-4 text-[#A9B8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="text-sm font-medium text-[#414A4D]">{{ totalFiltered }} bản ghi</span>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="bg-white rounded-[12px] border border-[#E5E9EE] shadow-card p-4">
      <div class="flex flex-wrap gap-3 items-end">

        <!-- Search entity -->
        <div class="flex-1 min-w-[180px]">
          <label class="block text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wide mb-1.5">Tìm kiếm</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="filterSearch"
              type="text"
              placeholder="Tìm theo đối tượng, IP..."
              class="w-full pl-8 pr-3 py-2 bg-[#F9FAFB] border border-[#E5E9EE] rounded-lg text-[13px] text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-1 focus:ring-[#A8845A]/30 transition placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        <!-- Filter: Người dùng -->
        <div class="min-w-[150px]">
          <label class="block text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wide mb-1.5">Người dùng</label>
          <select v-model="filterUsername" class="filter-select">
            <option value="">Tất cả</option>
            <option v-for="u in uniqueUsernames" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>

        <!-- Filter: Loại hành động -->
        <div class="min-w-[160px]">
          <label class="block text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wide mb-1.5">Loại hành động</label>
          <select v-model="filterCategory" class="filter-select">
            <option value="">Tất cả</option>
            <option value="auth">Đăng nhập</option>
            <option value="create">Tạo mới</option>
            <option value="update">Cập nhật</option>
            <option value="delete">Xóa</option>
            <option value="system">Hệ thống</option>
          </select>
        </div>

        <!-- Filter: Từ ngày -->
        <div class="min-w-[140px]">
          <label class="block text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wide mb-1.5">Từ ngày</label>
          <input v-model="filterDateFrom" type="date" class="filter-select" />
        </div>

        <!-- Filter: Đến ngày -->
        <div class="min-w-[140px]">
          <label class="block text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wide mb-1.5">Đến ngày</label>
          <input v-model="filterDateTo" type="date" class="filter-select" />
        </div>

        <!-- Clear -->
        <button
          v-if="hasActiveFilter"
          @click="clearFilters"
          class="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#6B7280] hover:text-[#414A4D] hover:bg-[#F5F6FA] rounded-lg transition self-end"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Xoá lọc
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 8" :key="i" class="bg-white rounded-xl h-14 animate-pulse border border-[#E5E9EE]" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600 text-sm">
      {{ error }}
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-[12px] border border-[#E5E9EE] shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-[#E5E9EE] bg-[#F9FAFB]">
              <th class="th">Thời gian</th>
              <th class="th">Người dùng</th>
              <th class="th">Hành động</th>
              <th class="th">Đối tượng</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F3F4F6]">
            <tr
              v-for="log in pagedLogs"
              :key="log.id"
              class="hover:bg-[#FAFAFA] transition-colors"
            >
              <!-- Thời gian -->
              <td class="td whitespace-nowrap">
                <div class="text-[13px] text-[#414A4D]">{{ formatDate(log.createdAt) }}</div>
                <div class="text-[11px] text-[#9CA3AF] mt-0.5">{{ formatTime(log.createdAt) }}</div>
              </td>

              <!-- Người dùng -->
              <td class="td whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
                    :class="log.username ? 'bg-[#A8845A]' : 'bg-[#9CA3AF]'"
                  >
                    {{ (log.username || 'S').charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-[13px] font-medium text-[#414A4D]">
                    {{ log.username || 'Hệ thống' }}
                  </span>
                </div>
              </td>

              <!-- Hành động -->
              <td class="td whitespace-nowrap">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  :class="actionBadgeClass(log.action)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="actionDotClass(log.action)" />
                  {{ formatAction(log.action) }}
                </span>
              </td>

              <!-- Đối tượng -->
              <td class="td">
                <div v-if="log.entityType || log.entityId" class="flex items-center gap-2">
                  <span class="text-[12px] font-medium text-[#414A4D]">
                    {{ formatEntityType(log.entityType) }}
                  </span>
                  <span
                    v-if="log.entityId"
                    class="font-mono text-[11px] text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded"
                    :title="log.entityId"
                  >
                    #{{ log.entityId.length > 8 ? log.entityId.slice(0, 8) : log.entityId }}
                  </span>
                </div>
                <span v-else class="text-[#9CA3AF] text-[12px]">—</span>
              </td>
            </tr>

            <tr v-if="pagedLogs.length === 0">
              <td colspan="4" class="px-5 py-12 text-center">
                <p class="text-[#9CA3AF] text-sm">Không tìm thấy bản ghi nào</p>
                <button v-if="hasActiveFilter" @click="clearFilters" class="mt-2 text-[13px] text-[#A8845A] underline">
                  Xoá bộ lọc
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1 || totalFiltered > 0" class="flex items-center justify-between px-5 py-3.5 border-t border-[#E5E9EE] bg-[#FAFAFA]">
        <!-- Info -->
        <p class="text-[12px] text-[#9CA3AF]">
          <span class="font-medium text-[#414A4D]">{{ totalFiltered }}</span> bản ghi,
          trang <span class="font-medium text-[#414A4D]">{{ currentPage + 1 }}</span>/{{ Math.max(1, totalPages) }}
        </p>
        <!-- Controls -->
        <div class="flex items-center gap-1">
          <button
            @click="currentPage = 0"
            :disabled="currentPage === 0"
            class="page-btn"
            title="Trang đầu"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/>
            </svg>
          </button>
          <button @click="currentPage--" :disabled="currentPage === 0" class="page-btn">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <template v-for="p in visiblePages" :key="p">
            <span v-if="p === '...'" class="w-8 text-center text-[#9CA3AF] text-[12px]">…</span>
            <button
              v-else
              @click="currentPage = (p as number)"
              class="w-8 h-8 rounded-lg text-[12px] font-medium transition"
              :class="currentPage === p
                ? 'bg-[#414A4D] text-white'
                : 'text-[#6B7280] hover:bg-[#F5F6FA]'"
            >{{ (p as number) + 1 }}</button>
          </template>

          <button @click="currentPage++" :disabled="currentPage >= totalPages - 1" class="page-btn">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          <button
            @click="currentPage = totalPages - 1"
            :disabled="currentPage >= totalPages - 1"
            class="page-btn"
            title="Trang cuối"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import auditService from '@/services/auditService'
import type { AuditLogResponse } from '@/types/audit'

// ── Action map ──────────────────────────────────────────────────────
type ActionCategory = 'auth' | 'create' | 'update' | 'delete' | 'system'

interface ActionInfo { label: string; category: ActionCategory }

const ACTION_MAP: Record<string, ActionInfo> = {
  // Auth
  'AuthCommandHandler.handle':           { label: 'Đăng nhập',              category: 'auth'   },
  'AuthCommandHandler.login':            { label: 'Đăng nhập',              category: 'auth'   },
  'AuthCommandHandler.logout':           { label: 'Đăng xuất',              category: 'auth'   },
  'AuthCommandHandler.refreshToken':     { label: 'Làm mới token',          category: 'auth'   },

  // User
  'UserCommandHandler.handle':           { label: 'Cập nhật người dùng',    category: 'update' },
  'UserCommandHandler.createUser':       { label: 'Tạo người dùng',         category: 'create' },
  'UserCommandHandler.updateUser':       { label: 'Cập nhật người dùng',    category: 'update' },
  'UserCommandHandler.deleteUser':       { label: 'Xóa người dùng',         category: 'delete' },
  'UserCommandHandler.resetPassword':    { label: 'Đặt lại mật khẩu',       category: 'update' },

  // Department
  'DepartmentCommandHandler.handle':           { label: 'Thao tác phòng ban',     category: 'update' },
  'DepartmentCommandHandler.createDepartment': { label: 'Tạo phòng ban',          category: 'create' },
  'DepartmentCommandHandler.updateDepartment': { label: 'Cập nhật phòng ban',     category: 'update' },
  'DepartmentCommandHandler.deleteDepartment': { label: 'Xóa phòng ban',          category: 'delete' },

  // Employee
  'EmployeeCommandHandler.handle':           { label: 'Thao tác nhân viên',    category: 'update' },
  'EmployeeCommandHandler.createEmployee':   { label: 'Tạo nhân viên',          category: 'create' },
  'EmployeeCommandHandler.updateEmployee':   { label: 'Cập nhật nhân viên',     category: 'update' },
  'EmployeeCommandHandler.deleteEmployee':   { label: 'Xóa nhân viên',          category: 'delete' },

  // Apartment
  'ApartmentCommandHandler.handle':             { label: 'Thao tác căn hộ',       category: 'update' },
  'ApartmentCommandHandler.createApartment':    { label: 'Tạo căn hộ',            category: 'create' },
  'ApartmentCommandHandler.updateApartment':    { label: 'Cập nhật căn hộ',       category: 'update' },
  'ApartmentCommandHandler.deleteApartment':    { label: 'Xóa căn hộ',            category: 'delete' },

  // Zone
  'ZoneCommandHandler.handle':           { label: 'Thao tác phân khu',       category: 'update' },
  'ZoneCommandHandler.createZone':       { label: 'Tạo phân khu',            category: 'create' },
  'ZoneCommandHandler.updateZone':       { label: 'Cập nhật phân khu',       category: 'update' },
  'ZoneCommandHandler.deleteZone':       { label: 'Xóa phân khu',            category: 'delete' },

  // Portfolio
  'PortfolioCommandHandler.handle':          { label: 'Thao tác portfolio',     category: 'update' },
  'PortfolioCommandHandler.createPortfolio': { label: 'Tạo portfolio',           category: 'create' },
  'PortfolioCommandHandler.updatePortfolio': { label: 'Cập nhật portfolio',      category: 'update' },
  'PortfolioCommandHandler.deletePortfolio': { label: 'Xóa portfolio',           category: 'delete' },
}

const ENTITY_TYPE_MAP: Record<string, string> = {
  APARTMENT: 'Căn hộ',
  ZONE:      'Phân khu',
  BUILDING:  'Tòa nhà',
  PORTFOLIO: 'Portfolio',
  USER:      'Người dùng',
  DEPARTMENT:'Phòng ban',
  EMPLOYEE:  'Nhân viên',
  AUTH:      'Xác thực',
}

function resolveAction(raw: string): ActionInfo {
  if (!raw) return { label: 'Hệ thống', category: 'system' }
  if (ACTION_MAP[raw]) return ACTION_MAP[raw]

  // Fallback: parse class.method pattern
  const method = raw.includes('.') ? raw.split('.').pop()!.toLowerCase() : raw.toLowerCase()
  if (method.includes('delete') || method.includes('remove'))
    return { label: `Xóa (${raw})`,    category: 'delete' }
  if (method.includes('create') || method.includes('add') || method.includes('new'))
    return { label: `Tạo mới (${raw})`, category: 'create' }
  if (method.includes('update') || method.includes('edit') || method.includes('save'))
    return { label: `Cập nhật (${raw})`, category: 'update' }
  if (method.includes('login') || method.includes('auth') || method.includes('logout'))
    return { label: `Đăng nhập (${raw})`, category: 'auth' }

  return { label: raw, category: 'system' }
}

function formatAction(raw: string) {
  return resolveAction(raw).label
}

function getCategory(raw: string): ActionCategory {
  return resolveAction(raw).category
}

function formatEntityType(raw: string) {
  if (!raw) return ''
  return ENTITY_TYPE_MAP[raw.toUpperCase()] ?? raw
}

// ── Date helpers ────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// ── Badge classes ───────────────────────────────────────────────────
const BADGE_BG: Record<ActionCategory, string> = {
  auth:   'bg-blue-50 text-blue-600',
  create: 'bg-emerald-50 text-emerald-700',
  update: 'bg-amber-50 text-amber-700',
  delete: 'bg-red-50 text-red-600',
  system: 'bg-[#F3F4F6] text-[#6B7280]',
}
const DOT_COLOR: Record<ActionCategory, string> = {
  auth:   'bg-blue-400',
  create: 'bg-emerald-500',
  update: 'bg-amber-400',
  delete: 'bg-red-500',
  system: 'bg-[#9CA3AF]',
}

function actionBadgeClass(raw: string) { return BADGE_BG[getCategory(raw)]  }
function actionDotClass(raw: string)   { return DOT_COLOR[getCategory(raw)] }

// ── State ───────────────────────────────────────────────────────────
const allLogs = ref<AuditLogResponse[]>([])
const loading = ref(true)
const error   = ref('')

const filterSearch   = ref('')
const filterUsername = ref('')
const filterCategory = ref('')
const filterDateFrom = ref('')
const filterDateTo   = ref('')

const PAGE_SIZE   = 20
const currentPage = ref(0)

// ── Derived ─────────────────────────────────────────────────────────
const uniqueUsernames = computed(() => {
  const set = new Set<string>()
  allLogs.value.forEach(l => { if (l.username) set.add(l.username) })
  return [...set].sort()
})

const hasActiveFilter = computed(() =>
  !!(filterSearch.value || filterUsername.value || filterCategory.value || filterDateFrom.value || filterDateTo.value)
)

const filteredLogs = computed(() => {
  let list = allLogs.value

  if (filterUsername.value)
    list = list.filter(l => l.username === filterUsername.value)

  if (filterCategory.value)
    list = list.filter(l => getCategory(l.action) === filterCategory.value)

  if (filterDateFrom.value) {
    const from = new Date(filterDateFrom.value).getTime()
    list = list.filter(l => new Date(l.createdAt).getTime() >= from)
  }
  if (filterDateTo.value) {
    const to = new Date(filterDateTo.value + 'T23:59:59').getTime()
    list = list.filter(l => new Date(l.createdAt).getTime() <= to)
  }

  if (filterSearch.value.trim()) {
    const q = filterSearch.value.trim().toLowerCase()
    list = list.filter(l =>
      (l.entityType?.toLowerCase().includes(q)) ||
      (l.entityId?.toLowerCase().includes(q)) ||
      formatEntityType(l.entityType).toLowerCase().includes(q)
    )
  }

  return list
})

const totalFiltered = computed(() => filteredLogs.value.length)
const totalPages    = computed(() => Math.ceil(totalFiltered.value / PAGE_SIZE))

const pagedLogs = computed(() => {
  const start = currentPage.value * PAGE_SIZE
  return filteredLogs.value.slice(start, start + PAGE_SIZE)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const pages: (number | string)[] = []
  if (cur > 2)              { pages.push(0); if (cur > 3) pages.push('...') }
  for (let i = Math.max(0, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 3)      { if (cur < total - 4) pages.push('...'); pages.push(total - 1) }
  return pages
})

// Reset page when filters change
watch([filterSearch, filterUsername, filterCategory, filterDateFrom, filterDateTo], () => {
  currentPage.value = 0
})

function clearFilters() {
  filterSearch.value   = ''
  filterUsername.value = ''
  filterCategory.value = ''
  filterDateFrom.value = ''
  filterDateTo.value   = ''
  currentPage.value    = 0
}

// ── Fetch ────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const res = await auditService.getAll(0, 500)
    const raw = res.data?.data ?? (res.data as any)
    const auditLogs = Array.isArray(raw) ? raw : (raw?.content ?? [])
    allLogs.value = auditLogs

    if (auditLogs.length > 0) {
      console.log('auditLogs[0]', auditLogs[0])
      const fieldNames = Object.keys(auditLogs[0] ?? {})
      console.log('auditLogs[0] field names:', fieldNames)
    }
  } catch {
    error.value = 'Không thể tải dữ liệu audit. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.th {
  @apply text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-5 py-3;
}
.td {
  @apply px-5 py-3.5;
}
.filter-select {
  @apply w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E9EE] rounded-lg text-[13px] text-[#414A4D]
         outline-none focus:border-[#A8845A] focus:ring-1 focus:ring-[#A8845A]/30 transition;
}
.page-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280]
         hover:bg-[#F5F6FA] disabled:opacity-30 disabled:cursor-not-allowed transition;
}
</style>
