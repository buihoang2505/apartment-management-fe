<template>
  <div class="px-6 py-6 max-w-[800px] mx-auto">

    <!-- ── Tabs ── -->
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

    <!-- ── Loading ── -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <div class="w-8 h-8 border-4 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else-if="profile">

      <!-- ── Profile card ──
           NOTE: NO overflow-hidden on the card itself — it would clip the avatar overlap.
           Each section handles its own rounded corners separately.
      -->
      <div class="bg-white rounded-xl border border-[#E5E9EE] shadow-sm">

        <!-- Header gradient (overflow-hidden only here for dots clipping) -->
        <div class="h-[100px] bg-gradient-to-r from-[#0F2E4A] to-[#1a3a5c] rounded-t-xl overflow-hidden relative">
          <div
            class="absolute inset-0 opacity-[0.07]"
            style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 22px 22px;"
          />
        </div>

        <!-- Avatar + name row
             -mt-10 pulls this row 40px UP into the gradient header.
             Avatar (80px) → top half sits in header, bottom half hangs below.
             items-end → name aligns to bottom of avatar.
        -->
        <div class="px-6 -mt-10 flex items-end gap-4 pb-4 border-b border-[#F0F5F9]">

          <!-- Avatar with upload overlay -->
          <div
            class="relative w-20 h-20 flex-shrink-0 group cursor-pointer z-10"
            @click="triggerFilePicker"
          >
            <!-- Avatar circle -->
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold select-none shadow-lg overflow-hidden"
              style="border: 3px solid white; background-color: #A8845A;"
            >
              <img
                v-if="avatarSrc"
                :src="avatarSrc"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ avatarInitial }}</span>
            </div>

            <!-- Hover overlay: camera icon -->
            <div
              v-if="!uploadingAvatar"
              class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style="border: 3px solid transparent;"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>

            <!-- Upload spinner -->
            <div
              v-if="uploadingAvatar"
              class="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center"
            >
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>

            <!-- Hidden file input -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
          </div>

          <!-- Name + badge (aligns to bottom of 80px avatar via items-end on parent) -->
          <div class="pb-1.5 min-w-0 flex-1">
            <p class="text-[#0F2E4A] font-bold text-xl leading-snug truncate">
              {{ profile.fullName || profile.username }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span
                class="inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide"
                :class="roleBadgeClass"
              >{{ profile.role }}</span>
              <span
                v-if="!profile.active"
                class="inline-flex text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-500"
              >Vô hiệu</span>
            </div>
          </div>
        </div>

        <!-- ── Info grid 2×2 ── -->
        <div class="px-6 py-5">
          <div class="grid grid-cols-2 rounded-xl border border-[#F0F5F9] overflow-hidden mb-6">

            <div class="px-4 py-3.5 border-b border-r border-[#F0F5F9] bg-[#FAFBFC]">
              <p class="text-[10px] font-semibold text-[#A9B8A8] uppercase tracking-widest mb-1">Username</p>
              <p class="text-[#414A4D] text-sm font-semibold font-mono">{{ profile.username }}</p>
            </div>

            <div class="px-4 py-3.5 border-b border-[#F0F5F9] bg-[#FAFBFC]">
              <p class="text-[10px] font-semibold text-[#A9B8A8] uppercase tracking-widest mb-1">Email</p>
              <p
                class="text-sm font-medium"
                :class="profile.email ? 'text-[#414A4D]' : 'text-[#A9B8A8] italic text-xs'"
              >{{ profile.email || 'Chưa cập nhật' }}</p>
            </div>

            <div class="px-4 py-3.5 border-r border-[#F0F5F9]">
              <p class="text-[10px] font-semibold text-[#A9B8A8] uppercase tracking-widest mb-1">Vai trò</p>
              <p class="text-[#414A4D] text-sm font-medium">{{ profile.role }}</p>
            </div>

            <div class="px-4 py-3.5">
              <p class="text-[10px] font-semibold text-[#A9B8A8] uppercase tracking-widest mb-1">Ngày tạo</p>
              <p class="text-[#414A4D] text-sm font-medium">{{ formatDate(profile.createdAt) }}</p>
            </div>
          </div>

          <!-- ── Edit form ── -->
          <div class="border-t border-[#F0F5F9] pt-5">
            <div class="flex items-center gap-2 mb-5">
              <svg class="w-4 h-4 text-[#A8845A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              <p class="text-sm font-semibold text-[#414A4D]">Chỉnh sửa thông tin</p>
            </div>

            <form @submit.prevent="submitUpdate" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <!-- Họ và tên -->
                <div>
                  <label class="block text-xs font-medium text-[#414A4D] mb-1.5">Họ và tên</label>
                  <input
                    v-model="form.fullName"
                    type="text"
                    placeholder="Nhập họ và tên"
                    class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/25"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-xs font-medium text-[#414A4D] mb-1.5">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/25"
                    :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-400/20': formError }"
                  />
                  <p v-if="formError" class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    {{ formError }}
                  </p>
                </div>
              </div>

              <div class="flex gap-3 pt-1">
                <button
                  type="button"
                  @click="resetForm"
                  class="px-5 py-2.5 border border-[#DDE8EF] text-[#414A4D] text-sm font-medium rounded-xl hover:bg-[#F6F9FB] transition-colors"
                >Huỷ</button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex items-center gap-2 px-5 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Rounded bottom corners -->
        <div class="h-0 rounded-b-xl" />
      </div>

    </template>

    <!-- Error state -->
    <div v-else-if="loadError" class="bg-white rounded-xl border border-[#E5E9EE] p-12 text-center">
      <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
      </div>
      <p class="text-[#414A4D] text-sm font-medium mb-1">Không thể tải thông tin</p>
      <p class="text-[#A9B8A8] text-xs mb-4">{{ loadError }}</p>
      <button @click="fetchProfile" class="text-sm text-[#A8845A] font-medium hover:underline">Thử lại</button>
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
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import authService from '@/services/authService'
import adminUserService from '@/services/adminUserService'
import { useAuthStore } from '@/stores/authStore'
import type { AdminUserResponse } from '@/types/adminUser'

const authStore = useAuthStore()
const BASE_URL = 'http://localhost:8080'

const profile         = ref<AdminUserResponse | null>(null)
const loading         = ref(true)
const loadError       = ref('')
const saving          = ref(false)
const formError       = ref('')
const avatarSrc       = ref<string | null>(null)
const uploadingAvatar = ref(false)
const fileInput       = ref<HTMLInputElement | null>(null)

const form = ref({ fullName: '', email: '' })

const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

// ── Helpers ──────────────────────────────────────────────────────
/** Normalize any raw API user object → AdminUserResponse shape */
function normalizeUser(raw: any): AdminUserResponse {
  return {
    id:        raw.id        ?? '',
    username:  raw.username  ?? '',
    // backend may return either "fullName" or "name"
    fullName:  raw.fullName  ?? raw.name ?? undefined,
    email:     raw.email     ?? '',
    phone:     raw.phone     ?? undefined,
    role:      raw.role      ?? 'MANAGER',
    active:    raw.active    ?? true,
    avatarUrl: raw.avatarUrl ?? undefined,
    createdAt: raw.createdAt ?? '',
  }
}

/** Build a displayable avatar URL — avoids double-prefixing */
function buildAvatarUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('blob:')) return url
  return BASE_URL + url
}

const avatarInitial = computed(() =>
  (profile.value?.fullName || profile.value?.username || 'U').charAt(0).toUpperCase()
)

const roleBadgeClass = computed(() =>
  profile.value?.role === 'ADMIN'
    ? 'bg-[#0F2E4A] text-white'
    : 'bg-[#F0F5F9] text-[#5A7A90]'
)

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Sync form inputs from current profile */
function resetForm() {
  if (!profile.value) return
  form.value = {
    fullName: profile.value.fullName ?? '',
    email:    profile.value.email    ?? '',
  }
  formError.value = ''
}

// ── Fetch profile ─────────────────────────────────────────────────
async function fetchProfile() {
  loading.value   = true
  loadError.value = ''
  try {
    const res = await authService.getMe()
    // Support both { data: { data: user } } and { data: user } response shapes
    const raw: any = (res.data as any)?.data ?? res.data
    const user = normalizeUser(raw)
    profile.value   = user
    // 1. Pre-fill form ← profile data
    resetForm()
    // 3. Display actual avatarUrl
    avatarSrc.value = buildAvatarUrl(user.avatarUrl)
  } catch (err) {
    console.error('[ProfileView] fetchProfile failed:', err)
    loadError.value = 'Không thể kết nối đến máy chủ'
  } finally {
    loading.value = false
  }
}

// ── Update profile ────────────────────────────────────────────────
async function submitUpdate() {
  formError.value = ''
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    formError.value = 'Email không hợp lệ'
    return
  }
  if (!profile.value?.id) return
  saving.value = true
  try {
    const payload: Record<string, unknown> = {
      fullName: form.value.fullName.trim() || null,
      email:    form.value.email.trim()    || null,
    }
    const res = await adminUserService.update(profile.value.id, payload)
    const raw: any = (res.data as any)?.data ?? res.data
    if (raw?.id) {
      profile.value = normalizeUser(raw)
      resetForm()
    }
    showToast('success', 'Đã cập nhật thông tin thành công')
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Cập nhật thất bại')
  } finally {
    saving.value = false
  }
}

// ── Avatar upload ─────────────────────────────────────────────────
function triggerFilePicker() {
  fileInput.value?.click()
}

async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file  = input.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    showToast('error', 'File quá lớn. Tối đa 2MB.')
    input.value = ''
    return
  }

  // 2a. Instant local preview (blob URL)
  const previewUrl = URL.createObjectURL(file)
  avatarSrc.value = previewUrl
  uploadingAvatar.value = true

  try {
    // 2b. Upload — Content-Type set automatically by axios (with boundary)
    const res = await adminUserService.uploadAvatar(profile.value!.id, file)
    const raw: any = (res.data as any)?.data ?? res.data

    // 2c. Reload avatar from server URL after success
    const serverRelativeUrl: string | undefined = raw?.avatarUrl
    if (serverRelativeUrl) {
      const newUrl = buildAvatarUrl(serverRelativeUrl)!
      avatarSrc.value = newUrl
      // Update profile object so avatarInitial fallback stays correct
      if (profile.value) {
        profile.value = { ...profile.value, avatarUrl: serverRelativeUrl }
      }
      authStore.updateUser({ avatarUrl: serverRelativeUrl })
    } else {
      // Server didn't return avatarUrl — re-fetch profile to get updated state
      await fetchProfile()
    }
    showToast('success', 'Đã cập nhật ảnh đại diện')
  } catch (err) {
    console.error('[ProfileView] uploadAvatar failed:', err)
    showToast('error', 'Tải ảnh lên thất bại')
    // Revert preview to previous avatar
    avatarSrc.value = buildAvatarUrl(profile.value?.avatarUrl)
  } finally {
    // Revoke blob URL to avoid memory leak
    URL.revokeObjectURL(previewUrl)
    uploadingAvatar.value = false
    input.value = ''
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
