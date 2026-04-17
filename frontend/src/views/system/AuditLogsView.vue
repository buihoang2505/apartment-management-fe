<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-[#0F2E4A] font-bold text-xl">Lịch sử Audit</h2>
        <p class="text-[#7A9AAD] text-sm mt-0.5">Toàn bộ thao tác trong hệ thống</p>
      </div>
      <span class="bg-[#F0F4F8] text-[#414A4D] text-sm font-medium px-4 py-2 rounded-xl">
        {{ logs.length }} bản ghi
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 8" :key="i" class="bg-white rounded-xl h-14 animate-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600 text-sm">
      {{ error }}
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-[#F0F4F8]">
              <th class="text-left text-[#7A9AAD] font-semibold text-xs uppercase tracking-wide px-5 py-3">Thời gian</th>
              <th class="text-left text-[#7A9AAD] font-semibold text-xs uppercase tracking-wide px-5 py-3">Người dùng</th>
              <th class="text-left text-[#7A9AAD] font-semibold text-xs uppercase tracking-wide px-5 py-3">Hành động</th>
              <th class="text-left text-[#7A9AAD] font-semibold text-xs uppercase tracking-wide px-5 py-3">Đối tượng</th>
              <th class="text-left text-[#7A9AAD] font-semibold text-xs uppercase tracking-wide px-5 py-3">IP</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F0F4F8]">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-[#F8FAFB] transition-colors">
              <td class="px-5 py-3.5 text-[#7A9AAD] whitespace-nowrap text-xs">
                {{ formatDate(log.createdAt) }}
              </td>
              <td class="px-5 py-3.5 text-[#414A4D] font-medium whitespace-nowrap">
                {{ log.username }}
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap">
                <span class="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold" :class="actionClass(log.action)">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-[#414A4D] whitespace-nowrap">
                <span class="text-[#7A9AAD] text-xs">{{ log.entityType }}</span>
              </td>
              <td class="px-5 py-3.5 text-[#7A9AAD] text-xs whitespace-nowrap">
                {{ log.ipAddress }}
              </td>
            </tr>
            <tr v-if="!logs.length">
              <td colspan="5" class="px-5 py-10 text-center text-[#A9B8A8] text-sm">
                Chưa có dữ liệu audit
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import auditService from '@/services/auditService'
import type { AuditLogResponse } from '@/types/audit'

const logs = ref<AuditLogResponse[]>([])
const loading = ref(true)
const error = ref('')

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function actionClass(action: string) {
  const a = action?.toUpperCase() ?? ''
  if (a.includes('CREATE') || a.includes('ADD')) return 'bg-emerald-50 text-emerald-700'
  if (a.includes('UPDATE') || a.includes('EDIT')) return 'bg-blue-50 text-blue-700'
  if (a.includes('DELETE') || a.includes('REMOVE')) return 'bg-red-50 text-red-600'
  return 'bg-[#F0F4F8] text-[#414A4D]'
}

onMounted(async () => {
  try {
    const res = await auditService.getAll(0, 100)
    logs.value = res.data.data?.content ?? []
  } catch {
    error.value = 'Không thể tải dữ liệu audit. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
})
</script>
