<template>
  <div class="w-full max-w-[420px]">
    <!-- Logo + app name -->
    <div class="flex flex-col items-center mb-8">
      <div class="w-14 h-14 bg-el-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
        <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
          <rect x="3" y="12" width="30" height="20" rx="2" stroke="white" stroke-width="2.2"/>
          <path d="M3 18L18 6l15 12" stroke="white" stroke-width="2.2" stroke-linejoin="round"/>
          <rect x="13" y="22" width="10" height="10" rx="1" fill="white" fill-opacity="0.9"/>
        </svg>
      </div>
      <h1 class="font-manrope font-bold text-[22px] text-el-primary">Apartment Management</h1>
      <p class="font-inter text-[13px] text-el-secondary mt-1">Hệ thống quản lý chung cư</p>
    </div>

    <!-- Card form -->
    <div class="bg-white rounded-2xl border border-el-border p-6 sm:p-8 shadow-sm animate-fadeIn">
      <h2 class="font-manrope font-bold text-[22px] text-el-primary mb-1">Đăng nhập</h2>
      <p class="font-inter text-[13px] text-el-secondary mb-7">Nhập thông tin tài khoản để tiếp tục</p>

      <form @submit.prevent="handleLogin" class="space-y-4" novalidate>
        <!-- Username -->
        <div>
          <label class="block font-inter text-[12px] font-medium text-el-neutral mb-1.5">
            Tên đăng nhập
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BB5C5]">
              <svg width="16" height="16" viewBox="0 0 17 17" fill="none">
                <circle cx="8.5" cy="6" r="3.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M1.5 15.5c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </span>
            <input
              v-model="form.username"
              type="text"
              autocomplete="username"
              placeholder="Nhập tên đăng nhập"
              class="w-full pl-9 pr-4 h-[42px] rounded-lg border-[1.5px] bg-el-surface font-inter text-[14px] text-el-primary placeholder:text-[#9BB5C5] focus:outline-none focus:ring-0 transition-colors"
              :class="errors.username
                ? 'border-red-400 bg-red-50 focus:border-red-400'
                : 'border-el-border focus:border-el-primary'"
              @input="errors.username = ''"
            />
          </div>
          <p v-if="errors.username" class="text-red-500 text-xs mt-1 ml-1">{{ errors.username }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block font-inter text-[12px] font-medium text-el-neutral mb-1.5">
            Mật khẩu
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BB5C5]">
              <svg width="15" height="16" viewBox="0 0 16 17" fill="none">
                <rect x="1" y="7" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M4 7V5a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="8" cy="11.5" r="1.2" fill="currentColor"/>
              </svg>
            </span>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Nhập mật khẩu"
              class="w-full pl-9 pr-11 h-[42px] rounded-lg border-[1.5px] bg-el-surface font-inter text-[14px] text-el-primary placeholder:text-[#9BB5C5] focus:outline-none focus:ring-0 transition-colors"
              :class="errors.password
                ? 'border-red-400 bg-red-50 focus:border-red-400'
                : 'border-el-border focus:border-el-primary'"
              @input="errors.password = ''"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#9BB5C5] hover:text-el-primary transition-colors"
              @click="showPassword = !showPassword"
            >
              <!-- Eye open -->
              <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <!-- Eye closed -->
              <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1l16 16M7.5 4.2A7.3 7.3 0 0 1 9 4c5 0 8 5 8 5a13.6 13.6 0 0 1-2.4 3M5.4 5.4A13.6 13.6 0 0 0 1 9s3 5 8 5a7.2 7.2 0 0 0 4.6-1.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-xs mt-1 ml-1">{{ errors.password }}</p>
        </div>

        <!-- Divider -->
        <div class="border-t border-el-border my-1" />

        <!-- API error banner -->
        <div
          v-if="apiError"
          class="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
        >
          <svg class="mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#EF4444" stroke-width="1.5"/>
            <path d="M8 5v3.5M8 11h.01" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p class="text-red-600 text-sm">{{ apiError }}</p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full h-[44px] rounded-lg font-manrope font-semibold text-white text-[14px] transition-all duration-150 bg-[#1A4D6D]"
          :class="loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#15405C] active:scale-[0.98]'"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="white" stroke-width="2" stroke-dasharray="20 18"/>
            </svg>
            Đang đăng nhập...
          </span>
          <span v-else>Đăng nhập</span>
        </button>
      </form>
    </div>

    <!-- Footer -->
    <p class="font-inter text-center text-el-secondary text-[12px] mt-6">
      © {{ new Date().getFullYear() }} Apartment Management. All rights reserved.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })
const apiError = ref('')
const loading = ref(false)
const showPassword = ref(false)

function validate(): boolean {
  errors.username = ''
  errors.password = ''
  let ok = true
  if (!form.username.trim()) {
    errors.username = 'Vui lòng nhập tên đăng nhập'
    ok = false
  }
  if (!form.password) {
    errors.password = 'Vui lòng nhập mật khẩu'
    ok = false
  }
  return ok
}

async function handleLogin() {
  apiError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await authStore.login({ username: form.username, password: form.password })
    router.push('/')
  } catch (err: unknown) {
    const e = err as { response?: { status?: number; data?: { message?: string } } }
    if (e.response?.status === 401 || e.response?.status === 403) {
      apiError.value = 'Tên đăng nhập hoặc mật khẩu không đúng'
    } else if (e.response?.data?.message) {
      apiError.value = e.response.data.message
    } else {
      apiError.value = 'Không thể kết nối đến máy chủ. Vui lòng thử lại.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
