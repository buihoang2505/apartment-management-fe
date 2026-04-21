<template>
  <div class="px-6 py-6 max-w-[800px] mx-auto">

    <!-- ── Tabs (border-bottom style) ── -->
    <div class="flex gap-6 border-b border-[#E5E9EE] mb-6">
      <RouterLink
        to="/profile"
        class="pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors"
        :class="$route.path === '/profile'
          ? 'border-[#A8845A] text-[#A8845A]'
          : 'border-transparent text-[#A9B8A8] hover:text-[#414A4D]'"
      >
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Thông tin cá nhân
        </span>
      </RouterLink>
      <RouterLink
        to="/profile/change-password"
        class="pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors"
        :class="$route.path === '/profile/change-password'
          ? 'border-[#A8845A] text-[#A8845A]'
          : 'border-transparent text-[#A9B8A8] hover:text-[#414A4D]'"
      >
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          Đổi mật khẩu
        </span>
      </RouterLink>
    </div>

    <!-- ── Card ── -->
    <div class="bg-white rounded-xl border border-[#E5E9EE] shadow-sm overflow-hidden">

      <!-- Card header -->
      <div class="px-6 py-5 border-b border-[#F0F5F9] flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#414A4D]/8 flex items-center justify-center flex-shrink-0" style="background-color: rgba(65,74,77,0.08)">
          <svg class="w-5 h-5 text-[#414A4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-[#0F2E4A]">Đổi mật khẩu</p>
          <p class="text-xs text-[#A9B8A8] mt-0.5">Mật khẩu mới phải có ít nhất 8 ký tự</p>
        </div>
      </div>

      <form @submit.prevent="submitChange" class="px-6 py-6 space-y-5">

        <!-- Mật khẩu hiện tại -->
        <div>
          <label class="block text-xs font-medium text-[#414A4D] mb-1.5">
            Mật khẩu hiện tại <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="form.currentPassword"
              :type="show.current ? 'text' : 'password'"
              placeholder="Nhập mật khẩu hiện tại"
              autocomplete="current-password"
              class="w-full px-4 py-3 pr-11 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/25"
              :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-400/20': errors.currentPassword }"
            />
            <button type="button" tabindex="-1"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A9B8A8] hover:text-[#414A4D] transition-colors p-0.5"
              @click="show.current = !show.current"
            >
              <svg v-if="!show.current" class="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
          <p v-if="errors.currentPassword" class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            {{ errors.currentPassword }}
          </p>
        </div>

        <!-- Mật khẩu mới -->
        <div>
          <label class="block text-xs font-medium text-[#414A4D] mb-1.5">
            Mật khẩu mới <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="form.newPassword"
              :type="show.newPwd ? 'text' : 'password'"
              placeholder="Tối thiểu 8 ký tự"
              autocomplete="new-password"
              class="w-full px-4 py-3 pr-11 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/25"
              :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-400/20': errors.newPassword }"
            />
            <button type="button" tabindex="-1"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A9B8A8] hover:text-[#414A4D] transition-colors p-0.5"
              @click="show.newPwd = !show.newPwd"
            >
              <svg v-if="!show.newPwd" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
          <!-- Strength indicator -->
          <div v-if="form.newPassword" class="mt-2 space-y-1">
            <div class="flex gap-1">
              <div
                v-for="i in 4" :key="i"
                class="h-1 flex-1 rounded-full transition-all duration-300"
                :class="strengthScore >= i ? strengthBarColor : 'bg-[#E5E9EE]'"
              />
            </div>
            <p class="text-[11px] font-medium" :class="strengthLabelColor">{{ strengthLabel }}</p>
          </div>
          <p v-if="errors.newPassword" class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            {{ errors.newPassword }}
          </p>
        </div>

        <!-- Xác nhận mật khẩu -->
        <div>
          <label class="block text-xs font-medium text-[#414A4D] mb-1.5">
            Xác nhận mật khẩu mới <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="form.confirmPassword"
              :type="show.confirm ? 'text' : 'password'"
              placeholder="Nhập lại mật khẩu mới"
              autocomplete="new-password"
              class="w-full px-4 py-3 pr-11 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/25"
              :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-400/20': errors.confirmPassword }"
            />
            <button type="button" tabindex="-1"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A9B8A8] hover:text-[#414A4D] transition-colors p-0.5"
              @click="show.confirm = !show.confirm"
            >
              <svg v-if="!show.confirm" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
          <!-- Match indicator -->
          <p v-if="form.confirmPassword && form.newPassword === form.confirmPassword"
            class="text-[11px] text-emerald-500 font-medium mt-1.5 flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Mật khẩu khớp
          </p>
          <p v-if="errors.confirmPassword" class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Submit error -->
        <div v-if="submitError" class="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <svg class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <p class="text-sm text-red-600">{{ submitError }}</p>
        </div>

        <div class="flex gap-3 pt-1">
          <RouterLink
            to="/profile"
            class="px-5 py-2.5 border border-[#DDE8EF] text-[#414A4D] text-sm font-medium rounded-xl hover:bg-[#F6F9FB] transition-colors"
          >Huỷ</RouterLink>
          <button
            type="submit"
            :disabled="saving"
            class="flex items-center gap-2 px-5 py-2.5 bg-[#414A4D] hover:bg-[#333a3d] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Đổi mật khẩu
          </button>
        </div>
      </form>
    </div>

  </div>

  <!-- Toast -->
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toast"
        class="fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl text-white text-sm shadow-xl flex items-center gap-2.5 max-w-xs"
        :class="toast.type === 'success' ? 'bg-[#0F2E4A]' : 'bg-red-500'"
      >
        <svg v-if="toast.type === 'success'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import authService from '@/services/authService'
import adminUserService from '@/services/adminUserService'

const router = useRouter()

const saving      = ref(false)
const submitError = ref('')

const form   = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const errors = ref<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({})
const show   = ref({ current: false, newPwd: false, confirm: false })

const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

const strengthScore = computed(() => {
  const p = form.value.newPassword
  if (!p) return 0
  let s = 0
  if (p.length >= 8)          s++
  if (/[A-Z]/.test(p))        s++
  if (/[0-9]/.test(p))        s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})

const strengthBarColor = computed(() => {
  const s = strengthScore.value
  if (s <= 1) return 'bg-red-400'
  if (s === 2) return 'bg-amber-400'
  if (s === 3) return 'bg-yellow-400'
  return 'bg-emerald-400'
})

const strengthLabelColor = computed(() => {
  const s = strengthScore.value
  if (s <= 1) return 'text-red-400'
  if (s === 2) return 'text-amber-500'
  if (s === 3) return 'text-yellow-500'
  return 'text-emerald-500'
})

const strengthLabel = computed(() => {
  const s = strengthScore.value
  if (s <= 1) return 'Yếu'
  if (s === 2) return 'Trung bình'
  if (s === 3) return 'Khá mạnh'
  return 'Mạnh'
})

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

function validate(): boolean {
  errors.value = {}
  if (!form.value.currentPassword)
    errors.value.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
  if (!form.value.newPassword) {
    errors.value.newPassword = 'Vui lòng nhập mật khẩu mới'
  } else if (form.value.newPassword.length < 8) {
    errors.value.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự'
  }
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu'
  } else if (form.value.newPassword !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
  }
  return Object.keys(errors.value).length === 0
}

async function submitChange() {
  if (!validate()) return
  submitError.value = ''
  saving.value = true
  try {
    const me = await authService.getMe()
    const id: string = (me.data as any)?.data?.id ?? (me.data as any)?.id
    if (!id) throw new Error('Không lấy được thông tin người dùng')
    await adminUserService.resetPassword(id, {
      currentPassword: form.value.currentPassword || undefined,
      newPassword: form.value.newPassword,
    })
    showToast('success', 'Đổi mật khẩu thành công')
    form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    setTimeout(() => router.push('/profile'), 1500)
  } catch (e: any) {
    submitError.value = e?.response?.data?.message ?? 'Đổi mật khẩu thất bại, vui lòng thử lại'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
