<template>
  <div class="p-6 space-y-6">
    <!-- Top row: Greeting + Market card -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Greeting -->
      <div class="lg:col-span-2 bg-[#D6E8F5] rounded-2xl px-6 py-6 flex items-start justify-between overflow-hidden relative">
        <div class="relative z-10">
          <h2 class="text-[#0F2E4A] font-bold text-2xl leading-tight">
            Chào buổi sáng,<br />Quản trị viên
          </h2>
          <p class="text-[#5A7A90] text-sm mt-2 max-w-xs">
            Hệ thống ghi nhận <strong>{{ newTransactions }}</strong> giao dịch mới tại phân khu
            <strong>{{ latestZone }}</strong>.
          </p>
        </div>
        <!-- Decorative apartment icon -->
        <div class="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 hidden sm:block pointer-events-none">
          <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
            <rect x="10" y="30" width="35" height="45" rx="2" fill="#0F2E4A"/>
            <rect x="50" y="20" width="40" height="55" rx="2" fill="#0F2E4A"/>
            <rect x="18" y="40" width="8" height="8" rx="1" fill="white" fill-opacity="0.6"/>
            <rect x="32" y="40" width="8" height="8" rx="1" fill="white" fill-opacity="0.6"/>
            <rect x="18" y="54" width="8" height="8" rx="1" fill="white" fill-opacity="0.6"/>
            <rect x="32" y="54" width="8" height="8" rx="1" fill="white" fill-opacity="0.6"/>
            <rect x="58" y="30" width="8" height="8" rx="1" fill="white" fill-opacity="0.6"/>
            <rect x="72" y="30" width="8" height="8" rx="1" fill="white" fill-opacity="0.6"/>
            <rect x="58" y="44" width="8" height="8" rx="1" fill="white" fill-opacity="0.6"/>
            <rect x="72" y="44" width="8" height="8" rx="1" fill="white" fill-opacity="0.6"/>
            <rect x="58" y="58" width="8" height="8" rx="1" fill="white" fill-opacity="0.6"/>
            <rect x="72" y="58" width="8" height="8" rx="1" fill="white" fill-opacity="0.6"/>
            <rect x="22" y="63" width="11" height="12" rx="1" fill="white" fill-opacity="0.8"/>
            <path d="M5 30 L27 15 L45 30" fill="#0F2E4A"/>
            <path d="M45 20 L70 5 L90 20" fill="#0F2E4A"/>
          </svg>
        </div>
      </div>

      <!-- Market growth -->
      <div class="bg-[#0F2E4A] rounded-2xl px-6 py-6">
        <div class="flex items-center justify-between mb-3">
          <div class="bg-[#1a4060] p-2.5 rounded-xl">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="7" width="4" height="10" rx="1" fill="#A9B8A8"/>
              <rect x="7" y="4" width="4" height="13" rx="1" fill="#A9B8A8"/>
              <rect x="13" y="1" width="4" height="16" rx="1" fill="#A8845A"/>
            </svg>
          </div>
          <span class="text-[#A9B8A8] text-xs font-semibold tracking-widest uppercase">Thị Trường</span>
        </div>
        <div v-if="loading.stats" class="h-12 flex items-center">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <div v-else>
          <p v-if="marketPrimary" class="font-bold leading-none"
            :class="[marketTextClass, marketIsCount ? 'text-4xl' : 'text-4xl']">
            {{ marketPrimary }}<span v-if="marketIsCount" class="text-xl ml-1 font-medium">căn</span>
          </p>
          <p v-else class="text-white/40 text-lg mt-2 font-bold">Chưa có dữ liệu</p>
          <p class="text-[#7DA5BE] text-sm mt-1">{{ marketSubtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Second row: Tổng sản phẩm -->
    <div class="bg-white rounded-2xl px-6 py-5 flex items-center justify-between">
      <div>
        <p class="text-[#7A9AAD] text-xs font-semibold tracking-widest uppercase mb-1">Tổng sản phẩm</p>
        <div class="flex items-center gap-2.5">
          <div v-if="loading.stats" class="h-10 w-24 bg-[#F0F4F8] rounded animate-pulse" />
          <template v-else>
            <span class="text-[#0F2E4A] font-bold text-4xl">{{ stats?.total?.toLocaleString('vi') ?? '—' }}</span>
            <span
              v-if="growthPill != null"
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              :class="growthPill >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'"
            >
              {{ growthPill >= 0 ? '+' : '' }}{{ growthPill.toFixed(0) }}%
            </span>
          </template>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <span v-for="(val, key) in (stats?.byStatus ?? {})" :key="key"
            class="text-xs px-2.5 py-1 rounded-lg font-medium"
            :class="statusClass(key)">
            {{ statusLabel(key) }}: {{ val }}
          </span>
        </div>
        <button @click="$router.push('/apartments')"
          class="w-9 h-9 rounded-full bg-[#0F2E4A] flex items-center justify-center flex-shrink-0 hover:bg-[#1a4060] transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Third row: Portfolio + System sections -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <!-- Quản lý bảng hàng — 2 cols -->
      <div class="xl:col-span-2 bg-white rounded-2xl overflow-hidden">
        <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F0F4F8]">
          <div class="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="16" height="16" rx="2.5" stroke="#414A4D" stroke-width="1.5"/>
              <path d="M5 6h8M5 9h8M5 12h5" stroke="#414A4D" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="text-[#414A4D] font-semibold text-sm tracking-wide">Quản lý bảng hàng</span>
          </div>
          <button
            @click="$router.push('/portfolios')"
            class="flex items-center gap-1.5 bg-[#0F2E4A] text-white text-xs font-medium px-3 py-2 rounded-xl hover:bg-[#1a4060] transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1v8M1 5h8" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            Thêm
          </button>
        </div>

        <div v-if="loading.portfolios" class="px-6 py-4 space-y-2">
          <div v-for="i in 3" :key="i" class="h-12 bg-[#F0F4F8] rounded-xl animate-pulse" />
        </div>

        <div v-else-if="!portfolios.length" class="px-6 py-10 text-center text-[#A9B8A8] text-sm">
          Chưa có portfolio nào
        </div>

        <div v-else class="divide-y divide-[#F0F4F8]">
          <div v-for="p in portfolios" :key="p.id">
            <!-- Portfolio row -->
            <div
              class="flex items-center gap-3 px-6 py-4 cursor-pointer transition-colors select-none"
              :class="expandedPortfolio === p.id
                ? 'bg-[#0F2E4A]'
                : 'hover:bg-[#F8FAFB]'"
              @click="togglePortfolio(p.id)"
            >
              <!-- dots icon -->
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="flex-shrink-0">
                <circle cx="3" cy="4" r="1.5" :fill="expandedPortfolio === p.id ? '#A9B8A8' : '#C5D5DF'"/>
                <circle cx="3" cy="10" r="1.5" :fill="expandedPortfolio === p.id ? '#A9B8A8' : '#C5D5DF'"/>
                <circle cx="9" cy="4" r="1.5" :fill="expandedPortfolio === p.id ? '#A9B8A8' : '#C5D5DF'"/>
                <circle cx="9" cy="10" r="1.5" :fill="expandedPortfolio === p.id ? '#A9B8A8' : '#C5D5DF'"/>
              </svg>
              <span class="flex-1 font-semibold text-sm" :class="expandedPortfolio === p.id ? 'text-white' : 'text-[#414A4D]'">
                {{ p.name }}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full"
                :class="expandedPortfolio === p.id ? 'bg-[#1a4060] text-[#A9B8A8]' : 'bg-[#F0F4F8] text-[#7A9AAD]'">
                {{ p.zones?.length ?? 0 }} phân khu
              </span>
              <!-- Action icons — always visible -->
              <div class="flex items-center gap-2 flex-shrink-0" @click.stop>
                <button
                  @click="$router.push(`/portfolios/${p.id}`)"
                  class="transition-colors"
                  :class="expandedPortfolio === p.id ? 'text-[#A9B8A8] hover:text-white' : 'text-[#B0C4D0] hover:text-[#A8845A]'"
                  title="Chỉnh sửa"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M10.5 2l2.5 2.5L5 12.5H2.5V10L10.5 2z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button
                  @click="deletePortfolio(p.id)"
                  class="transition-colors"
                  :class="expandedPortfolio === p.id ? 'text-[#A9B8A8] hover:text-red-400' : 'text-[#B0C4D0] hover:text-red-400'"
                  title="Xóa"
                >
                  <svg width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <path d="M1 4h12M4.5 4V2.5h5V4M5.5 7v5M8.5 7v5M2 4l.8 9h8.4L12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <!-- Chevron -->
              <svg v-if="expandedPortfolio === p.id" width="10" height="7" viewBox="0 0 10 7" fill="none" class="flex-shrink-0">
                <path d="M1 1l4 4 4-4" stroke="#A9B8A8" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else width="7" height="12" viewBox="0 0 7 12" fill="none" class="flex-shrink-0">
                <path d="M1 1l5 5-5 5" stroke="#A9B8A8" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>

            <!-- Zones list -->
            <div v-if="expandedPortfolio === p.id" class="bg-[#162840] px-6 py-4">
              <div v-if="!p.zones?.length" class="text-[#7DA5BE] text-sm italic">Chưa có phân khu</div>
              <div v-else class="space-y-2">
                <div v-for="zone in p.zones" :key="zone.id"
                  class="flex items-center justify-between bg-[#1a3a5c] hover:bg-[#1e4268] rounded-xl px-4 py-3 transition-colors group/zone">
                  <div>
                    <p class="text-white text-sm font-medium">{{ zone.name }}</p>
                    <p class="text-[#7DA5BE] text-xs mt-0.5 font-mono">{{ zone.code }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="$router.push(`/zones/${zone.id}`)"
                      class="flex items-center gap-1 text-[#7DA5BE] hover:text-white text-xs px-3 py-1.5 rounded-lg bg-[#0F2E4A] hover:bg-[#A8845A] transition-colors"
                    >
                      Xem
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column: Nhân sự + Hệ thống -->
      <div class="space-y-4">
        <!-- Quản lý nhân sự -->
        <div class="bg-white rounded-2xl overflow-hidden">
          <div class="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-[#F0F4F8]">
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
              <circle cx="6.5" cy="5" r="3.5" stroke="#414A4D" stroke-width="1.5"/>
              <circle cx="13" cy="5" r="3.5" stroke="#414A4D" stroke-width="1.5"/>
              <path d="M0.5 15c0-3.314 2.686-6 6-6" stroke="#414A4D" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M7 15c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#414A4D" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="text-[#414A4D] font-semibold text-sm">Quản lý nhân sự</span>
          </div>
          <div class="divide-y divide-[#F0F4F8]">
            <button @click="$router.push('/departments')"
              class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFB] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2.5" stroke="#A8845A" stroke-width="1.5"/><path d="M4 7h8M4 10h5" stroke="#A8845A" stroke-width="1.5" stroke-linecap="round"/></svg>
              <span class="flex-1 text-left text-[#414A4D] text-sm font-medium">Phòng ban</span>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="#A9B8A8" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
            <button @click="$router.push('/employees')"
              class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFB] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3.5" stroke="#A8845A" stroke-width="1.5"/><path d="M1.5 15c0-3.314 2.686-6 6.5-6s6.5 2.686 6.5 6" stroke="#A8845A" stroke-width="1.5" stroke-linecap="round"/></svg>
              <span class="flex-1 text-left text-[#414A4D] text-sm font-medium">Nhân viên</span>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="#A9B8A8" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>

        <!-- Quản lý hệ thống -->
        <div class="bg-white rounded-2xl overflow-hidden">
          <div class="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-[#F0F4F8]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2l1.5 3 3.5-.3-2 2.7 1.3 3.3-3.3-1.2L9 12l-.9-2.5-3.3 1.2 1.3-3.3-2-2.7 3.5.3L9 2z" stroke="#414A4D" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            <span class="text-[#414A4D] font-semibold text-sm">Quản lý hệ thống</span>
          </div>
          <div class="divide-y divide-[#F0F4F8]">
            <button @click="$router.push('/audit-logs')"
              class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFB] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="2" stroke="#A8845A" stroke-width="1.5"/><path d="M5 6h6M5 9h4" stroke="#A8845A" stroke-width="1.5" stroke-linecap="round"/></svg>
              <span class="flex-1 text-left text-[#414A4D] text-sm font-medium">Lịch sử Audit</span>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="#A9B8A8" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
            <a href="http://localhost:8080/api/swagger-ui/index.html" target="_blank"
              class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFB] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#A8845A" stroke-width="1.5"/><path d="M6 6a2 2 0 1 1 2 2v1.5M8 12h.01" stroke="#A8845A" stroke-width="1.5" stroke-linecap="round"/></svg>
              <span class="flex-1 text-left text-[#414A4D] text-sm font-medium">API Swagger</span>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M4 2h5v5" stroke="#A9B8A8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dashboardService from '@/services/dashboardService'
import portfolioService from '@/services/portfolioService'
import { useToastStore } from '@/stores/toastStore'
import type { DashboardStatsResponse } from '@/types/dashboard'
import type { Portfolio } from '@/types/portfolio'

const router = useRouter()
const toastStore = useToastStore()
const loading = ref({ stats: true, portfolios: true })
const stats = ref<DashboardStatsResponse | null>(null)
const portfolios = ref<Portfolio[]>([])
const expandedPortfolio = ref<string | null>(null)

const newTransactions = ref(14)
const latestZone = ref('Lumi Hà Nội')
const currentMonth = computed(() => new Date().getMonth() + 1)

const growthPill = computed(() => {
  const growth = stats.value?.growth
  if (!growth?.lastMonth) return null
  return growth.percentage ?? null
})

// Card Thị Trường — hiển thị % nếu có, fallback sang số căn tháng này
const marketPrimary = computed(() => {
  const growth = stats.value?.growth
  if (!growth) return null
  if (growth.percentage != null) return (growth.percentage >= 0 ? '+' : '') + growth.percentage.toFixed(1) + '%'
  if (growth.thisMonth > 0) return String(growth.thisMonth)
  return null
})

const marketIsCount = computed(() => {
  const growth = stats.value?.growth
  return growth?.percentage == null && (growth?.thisMonth ?? 0) > 0
})

const marketSubtitle = computed(() => {
  const growth = stats.value?.growth
  const m = currentMonth.value
  if (growth?.percentage != null) return `Tăng trưởng tồn kho tháng ${m}`
  if (growth && growth.thisMonth > 0) return `Căn hộ mới tháng ${m}`
  return `Tháng ${m}`
})

const marketTextClass = computed(() => {
  const p = stats.value?.growth?.percentage
  if (p == null) return 'text-white'
  return p >= 0 ? 'text-emerald-400' : 'text-red-400'
})

function togglePortfolio(id: string) {
  expandedPortfolio.value = expandedPortfolio.value === id ? null : id
}

function statusLabel(key: string) {
  const map: Record<string, string> = {
    DANG_BAN: 'Đang bán', DA_COC: 'Đã cọc', DA_BAN: 'Đã bán', GIU_CHO: 'Giữ chỗ', KHOA: 'Khoá',
  }
  return map[key] ?? key
}

function statusClass(key: string) {
  const map: Record<string, string> = {
    DANG_BAN: 'bg-emerald-50 text-emerald-700',
    DA_COC: 'bg-amber-50 text-amber-700',
    DA_BAN: 'bg-blue-50 text-blue-700',
    GIU_CHO: 'bg-purple-50 text-purple-700',
    KHOA: 'bg-red-50 text-red-600',
  }
  return map[key] ?? 'bg-[#F0F4F8] text-[#414A4D]'
}

function deletePortfolio(_id: string) {
  router.push('/portfolios')
}

async function fetchStats() {
  try {
    const res = await dashboardService.getStats()
    stats.value = res.data.data
  } catch {
    toastStore.show('Không thể tải thống kê, vui lòng thử lại', 'error')
  } finally {
    loading.value.stats = false
  }
}

async function fetchPortfolios() {
  try {
    const res = await portfolioService.getAll()
    portfolios.value = res.data.data ?? []
    if (portfolios.value.length) expandedPortfolio.value = portfolios.value[0].id
  } catch {
    toastStore.show('Không thể tải danh sách portfolio, vui lòng thử lại', 'error')
  } finally {
    loading.value.portfolios = false
  }
}

onMounted(() => {
  fetchStats()
  fetchPortfolios()
})
</script>
