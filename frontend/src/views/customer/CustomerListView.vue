<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-[#0F2E4A]">Khách hàng</h1>
        <p class="text-sm text-[#414A4D]/60 mt-1">Quản lý lead, nguồn và trạng thái chăm sóc</p>
      </div>
      <button
        @click="openCreateModal"
        class="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Thêm khách hàng
      </button>
    </div>

    <!-- Funnel summary -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      <button
        v-for="s in STATUS_ORDER"
        :key="s"
        @click="toggleStatusFilter(s)"
        class="bg-white rounded-xl border p-3 sm:p-4 text-left transition hover:shadow-sm"
        :class="filterStatus === s ? 'border-[#A8845A] ring-2 ring-[#A8845A]/20' : 'border-[#DDE8EF] hover:border-[#A9B8A8]/60'"
      >
        <div class="flex items-center gap-1.5 mb-1">
          <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_META[s].dot" />
          <span class="text-xs text-[#414A4D]/60 truncate">{{ STATUS_META[s].label }}</span>
        </div>
        <p class="text-lg sm:text-xl font-bold text-[#0F2E4A]">{{ stats.byStatus[s] ?? 0 }}</p>
      </button>
    </div>

    <!-- Filter bar -->
    <div class="flex flex-wrap gap-2 sm:gap-3 items-center">
      <div class="relative flex-1 min-w-[200px]">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#414A4D]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchInput"
          @input="onSearchInput"
          type="text"
          placeholder="Tìm theo tên, email, số điện thoại..."
          class="w-full pl-10 pr-3 py-2 bg-white border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
        />
      </div>

      <select
        v-model="filterSource"
        @change="fetchCustomers"
        class="px-3 py-2 bg-white border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition min-w-[140px]"
      >
        <option value="">Tất cả nguồn</option>
        <option v-for="s in SOURCE_ORDER" :key="s" :value="s">{{ SOURCE_META[s] }}</option>
      </select>

      <button
        v-if="filterStatus || filterSource || searchInput"
        @click="clearFilters"
        class="text-xs text-[#A8845A] font-medium underline"
      >
        Xoá bộ lọc
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border border-[#DDE8EF] p-5 animate-pulse">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-[#F0F5F9]" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-[#F0F5F9] rounded-lg w-3/4" />
            <div class="h-3 bg-[#F0F5F9] rounded-lg w-1/2" />
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-3 bg-[#F0F5F9] rounded-lg w-full" />
          <div class="h-3 bg-[#F0F5F9] rounded-lg w-4/5" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 mb-3">{{ error }}</p>
      <button @click="fetchCustomers" class="text-sm text-red-500 underline">Thử lại</button>
    </div>

    <!-- Empty (no filters) -->
    <div
      v-else-if="customers.length === 0 && !hasFilter"
      class="bg-white rounded-2xl border border-[#DDE8EF] p-16 text-center"
    >
      <div class="w-16 h-16 bg-[#F0F7FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[#A9B8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p class="text-[#414A4D]/60 text-sm">Chưa có khách hàng nào</p>
      <button @click="openCreateModal" class="mt-4 text-sm text-[#A8845A] font-medium underline">
        Thêm khách hàng đầu tiên
      </button>
    </div>

    <!-- Empty (with filters) -->
    <div
      v-else-if="customers.length === 0"
      class="bg-white rounded-2xl border border-[#DDE8EF] p-12 text-center"
    >
      <p class="text-[#414A4D]/60 text-sm">Không tìm thấy khách hàng phù hợp</p>
      <button @click="clearFilters" class="mt-3 text-sm text-[#A8845A] font-medium underline">
        Xoá bộ lọc
      </button>
    </div>

    <!-- Card grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="c in customers"
        :key="c.id"
        class="bg-white rounded-2xl border border-[#DDE8EF] p-5 hover:shadow-md hover:border-[#A9B8A8]/60 transition-all group"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-12 h-12 rounded-full bg-[#A8845A] flex items-center justify-center flex-shrink-0 text-white font-bold text-lg select-none">
              {{ avatarLetter(c.fullName) }}
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-[#0F2E4A] text-sm leading-tight truncate">{{ c.fullName }}</p>
              <p class="text-xs text-[#414A4D]/50 mt-0.5 truncate">{{ SOURCE_META[c.source] }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              @click="openEditModal(c)"
              class="p-1.5 rounded-lg text-[#414A4D]/40 hover:text-[#A8845A] hover:bg-[#FFF8F2] transition"
              title="Chỉnh sửa"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(c)"
              class="p-1.5 rounded-lg text-[#414A4D]/40 hover:text-red-500 hover:bg-red-50 transition"
              title="Xoá"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="space-y-1.5 mb-3">
          <div v-if="c.email" class="flex items-center gap-2 text-xs text-[#414A4D]/60">
            <svg class="w-3.5 h-3.5 text-[#A9B8A8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="truncate">{{ c.email }}</span>
          </div>
          <div v-if="c.phone" class="flex items-center gap-2 text-xs text-[#414A4D]/60">
            <svg class="w-3.5 h-3.5 text-[#A9B8A8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{{ c.phone }}</span>
          </div>
          <div v-if="c.assignedToName" class="flex items-center gap-2 text-xs text-[#414A4D]/60">
            <svg class="w-3.5 h-3.5 text-[#A9B8A8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="truncate">Phụ trách: {{ c.assignedToName }}</span>
          </div>
        </div>

        <p v-if="c.note" class="text-xs text-[#414A4D]/60 line-clamp-2 mb-3 italic">"{{ c.note }}"</p>

        <!-- Status selector -->
        <div class="pt-3 border-t border-[#F0F5F9]">
          <select
            :value="c.status"
            @change="onStatusChange(c, ($event.target as HTMLSelectElement).value as CustomerStatus)"
            :disabled="statusUpdating === c.id"
            class="w-full text-xs font-medium px-2.5 py-1.5 rounded-full border-0 cursor-pointer outline-none focus:ring-2 focus:ring-[#A8845A]/30 transition disabled:opacity-60"
            :class="STATUS_META[c.status].badge"
          >
            <option v-for="s in STATUS_ORDER" :key="s" :value="s">
              {{ STATUS_META[s].label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && totalPages > 1" class="flex items-center justify-center gap-2 pt-2">
      <button
        @click="goPage(page - 1)"
        :disabled="page === 0"
        class="px-3 py-1.5 text-sm border border-[#DDE8EF] rounded-lg disabled:opacity-40 hover:bg-[#F6F9FB]"
      >
        ←
      </button>
      <span class="text-sm text-[#414A4D]/60">{{ page + 1 }} / {{ totalPages }}</span>
      <button
        @click="goPage(page + 1)"
        :disabled="page + 1 >= totalPages"
        class="px-3 py-1.5 text-sm border border-[#DDE8EF] rounded-lg disabled:opacity-40 hover:bg-[#F6F9FB]"
      >
        →
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#DDE8EF] sticky top-0 bg-white z-10">
            <h2 class="text-base font-semibold text-[#0F2E4A]">
              {{ isEditing ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới' }}
            </h2>
            <button @click="closeModal" class="p-1 text-[#414A4D]/40 hover:text-[#414A4D] rounded-lg transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">
                Họ tên <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
                :class="{ 'border-red-400': formErrors.fullName }"
              />
              <p v-if="formErrors.fullName" class="text-xs text-red-500 mt-1">{{ formErrors.fullName }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="email@example.com"
                  class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
                  :class="{ 'border-red-400': formErrors.email }"
                />
                <p v-if="formErrors.email" class="text-xs text-red-500 mt-1">{{ formErrors.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">
                  Số điện thoại <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="0901 234 567"
                  class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
                  :class="{ 'border-red-400': formErrors.phone }"
                />
                <p v-if="formErrors.phone" class="text-xs text-red-500 mt-1">{{ formErrors.phone }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Nguồn</label>
                <select
                  v-model="form.source"
                  class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
                >
                  <option v-for="s in SOURCE_ORDER" :key="s" :value="s">{{ SOURCE_META[s] }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Trạng thái</label>
                <select
                  v-model="form.status"
                  class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
                >
                  <option v-for="s in STATUS_ORDER" :key="s" :value="s">{{ STATUS_META[s].label }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Nhân viên phụ trách</label>
              <select
                v-model="form.assignedToId"
                class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
              >
                <option value="">— Chưa phân công —</option>
                <option v-for="e in employees" :key="e.id" :value="e.id">{{ e.fullName }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Ghi chú</label>
              <textarea
                v-model="form.note"
                rows="3"
                placeholder="Quan tâm 2PN, ngân sách 3 tỷ..."
                class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition resize-none"
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

    <!-- Delete -->
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
              <h3 class="font-semibold text-[#0F2E4A]">Xác nhận xoá</h3>
              <p class="text-sm text-[#414A4D]/60 mt-0.5">
                Xoá khách hàng <span class="font-medium text-[#414A4D]">{{ deleteTarget.fullName }}</span>?
              </p>
            </div>
          </div>
          <p class="text-xs text-[#414A4D]/40 mb-5">Hành động này không thể hoàn tác.</p>
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
              Xoá
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
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import customerService from '@/services/customerService'
import employeeService from '@/services/employeeService'
import type {
  CustomerResponse,
  CustomerStatus,
  LeadSource,
  CustomerStats,
} from '@/types/customer'
import type { EmployeeResponse } from '@/types/employee'

// ── Lookup tables ──────────────────────────────────────
const STATUS_ORDER: CustomerStatus[] = ['NEW', 'CONTACTING', 'INTERESTED', 'NEGOTIATING', 'WON', 'LOST']
const STATUS_META: Record<CustomerStatus, { label: string; dot: string; badge: string }> = {
  NEW:         { label: 'Mới',          dot: 'bg-[#2563EB]', badge: 'bg-[#DBEAFE] text-[#2563EB]' },
  CONTACTING:  { label: 'Đang liên hệ', dot: 'bg-[#CA8A04]', badge: 'bg-[#FEF9C3] text-[#CA8A04]' },
  INTERESTED:  { label: 'Quan tâm',     dot: 'bg-[#A8845A]', badge: 'bg-[#FFF1E0] text-[#A8845A]' },
  NEGOTIATING: { label: 'Đàm phán',     dot: 'bg-[#7C3AED]', badge: 'bg-[#EDE9FE] text-[#7C3AED]' },
  WON:         { label: 'Chốt deal',    dot: 'bg-[#16A34A]', badge: 'bg-[#DCFCE7] text-[#16A34A]' },
  LOST:        { label: 'Mất khách',    dot: 'bg-[#414A4D]', badge: 'bg-[#414A4D]/10 text-[#414A4D]/70' },
}

const SOURCE_ORDER: LeadSource[] = ['WEBSITE', 'FACEBOOK', 'ZALO', 'REFERRAL', 'WALK_IN', 'OTHER']
const SOURCE_META: Record<LeadSource, string> = {
  WEBSITE: 'Website',
  FACEBOOK: 'Facebook',
  ZALO: 'Zalo',
  REFERRAL: 'Giới thiệu',
  WALK_IN: 'Khách đến trực tiếp',
  OTHER: 'Khác',
}

// ── State ──────────────────────────────────────────────
const customers = ref<CustomerResponse[]>([])
const employees = ref<EmployeeResponse[]>([])
const stats = ref<CustomerStats>({ total: 0, byStatus: {} })
const loading = ref(false)
const error = ref('')

const searchInput = ref('')
const filterStatus = ref<CustomerStatus | ''>('')
const filterSource = ref<LeadSource | ''>('')

const page = ref(0)
const size = ref(20)
const totalPages = ref(0)

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const emptyForm = () => ({
  fullName: '',
  email: '',
  phone: '',
  source: 'WEBSITE' as LeadSource,
  status: 'NEW' as CustomerStatus,
  assignedToId: '',
  note: '',
})
const form = ref(emptyForm())
const formErrors = ref<{ fullName?: string; email?: string; phone?: string }>({})
const submitting = ref(false)
const submitError = ref('')

const deleteTarget = ref<CustomerResponse | null>(null)
const deleting = ref(false)

const statusUpdating = ref<string | null>(null)

const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>
let searchDebounce: ReturnType<typeof setTimeout>

const hasFilter = computed(() => !!(filterStatus.value || filterSource.value || searchInput.value))

// ── Helpers ────────────────────────────────────────────
function avatarLetter(name: string): string {
  return (name || '?').trim().charAt(0).toUpperCase()
}

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

function clearFilters() {
  searchInput.value = ''
  filterStatus.value = ''
  filterSource.value = ''
  page.value = 0
  fetchCustomers()
}

function toggleStatusFilter(s: CustomerStatus) {
  filterStatus.value = filterStatus.value === s ? '' : s
  page.value = 0
  fetchCustomers()
}

function onSearchInput() {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    page.value = 0
    fetchCustomers()
  }, 350)
}

function goPage(p: number) {
  if (p < 0 || p >= totalPages.value) return
  page.value = p
  fetchCustomers()
}

// ── Fetch ──────────────────────────────────────────────
async function fetchCustomers() {
  loading.value = true
  error.value = ''
  try {
    const res = await customerService.getList({
      keyword: searchInput.value.trim() || undefined,
      status: filterStatus.value || undefined,
      source: filterSource.value || undefined,
      page: page.value,
      size: size.value,
    })
    const raw = (res.data as any)?.data ?? res.data
    if (Array.isArray(raw)) {
      customers.value = raw
      totalPages.value = 1
    } else {
      customers.value = raw?.content ?? []
      totalPages.value = raw?.totalPages ?? 0
    }
  } catch {
    error.value = 'Không thể tải danh sách khách hàng'
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    const res = await customerService.getStats()
    stats.value = res.data?.data ?? { total: 0, byStatus: {} }
  } catch {
    // optional — silent fail
  }
}

async function fetchEmployees() {
  try {
    const res = await employeeService.getList({ status: 'ACTIVE', size: 100 })
    const raw: any = (res.data as any)?.data ?? res.data
    employees.value = Array.isArray(raw) ? raw : (raw?.content ?? [])
  } catch {
    // optional
  }
}

// ── Modal ──────────────────────────────────────────────
function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  form.value = emptyForm()
  formErrors.value = {}
  submitError.value = ''
  showModal.value = true
}

function openEditModal(c: CustomerResponse) {
  isEditing.value = true
  editingId.value = c.id
  form.value = {
    fullName: c.fullName,
    email: c.email ?? '',
    phone: c.phone ?? '',
    source: c.source,
    status: c.status,
    assignedToId: c.assignedToId ?? '',
    note: c.note ?? '',
  }
  formErrors.value = {}
  submitError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function validateForm(): boolean {
  formErrors.value = {}
  if (!form.value.fullName.trim()) formErrors.value.fullName = 'Họ tên không được để trống'
  if (!form.value.phone.trim()) {
    formErrors.value.phone = 'Số điện thoại không được để trống'
  } else if (!/^[\d\s+()-]{8,}$/.test(form.value.phone.trim())) {
    formErrors.value.phone = 'Số điện thoại không hợp lệ'
  }
  if (form.value.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim())) {
    formErrors.value.email = 'Email không đúng định dạng'
  }
  return Object.keys(formErrors.value).length === 0
}

async function submitForm() {
  if (!validateForm()) return
  submitting.value = true
  submitError.value = ''
  try {
    const payload: Record<string, unknown> = {
      fullName: form.value.fullName.trim(),
      phone: form.value.phone.trim(),
      source: form.value.source,
      status: form.value.status,
    }
    if (form.value.email.trim()) payload.email = form.value.email.trim()
    if (form.value.assignedToId) payload.assignedToId = form.value.assignedToId
    if (form.value.note.trim()) payload.note = form.value.note.trim()

    if (isEditing.value && editingId.value) {
      await customerService.update(editingId.value, payload)
      showToast('success', 'Đã cập nhật khách hàng')
    } else {
      await customerService.create(payload)
      showToast('success', 'Đã thêm khách hàng mới')
    }
    closeModal()
    await Promise.all([fetchCustomers(), fetchStats()])
  } catch (e: any) {
    submitError.value = e?.response?.data?.message ?? e?.response?.data?.error ?? 'Có lỗi xảy ra'
  } finally {
    submitting.value = false
  }
}

// ── Status quick change ────────────────────────────────
async function onStatusChange(c: CustomerResponse, newStatus: CustomerStatus) {
  if (c.status === newStatus) return
  const prevStatus = c.status
  c.status = newStatus // optimistic
  statusUpdating.value = c.id
  try {
    await customerService.updateStatus(c.id, newStatus)
    showToast('success', `Đã chuyển sang "${STATUS_META[newStatus].label}"`)
    fetchStats()
  } catch (e: any) {
    c.status = prevStatus
    showToast('error', e?.response?.data?.message ?? 'Không cập nhật được trạng thái')
  } finally {
    statusUpdating.value = null
  }
}

// ── Delete ─────────────────────────────────────────────
function confirmDelete(c: CustomerResponse) {
  deleteTarget.value = c
}

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await customerService.deleteById(deleteTarget.value.id)
    showToast('success', 'Đã xoá khách hàng')
    deleteTarget.value = null
    await Promise.all([fetchCustomers(), fetchStats()])
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Xoá thất bại')
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchCustomers()
  fetchStats()
  fetchEmployees()
})
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
