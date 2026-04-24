<template>
  <div class="px-6 py-6 max-w-[800px] mx-auto">

    <!-- ── Tabs ── -->
    <div class="flex gap-0 border-b border-[#E5E9EE] mb-6 overflow-x-auto">
      <button
        v-for="t in tabs"
        :key="t.key"
        @click="activeTab = t.key"
        class="flex items-center gap-1.5 pb-3 px-4 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap"
        :class="activeTab === t.key
          ? 'border-[#A8845A] text-[#A8845A]'
          : 'border-transparent text-[#A9B8A8] hover:text-[#414A4D]'"
      >
        <component :is="t.icon" class="w-4 h-4" />
        {{ t.label }}
      </button>
    </div>

    <!-- ── Loading ── -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <div class="w-8 h-8 border-4 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else-if="profile">

      <!-- ── Profile card ── -->
      <div class="bg-white rounded-xl border border-[#E5E9EE] shadow-sm">

        <!-- Banner wrapper — relative để avatar absolute bottom:-40px tính từ đây -->
        <div class="relative">

          <!-- Header gradient — overflow-hidden chỉ để clip dots, không ảnh hưởng avatar -->
          <div class="h-[100px] bg-gradient-to-r from-[#0F2E4A] to-[#1a3a5c] rounded-t-xl overflow-hidden relative">
            <div
              class="absolute inset-0 opacity-[0.07]"
              style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 22px 22px;"
            />
          </div>

          <!-- Avatar — bottom:-40px = nhô 40px xuống dưới header -->
          <div
            class="absolute group cursor-pointer z-10"
            style="bottom: -40px; left: 32px; width: 80px; height: 80px;"
            @click="triggerFilePicker"
          >
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
        </div>

        <!-- Name + badge row — padding-top: 48px để tên cùng hàng với avatar nhô xuống -->
        <div
          class="border-b border-[#F0F5F9] flex items-end pb-3 pr-6"
          style="padding-top: 48px; padding-left: 120px;"
        >
          <div class="min-w-0 flex-1">
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
              <span
                v-if="profile.headline"
                class="text-xs text-[#5A7A90] truncate"
              >— {{ profile.headline }}</span>
            </div>
          </div>
        </div>

        <!-- ── Info grid 2×2 ── -->
        <div class="px-6 pt-5 pb-5">
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

          <!-- ── TAB CONTENT ── -->

          <!-- Tab 1: Thông tin cơ bản -->
          <div v-if="activeTab === 'basic'">
            <div class="flex items-center gap-2 mb-5">
              <svg class="w-4 h-4 text-[#A8845A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              <p class="text-sm font-semibold text-[#414A4D]">Thông tin cơ bản</p>
            </div>

            <form @submit.prevent="submitUpdate" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-[#414A4D] mb-1.5">Họ và tên</label>
                  <input
                    v-model="form.fullName"
                    type="text"
                    placeholder="Nhập họ và tên"
                    class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/25"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-[#414A4D] mb-1.5">Email</label>
                  <p class="text-readonly">{{ form.email || 'Chưa cập nhật' }}</p>
                </div>
              </div>
              <FormActions :saving="saving" @cancel="resetForm" />
            </form>
          </div>

          <!-- Tab 2: Thông tin mở rộng -->
          <div v-if="activeTab === 'extended'">
            <div class="flex items-center gap-2 mb-5">
              <svg class="w-4 h-4 text-[#A8845A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <p class="text-sm font-semibold text-[#414A4D]">Thông tin mở rộng</p>
            </div>

            <form @submit.prevent="submitUpdate" class="space-y-5">
              <!-- Chức vụ / Headline -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="text-xs font-medium text-[#414A4D]">Chức vụ / Headline</label>
                  <span
                    class="text-[11px] font-mono tabular-nums transition-colors"
                    :class="form.headline.length >= 55 ? 'text-red-500 font-semibold' : 'text-[#A9B8A8]'"
                  >{{ form.headline.length }}/60</span>
                </div>
                <input
                  v-model="form.headline"
                  maxlength="60"
                  type="text"
                  placeholder="VD: Admin hệ thống, Quản lý vận hành..."
                  class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/25"
                />
              </div>

              <!-- Giới thiệu / Biography -->
              <div>
                <label class="block text-xs font-medium text-[#414A4D] mb-1.5">Giới thiệu / Biography</label>
                <!-- Toolbar Bold / Italic -->
                <div class="flex gap-1 mb-1.5">
                  <button
                    type="button"
                    @click="wrapText('**')"
                    class="px-2.5 py-1 text-xs font-bold border border-[#DDE8EF] rounded-lg bg-white hover:bg-[#F6F9FB] text-[#414A4D] transition-colors"
                    title="Bold"
                  >B</button>
                  <button
                    type="button"
                    @click="wrapText('_')"
                    class="px-2.5 py-1 text-xs italic border border-[#DDE8EF] rounded-lg bg-white hover:bg-[#F6F9FB] text-[#414A4D] transition-colors"
                    title="Italic"
                  >I</button>
                </div>
                <textarea
                  ref="bioRef"
                  v-model="form.biography"
                  rows="6"
                  placeholder="Giới thiệu ngắn về bản thân..."
                  class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition placeholder:text-[#414A4D]/25 resize-y min-h-[120px]"
                />
              </div>

              <!-- Ngôn ngữ -->
              <div>
                <label class="block text-xs font-medium text-[#414A4D] mb-1.5">Ngôn ngữ</label>
                <select
                  v-model="form.language"
                  class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm text-[#414A4D] outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition appearance-none cursor-pointer"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>

              <FormActions :saving="saving" @cancel="resetForm" />
            </form>
          </div>

          <!-- Tab 3: Mạng xã hội -->
          <div v-if="activeTab === 'social'">
            <div class="flex items-center gap-2 mb-5">
              <svg class="w-4 h-4 text-[#A8845A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              <p class="text-sm font-semibold text-[#414A4D]">Mạng xã hội</p>
            </div>

            <form @submit.prevent="submitUpdate" class="space-y-4">
              <div v-for="s in socialLinks" :key="s.key" class="space-y-1">
                <label class="block text-xs font-medium text-[#414A4D]">{{ s.label }}</label>
                <div class="flex items-center border border-[#DDE8EF] rounded-xl overflow-hidden bg-[#F6F9FB] focus-within:border-[#A8845A] focus-within:ring-2 focus-within:ring-[#A8845A]/20 transition">
                  <span
                    class="flex-shrink-0 px-3 py-3 text-sm text-[#A9B8A8] bg-[#EEF3F7] border-r border-[#DDE8EF] select-none whitespace-nowrap"
                    style="user-select: none;"
                  >{{ s.prefix }}</span>
                  <input
                    v-model="(form as any)[s.key]"
                    :placeholder="s.placeholder"
                    type="text"
                    class="flex-1 px-3 py-3 bg-transparent text-sm text-[#414A4D] outline-none placeholder:text-[#414A4D]/25"
                  />
                </div>
              </div>

              <FormActions :saving="saving" @cancel="resetForm" />
            </form>
          </div>

          <!-- Tab 4: Đổi mật khẩu — redirect sang route riêng -->
          <div v-if="activeTab === 'password'" class="text-center py-8">
            <p class="text-sm text-[#A9B8A8] mb-4">Chuyển sang trang đổi mật khẩu</p>
            <RouterLink
              to="/profile/change-password"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Đổi mật khẩu
            </RouterLink>
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
import { ref, reactive, computed, onMounted, defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'
import authService from '@/services/authService'
import adminUserService from '@/services/adminUserService'
import http from '@/services/http'
import { useAuthStore } from '@/stores/authStore'
import type { AdminUserResponse } from '@/types/adminUser'

// ── Inline component: FormActions (tái sử dụng trong mỗi tab) ──────
const FormActions = defineComponent({
  props: { saving: Boolean },
  emits: ['cancel'],
  setup(props, { emit }) {
    return () => h('div', { class: 'flex gap-3 pt-1' }, [
      h('button', {
        type: 'button',
        onClick: () => emit('cancel'),
        class: 'px-5 py-2.5 border border-[#DDE8EF] text-[#414A4D] text-sm font-medium rounded-xl hover:bg-[#F6F9FB] transition-colors',
      }, 'Huỷ'),
      h('button', {
        type: 'submit',
        disabled: props.saving,
        class: 'flex items-center gap-2 px-5 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors',
      }, [
        props.saving
          ? h('span', { class: 'w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' })
          : h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 13l4 4L19 7' }),
            ]),
        'Lưu thay đổi',
      ]),
    ])
  },
})

// ── Tab config ────────────────────────────────────────────────────
const tabs = [
  {
    key: 'basic',
    label: 'Thông tin cơ bản',
    icon: defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
        d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }),
    ])})
  },
  {
    key: 'extended',
    label: 'Thông tin mở rộng',
    icon: defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
        d: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z' }),
    ])})
  },
  {
    key: 'social',
    label: 'Mạng xã hội',
    icon: defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
        d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' }),
    ])})
  },
  {
    key: 'password',
    label: 'Đổi mật khẩu',
    icon: defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
        d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }),
    ])})
  },
]

const activeTab = ref('basic')

// ── Social links config ───────────────────────────────────────────
const socialLinks = [
  { key: 'website',   label: 'Website',   prefix: 'https://',         placeholder: 'yourwebsite.com' },
  { key: 'facebook',  label: 'Facebook',  prefix: 'facebook.com/',    placeholder: 'username' },
  { key: 'instagram', label: 'Instagram', prefix: 'instagram.com/',   placeholder: 'username' },
  { key: 'linkedin',  label: 'LinkedIn',  prefix: 'linkedin.com/in/', placeholder: 'your-profile' },
  { key: 'tiktok',    label: 'TikTok',    prefix: 'tiktok.com/',      placeholder: '@username' },
  { key: 'github',    label: 'GitHub',    prefix: 'github.com/',      placeholder: 'username' },
] as const

// ── State ─────────────────────────────────────────────────────────
const authStore       = useAuthStore()
const BASE_URL        = 'http://localhost:8080'

const profile         = ref<AdminUserResponse | null>(null)
const loading         = ref(true)
const loadError       = ref('')
const saving          = ref(false)
const avatarSrc       = ref<string | null>(null)
const uploadingAvatar = ref(false)
const fileInput       = ref<HTMLInputElement | null>(null)
const bioRef          = ref<HTMLTextAreaElement | null>(null)

const form = reactive({
  fullName:  '',
  email:     '',
  headline:  '',
  biography: '',
  language:  'vi',
  website:   '',
  facebook:  '',
  instagram: '',
  linkedin:  '',
  tiktok:    '',
  github:    '',
})

const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

// ── Helpers ───────────────────────────────────────────────────────
function normalizeUser(raw: any): AdminUserResponse {
  return {
    id:        raw.id        ?? '',
    username:  raw.username  ?? '',
    fullName:  raw.fullName  ?? raw.name ?? raw.username ?? undefined,
    email:     raw.email     ?? '',
    phone:     raw.phone     ?? undefined,
    role:      raw.role      ?? 'MANAGER',
    active:    raw.active    ?? true,
    avatarUrl: raw.avatarUrl ?? undefined,
    createdAt: raw.createdAt ?? '',
    headline:  raw.headline  ?? undefined,
    biography: raw.biography ?? undefined,
    language:  raw.language  ?? undefined,
    website:   raw.website   ?? undefined,
    facebook:  raw.facebook  ?? undefined,
    instagram: raw.instagram ?? undefined,
    linkedin:  raw.linkedin  ?? undefined,
    tiktok:    raw.tiktok    ?? undefined,
    github:    raw.github    ?? undefined,
  }
}

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

function resetForm() {
  if (!profile.value) return
  Object.assign(form, {
    fullName:  profile.value.fullName  ?? profile.value.username ?? '',
    email:     profile.value.email     ?? '',
    headline:  profile.value.headline  ?? '',
    biography: profile.value.biography ?? '',
    language:  profile.value.language  ?? 'vi',
    website:   profile.value.website   ?? '',
    facebook:  profile.value.facebook  ?? '',
    instagram: profile.value.instagram ?? '',
    linkedin:  profile.value.linkedin  ?? '',
    tiktok:    profile.value.tiktok    ?? '',
    github:    profile.value.github    ?? '',
  })
}

/** Wrap selected text in textarea with markdown syntax (bold/italic) */
function wrapText(syntax: string) {
  const el = bioRef.value
  if (!el) return
  const s = el.selectionStart
  const e = el.selectionEnd
  form.biography =
    form.biography.slice(0, s) + syntax +
    form.biography.slice(s, e) + syntax +
    form.biography.slice(e)
  // Restore cursor after wrapping
  setTimeout(() => {
    el.selectionStart = s + syntax.length
    el.selectionEnd   = e + syntax.length
    el.focus()
  })
}

// ── Fetch profile ─────────────────────────────────────────────────
async function fetchProfile() {
  loading.value   = true
  loadError.value = ''
  try {
    const res = await authService.getMe()
    const raw: any = (res.data as any)?.data ?? res.data
    console.log('[ProfileView] /admin/users/me response:', raw)
    const user = normalizeUser(raw)
    profile.value = user
    resetForm()
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
  if (!profile.value?.id) return
  saving.value = true
  try {
    const payload: Record<string, unknown> = {
      fullName:  form.fullName.trim()  || null,
      headline:  form.headline.trim()  || null,
      biography: form.biography.trim() || null,
      language:  form.language         || null,
      website:   form.website.trim()   || null,
      facebook:  form.facebook.trim()  || null,
      instagram: form.instagram.trim() || null,
      linkedin:  form.linkedin.trim()  || null,
      tiktok:    form.tiktok.trim()    || null,
      github:    form.github.trim()    || null,
    }
    const res = await http.put('/users/me/profile', payload)
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

  const previewUrl = URL.createObjectURL(file)
  avatarSrc.value = previewUrl
  uploadingAvatar.value = true

  try {
    const res = await adminUserService.uploadAvatar(profile.value!.id, file)
    const raw: any = (res.data as any)?.data ?? res.data

    const serverRelativeUrl: string | undefined = raw?.avatarUrl
    if (serverRelativeUrl) {
      const newUrl = buildAvatarUrl(serverRelativeUrl)!
      avatarSrc.value = newUrl
      if (profile.value) {
        profile.value = { ...profile.value, avatarUrl: serverRelativeUrl }
      }
      authStore.updateUser({ avatarUrl: serverRelativeUrl })
    } else {
      await fetchProfile()
    }
    showToast('success', 'Đã cập nhật ảnh đại diện')
  } catch (err) {
    console.error('[ProfileView] uploadAvatar failed:', err)
    showToast('error', 'Tải ảnh lên thất bại')
    avatarSrc.value = buildAvatarUrl(profile.value?.avatarUrl)
  } finally {
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

.text-readonly {
  color: #6b7280;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
}
</style>
