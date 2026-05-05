<template>
  <div ref="wrapperRef" class="relative">

    <!-- Search icon button (collapsed) -->
    <button
      v-if="!isOpen"
      class="w-9 h-9 rounded-[10px] hover:bg-[#F5F6FA] flex items-center justify-center transition-colors"
      title="Tìm kiếm (Ctrl+K)"
      @click="open"
    >
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="7.5" cy="7.5" r="5.5" stroke="#6B7280" stroke-width="1.5"/>
        <path d="M12 12L15 15" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>

    <!-- Expanded: input + dropdown -->
    <div v-else>
      <!-- Input bar -->
      <div class="relative flex items-center">
        <svg class="absolute left-3 text-[#9CA3AF] pointer-events-none" width="15" height="15" viewBox="0 0 17 17" fill="none">
          <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          ref="inputRef"
          v-model="keyword"
          type="text"
          placeholder="Tìm căn hộ, nhân viên, portfolio..."
          class="w-[160px] sm:w-[260px] md:w-[340px] pl-9 pr-8 py-2 bg-[#F5F6FA] border border-[#E5E9EE] rounded-[10px] text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:bg-white transition-all placeholder:text-[#C5D5DF]"
          @keydown.escape="close"
        />
        <button
          class="absolute right-2.5 text-[#B0BEC5] hover:text-[#414A4D] transition-colors"
          tabindex="-1"
          @click="close"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Dropdown -->
      <div
        v-if="keyword.length >= 2"
        class="absolute right-0 mt-2 w-[300px] sm:w-[380px] max-w-[calc(100vw-24px)] bg-white rounded-xl border border-[#E5E9EE] z-[60] max-h-[420px] overflow-y-auto"
        style="box-shadow: 0 8px 24px rgba(0,0,0,0.12); top: 100%;"
      >
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center gap-2 py-8 text-[#9CA3AF] text-sm">
          <div class="w-4 h-4 border-2 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
          Đang tìm...
        </div>

        <template v-else>
          <!-- Căn hộ -->
          <div v-if="results.apartments.length">
            <p class="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-4 pt-3 pb-1.5">Căn hộ</p>
            <button
              v-for="item in results.apartments"
              :key="item.id"
              class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F6FA] transition-colors text-left"
              @click="navigateTo('apartments', item.id)"
            >
              <div class="w-7 h-7 rounded-lg bg-[#EEF3F7] flex items-center justify-center flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5A7A90" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-[#414A4D] truncate">{{ item.displayCode || item.unitCode }}</p>
                <p class="text-xs text-[#9CA3AF] truncate">{{ item.buildingName }} · {{ item.zoneName }}</p>
              </div>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" :class="statusClass(item.status)">
                {{ statusLabel(item.status) }}
              </span>
            </button>
          </div>

          <!-- Nhân viên -->
          <div v-if="results.employees.length">
            <p class="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-4 pt-3 pb-1.5">Nhân viên</p>
            <button
              v-for="item in results.employees"
              :key="item.id"
              class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F6FA] transition-colors text-left"
              @click="navigateTo('employees', item.id)"
            >
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-[#A8845A]"
                style="background-color: rgba(168,132,90,0.12);"
              >
                {{ item.fullName.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-[#414A4D] truncate">{{ item.fullName }}</p>
                <p class="text-xs text-[#9CA3AF] truncate">
                  {{ item.position || 'Nhân viên' }}{{ item.departmentName ? ' · ' + item.departmentName : '' }}
                </p>
              </div>
            </button>
          </div>

          <!-- Portfolio -->
          <div v-if="results.portfolios.length">
            <p class="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-4 pt-3 pb-1.5">Portfolio</p>
            <button
              v-for="item in results.portfolios"
              :key="item.id"
              class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F6FA] transition-colors text-left"
              @click="navigateTo('portfolios', item.id)"
            >
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style="background-color: rgba(15,46,74,0.08);"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F2E4A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-[#414A4D] truncate">{{ item.name }}</p>
                <p class="text-xs text-[#9CA3AF] truncate">{{ item.zones?.length ?? 0 }} phân khu</p>
              </div>
            </button>
          </div>

          <!-- Không có kết quả -->
          <div
            v-if="!results.apartments.length && !results.employees.length && !results.portfolios.length"
            class="py-10 text-center"
          >
            <svg class="w-8 h-8 text-[#D1D5DB] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke-width="1.5"/>
              <path d="M21 21l-4.35-4.35" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p class="text-[#9CA3AF] text-sm">Không có kết quả cho</p>
            <p class="text-[#414A4D] text-sm font-semibold mt-0.5">"{{ keyword }}"</p>
          </div>

          <!-- Footer hint -->
          <div
            v-if="results.apartments.length || results.employees.length || results.portfolios.length"
            class="border-t border-[#F0F5F9] px-4 py-2 flex items-center gap-1 text-[11px] text-[#B0BEC5]"
          >
            <kbd class="px-1.5 py-0.5 bg-[#F0F5F9] rounded text-[10px] font-mono">↵</kbd>
            chọn &nbsp;·&nbsp;
            <kbd class="px-1.5 py-0.5 bg-[#F0F5F9] rounded text-[10px] font-mono">Esc</kbd>
            đóng
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import apartmentService from '@/services/apartmentService'
import employeeService from '@/services/employeeService'
import portfolioService from '@/services/portfolioService'
import type { ApartmentResponse } from '@/types/apartment'
import type { EmployeeResponse } from '@/types/employee'
import type { Portfolio } from '@/types/portfolio'

const router     = useRouter()
const wrapperRef = ref<HTMLElement | null>(null)
const inputRef   = ref<HTMLInputElement | null>(null)

const isOpen  = ref(false)
const keyword = ref('')
const loading = ref(false)

const results = reactive<{
  apartments: ApartmentResponse[]
  employees:  EmployeeResponse[]
  portfolios: Portfolio[]
}>({ apartments: [], employees: [], portfolios: [] })

// Pre-fetched caches — employees + portfolios nhỏ, load 1 lần
let cachedEmployees:  EmployeeResponse[] = []
let cachedPortfolios: Portfolio[]        = []
let prefetchDone = false

async function prefetch() {
  if (prefetchDone) return
  prefetchDone = true
  const [empRes, portRes] = await Promise.allSettled([
    employeeService.getList({ size: 200 }),
    portfolioService.getAll(),
  ])
  if (empRes.status === 'fulfilled') {
    const d = (empRes.value.data as any)?.data
    cachedEmployees = Array.isArray(d) ? d : (d?.content ?? [])
  }
  if (portRes.status === 'fulfilled') {
    cachedPortfolios = (portRes.value.data as any)?.data ?? []
  }
}

async function open() {
  isOpen.value = true
  await nextTick()
  inputRef.value?.focus()
  prefetch()
}

function close() {
  isOpen.value  = false
  keyword.value = ''
  results.apartments = []
  results.employees  = []
  results.portfolios = []
}

// Debounce search
let searchTimer: ReturnType<typeof setTimeout>
watch(keyword, (q) => {
  clearTimeout(searchTimer)
  if (q.length < 2) {
    results.apartments = []
    results.employees  = []
    results.portfolios = []
    return
  }
  searchTimer = setTimeout(() => doSearch(q), 300)
})

async function doSearch(q: string) {
  loading.value = true
  const lq = q.toLowerCase()

  // Client-side filter cho employees + portfolios đã cache
  results.employees = cachedEmployees
    .filter(e =>
      e.fullName.toLowerCase().includes(lq) ||
      (e.position ?? '').toLowerCase().includes(lq) ||
      (e.departmentName ?? '').toLowerCase().includes(lq)
    )
    .slice(0, 5)

  results.portfolios = cachedPortfolios
    .filter(p =>
      p.name.toLowerCase().includes(lq) ||
      (p.description ?? '').toLowerCase().includes(lq)
    )
    .slice(0, 3)

  // Server-side search cho apartments
  try {
    const res = await apartmentService.getList({ search: q.trim(), size: 5 })
    results.apartments = (res.data as any)?.data?.content ?? []
  } catch {
    results.apartments = []
  } finally {
    loading.value = false
  }
}

function navigateTo(type: string, id: string) {
  close()
  router.push(`/${type}/${id}`)
}

// Status labels — mirrors ApartmentListView
function statusLabel(key: string): string {
  const map: Record<string, string> = {
    DANG_BAN: 'Đang bán', DA_COC: 'Đã cọc', DA_BAN: 'Đã bán', GIU_CHO: 'Giữ chỗ', KHOA: 'Khoá',
  }
  return map[key] ?? key
}
function statusClass(key: string): string {
  const map: Record<string, string> = {
    DANG_BAN: 'bg-emerald-50 text-emerald-700',
    DA_COC:   'bg-amber-50 text-amber-700',
    DA_BAN:   'bg-blue-50 text-blue-700',
    GIU_CHO:  'bg-purple-50 text-purple-700',
    KHOA:     'bg-red-50 text-red-600',
  }
  return map[key] ?? 'bg-[#F0F4F8] text-[#414A4D]'
}

// Ctrl+K shortcut
function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value ? close() : open()
  }
}

// Click outside để đóng
function onDocumentClick(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>
