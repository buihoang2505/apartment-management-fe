<template>
  <div class="px-4 py-6 sm:px-6">
    <div class="mx-auto max-w-6xl">
      <div v-if="loading" class="flex items-center justify-center py-24">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#A8845A] border-t-transparent" />
      </div>

      <div v-else-if="profile" class="grid grid-cols-1 gap-6 lg:grid-cols-[320px,1fr]">
        <aside class="overflow-hidden rounded-2xl border border-[#E5E9EE] bg-white shadow-sm">
          <div class="h-24 bg-gradient-to-r from-[#0F2E4A] to-[#1B3F63]" />
          <div class="-mt-12 px-4 sm:px-6 pb-5 sm:pb-6">
            <div class="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-white shadow-lg" @click="triggerFilePicker">
              <img v-if="avatarSrc" :src="avatarSrc" alt="Avatar" class="h-full w-full object-cover" />
              <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#A8845A] to-[#D6B47E] text-3xl font-bold text-white">
                {{ avatarInitial }}
              </div>
              <div class="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div v-if="uploadingAvatar" class="absolute inset-0 flex items-center justify-center bg-black/60">
                <div class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />

            <h2 class="mt-4 truncate text-xl font-bold text-[#0F2E4A]">{{ displayValue(profile.fullName || profile.username) }}</h2>
            <div class="mt-2 flex items-center gap-2">
              <span class="rounded-full px-3 py-1 text-[11px] font-semibold" :class="roleBadgeClass">{{ profile.role }}</span>
              <span class="text-xs text-[#8A98A6]">Tham gia {{ formatDate(profile.createdAt) }}</span>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-3">
              <div class="rounded-xl border border-[#E9EDF2] bg-[#FAFBFD] p-3">
                <p class="text-[11px] text-[#97A4AE]">Username</p>
                <p class="truncate text-sm font-semibold text-[#2E3740]">{{ profile.username }}</p>
              </div>
              <div class="rounded-xl border border-[#E9EDF2] bg-[#FAFBFD] p-3">
                <p class="text-[11px] text-[#97A4AE]">Liên hệ</p>
                <p class="truncate text-sm font-semibold text-[#2E3740]">{{ profile.phone || '—' }}</p>
              </div>
            </div>
          </div>
        </aside>

        <section class="overflow-hidden rounded-2xl border border-[#E5E9EE] bg-white shadow-sm">
          <div class="border-b border-[#EEF2F5] px-3 pt-3 sm:px-5">
            <div class="flex gap-1 overflow-x-auto pb-3">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                class="rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200"
                :class="activeTab === tab.key ? 'bg-[#0F2E4A] text-white shadow-sm' : 'text-[#637381] hover:bg-[#F4F7FA]'"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div class="p-4 sm:p-6">
            <div v-if="activeTab === 'basic'" class="space-y-4">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="md:col-span-2">
                  <p class="label">Username</p>
                  <div class="field-readonly">
                    <span class="icon-wrap text-[#5C87AF]">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    <span class="font-medium text-[#37424C]">{{ displayValue(profile.username) }}</span>
                  </div>
                </div>

                <div class="card-field" @click="startBasicEdit('fullName')">
                  <p class="label">Họ và tên</p>
                  <template v-if="basicEditingField === 'fullName'">
                    <div class="field-edit">
                      <span class="icon-wrap text-[#5C87AF]">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </span>
                      <input v-model="basicEditDraft" type="text" placeholder="Nhập họ và tên" class="w-full bg-transparent text-sm outline-none" />
                    </div>
                    <div class="mt-3 flex gap-2">
                      <button class="btn-save" :disabled="savingBasic" @click.stop="saveBasicField('fullName')">Lưu</button>
                      <button class="btn-cancel" @click.stop="cancelBasicEdit">Huỷ</button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="field-readonly">
                      <span class="icon-wrap text-[#5C87AF]">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </span>
                      <span :class="emptyClass(profile.fullName)">{{ displayValue(profile.fullName) }}</span>
                    </div>
                  </template>
                </div>

                <div class="card-field">
                  <p class="label">Email</p>
                  <div class="field-readonly">
                    <span class="icon-wrap text-[#C58C3E]">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                    </span>
                    <span :class="emptyClass(profile.email)">{{ displayValue(profile.email) }}</span>
                  </div>
                </div>

                <div class="card-field" @click="startBasicEdit('phone')">
                  <p class="label">Số điện thoại</p>
                  <template v-if="basicEditingField === 'phone'">
                    <div class="field-edit">
                      <span class="icon-wrap text-[#5E9D76]">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.37l1 3a2 2 0 01-.45 2.08l-1.48 1.48a16 16 0 006.36 6.36l1.48-1.48a2 2 0 012.08-.45l3 1A2 2 0 0121 15.72V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z" /></svg>
                      </span>
                      <input v-model="basicEditDraft" type="text" placeholder="Nhập số điện thoại" class="w-full bg-transparent text-sm outline-none" />
                    </div>
                    <div class="mt-3 flex gap-2">
                      <button class="btn-save" :disabled="savingBasic" @click.stop="saveBasicField('phone')">Lưu</button>
                      <button class="btn-cancel" @click.stop="cancelBasicEdit">Huỷ</button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="field-readonly">
                      <span class="icon-wrap text-[#5E9D76]">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.37l1 3a2 2 0 01-.45 2.08l-1.48 1.48a16 16 0 006.36 6.36l1.48-1.48a2 2 0 012.08-.45l3 1A2 2 0 0121 15.72V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z" /></svg>
                      </span>
                      <span :class="emptyClass(profile.phone)">{{ displayValue(profile.phone) }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'extended'" class="space-y-4">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div v-for="field in extendedFields" :key="field.key" class="card-field" @click="startExtendedEdit(field.key)">
                  <p class="label">{{ field.label }}</p>
                  <template v-if="extendedEditingField === field.key">
                    <div class="field-edit min-h-[42px]">
                      <span class="icon-wrap" :class="field.colorClass">
                        <component :is="field.icon" class="h-4 w-4" />
                      </span>
                      <input v-if="field.type === 'text' || field.type === 'date'" v-model="extendedDraft" :type="field.type" class="w-full bg-transparent text-sm outline-none" />
                      <select v-else-if="field.type === 'select'" v-model="extendedDraft" class="w-full bg-transparent text-sm outline-none">
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                      <textarea
                        v-else
                        v-model="extendedDraft"
                        rows="3"
                        class="w-full resize-y bg-transparent text-sm outline-none"
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                    <div class="mt-3 flex gap-2">
                      <button class="btn-save" :disabled="savingExtended" @click.stop="saveExtendedField(field.key)">Lưu</button>
                      <button class="btn-cancel" @click.stop="cancelExtendedEdit">Huỷ</button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="field-readonly">
                      <span class="icon-wrap" :class="field.colorClass">
                        <component :is="field.icon" class="h-4 w-4" />
                      </span>
                      <span :class="emptyClass(extendedForm[field.key])">{{ displayValue(normalizeExtendedDisplay(field.key, extendedForm[field.key])) }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'social'" class="space-y-4">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div v-for="item in socialItems" :key="item.key" class="card-field">
                  <p class="label">{{ item.label }}</p>
                  <div class="field-edit min-h-[42px]">
                    <span class="icon-wrap" :class="item.iconClass">
                      <component :is="item.icon" class="h-4 w-4" />
                    </span>
                    <input
                      v-model="socialForm[item.key]"
                      type="text"
                      :placeholder="item.placeholder"
                      class="w-full bg-transparent text-sm outline-none"
                    />
                  </div>

                  <div class="mt-2 min-h-[28px]">
                    <template v-if="socialForm[item.key]?.trim()">
                      <a :href="buildSocialLink(item.key, socialForm[item.key])" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-medium text-[#0F2E4A] hover:underline">
                        Xem liên kết
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3h7m0 0v7m0-7L10 14" /></svg>
                      </a>
                    </template>
                    <template v-else>
                      <button class="inline-flex items-center gap-1 text-xs italic text-[#9AA7B2]" @click="focusSocialInput(item.key)">
                        Chưa liên kết
                        <span class="font-semibold text-[#A8845A]">+</span>
                      </button>
                    </template>
                  </div>
                </div>
              </div>

              <div class="flex gap-2 pt-1">
                <button class="btn-save" :disabled="savingSocial" @click="saveSocialLinks">Lưu thay đổi</button>
                <button class="btn-cancel" @click="resetSocial">Huỷ</button>
              </div>
            </div>

            <form v-else class="space-y-4" @submit.prevent="submitPassword">
              <div class="overflow-hidden rounded-2xl border border-[#E5E9EE]">
                <div class="bg-gradient-to-r from-[#0F2E4A] to-[#1B3F63] px-5 py-4">
                  <div class="flex items-center gap-3 text-white">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-semibold">Bảo mật tài khoản</p>
                      <p class="text-xs text-white/80">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-[220px,1fr]">
                  <div class="border-b border-[#EEF2F5] bg-[#F8FAFC] p-4 lg:border-b-0 lg:border-r">
                    <div class="rounded-xl border border-[#E8EDF2] bg-white p-3">
                      <div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F2E4A]/10 text-[#0F2E4A]">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c-1.1 0-2 .9-2 2v3h4v-3c0-1.1-.9-2-2-2zm7-2h-1V7a6 6 0 10-12 0v2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-8a2 2 0 00-2-2z" />
                        </svg>
                      </div>
                      <p class="text-center text-xs text-[#617282]">Mật khẩu mạnh giúp giảm rủi ro truy cập trái phép.</p>
                    </div>
                  </div>

                  <div class="p-5">
                    <div :class="['space-y-4', { 'shake-error': errorShake }]">
                      <div>
                        <label class="mb-1 block text-xs font-medium text-[#526272]">Mật khẩu hiện tại</label>
                        <div class="password-wrap">
                          <span class="text-[#A8845A]">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </span>
                          <input v-model="passwordForm.currentPassword" :type="showPwd.current ? 'text' : 'password'" class="password-input" autocomplete="current-password" />
                          <button type="button" class="pwd-toggle" @click="showPwd.current = !showPwd.current">
                            <svg v-if="!showPwd.current" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" /></svg>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label class="mb-1 block text-xs font-medium text-[#526272]">Mật khẩu mới</label>
                        <div class="password-wrap">
                          <span class="text-[#A8845A]">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0v4m-9 0h10a1 1 0 011 1v8a1 1 0 01-1 1H7a1 1 0 01-1-1v-8a1 1 0 011-1z" />
                            </svg>
                          </span>
                          <input v-model="passwordForm.newPassword" :type="showPwd.newPassword ? 'text' : 'password'" class="password-input" autocomplete="new-password" />
                          <button type="button" class="pwd-toggle" @click="showPwd.newPassword = !showPwd.newPassword">
                            <svg v-if="!showPwd.newPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" /></svg>
                          </button>
                        </div>
                        <div class="mt-2">
                          <div class="h-2 w-full overflow-hidden rounded-full bg-[#E7EDF4]">
                            <div class="h-full rounded-full transition-all duration-300" :class="strengthColor" :style="{ width: `${passwordStrengthPercent}%` }" />
                          </div>
                          <p class="mt-1 text-[11px] font-medium" :class="strengthTextColor">{{ strengthLabel }}</p>
                          <p v-if="passwordMissingHints.length" class="mt-1 text-[11px] text-[#8A98A6]">
                            Thiếu: {{ passwordMissingHints.join(', ') }}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label class="mb-1 block text-xs font-medium text-[#526272]">Xác nhận mật khẩu mới</label>
                        <div class="password-wrap">
                          <span class="text-[#A8845A]">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <input v-model="passwordForm.confirmPassword" :type="showPwd.confirmPassword ? 'text' : 'password'" class="password-input" autocomplete="new-password" />
                          <button type="button" class="pwd-toggle" @click="showPwd.confirmPassword = !showPwd.confirmPassword">
                            <svg v-if="!showPwd.confirmPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" /></svg>
                          </button>
                        </div>
                        <div v-if="passwordForm.confirmPassword" class="mt-1 flex items-center gap-1.5 text-xs">
                          <span v-if="passwordsMatch" class="inline-flex items-center gap-1 text-emerald-600">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                            Mật khẩu khớp
                          </span>
                          <span v-else class="inline-flex items-center gap-1 text-red-500">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            Mật khẩu không khớp
                          </span>
                        </div>
                      </div>
                    </div>

                    <div v-if="passwordError" class="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{{ passwordError }}</div>

                    <div class="mt-4 flex gap-2">
                      <button class="btn-save" :disabled="savingPassword || !canSubmitPassword" type="submit">Đổi mật khẩu</button>
                      <button class="btn-cancel" type="button" @click="resetPasswordForm">Huỷ</button>
                      <div v-if="passwordSuccess" class="success-ping inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        Thành công
                      </div>
                    </div>

                    <div class="mt-4 rounded-xl border border-[#E8EDF2] bg-[#F8FAFC] p-3">
                      <p class="text-xs font-semibold text-[#526272]">Mẹo bảo mật</p>
                      <ul class="mt-2 space-y-1 text-xs text-[#617282]">
                        <li>Không dùng mật khẩu giống tài khoản khác</li>
                        <li>Tối thiểu 8 ký tự, có chữ hoa và số</li>
                        <li>Đổi mật khẩu định kỳ 3-6 tháng</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>

      <div v-else class="rounded-2xl border border-[#E5E9EE] bg-white p-8 text-center text-sm text-[#6B7B88]">Không thể tải thông tin hồ sơ.</div>

      <Teleport to="body">
        <Transition name="toast">
          <div v-if="toast" class="fixed bottom-6 right-6 z-50 max-w-xs rounded-xl px-4 py-3 text-sm text-white shadow-xl" :class="toast.type === 'success' ? 'bg-[#0F2E4A]' : 'bg-red-500'">
            {{ toast.message }}
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue'
import authService from '@/services/authService'
import adminUserService from '@/services/adminUserService'
import http from '@/services/http'
import { useAuthStore } from '@/stores/authStore'
import type { AdminUserResponse } from '@/types/adminUser'

type TabKey = 'basic' | 'extended' | 'social' | 'password'
type BasicField = 'fullName' | 'phone'
type ExtendedKey = 'birthDate' | 'gender' | 'address' | 'city' | 'province' | 'country' | 'idNumber' | 'occupation'
type SocialKey = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'zalo'

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'basic', label: 'Thông tin cơ bản' },
  { key: 'extended', label: 'Thông tin mở rộng' },
  { key: 'social', label: 'Mạng xã hội' },
  { key: 'password', label: 'Đổi mật khẩu' },
]

const UserIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z' })]) })
const CalendarIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z' })]) })
const LocationIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })]) })
const IdIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 7h16M4 12h10m-10 5h7m-7 0a2 2 0 01-2-2V7a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2H4z' })]) })
const BriefcaseIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 13V7a2 2 0 00-2-2h-3V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1H6a2 2 0 00-2 2v6m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4' })]) })
const GlobeIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18' })]) })
const MaleFemaleIcon = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 14a4 4 0 100-8 4 4 0 000 8zm0 0v7m-3-3h6m4-14h4m0 0v4m0-4l-5 5' })]) })

const FacebookIcon = defineComponent({ render: () => h('span', { class: 'text-xs font-bold' }, 'f') })
const InstagramIcon = defineComponent({ render: () => h('span', { class: 'text-xs font-bold' }, 'ig') })
const TwitterIcon = defineComponent({ render: () => h('span', { class: 'text-xs font-bold' }, 'x') })
const LinkedInIcon = defineComponent({ render: () => h('span', { class: 'text-xs font-bold' }, 'in') })
const ZaloIcon = defineComponent({ render: () => h('span', { class: 'text-[10px] font-bold' }, 'ZL') })

const extendedFields: Array<{ key: ExtendedKey; label: string; type: 'text' | 'date' | 'select' | 'textarea'; icon: any; colorClass: string }> = [
  { key: 'birthDate', label: 'Ngày sinh', type: 'date', icon: CalendarIcon, colorClass: 'text-[#C58C3E]' },
  { key: 'gender', label: 'Giới tính', type: 'select', icon: MaleFemaleIcon, colorClass: 'text-[#5C87AF]' },
  { key: 'address', label: 'Địa chỉ', type: 'textarea', icon: LocationIcon, colorClass: 'text-[#5E9D76]' },
  { key: 'city', label: 'Thành phố', type: 'text', icon: LocationIcon, colorClass: 'text-[#5E9D76]' },
  { key: 'province', label: 'Tỉnh/Tỉnh thành', type: 'text', icon: LocationIcon, colorClass: 'text-[#5E9D76]' },
  { key: 'country', label: 'Quốc gia', type: 'text', icon: GlobeIcon, colorClass: 'text-[#A8845A]' },
  { key: 'idNumber', label: 'CCCD/CMND', type: 'text', icon: IdIcon, colorClass: 'text-[#7E6BC4]' },
  { key: 'occupation', label: 'Nghề nghiệp', type: 'text', icon: BriefcaseIcon, colorClass: 'text-[#CC7A57]' },
]

const socialItems: Array<{ key: SocialKey; label: string; placeholder: string; icon: any; iconClass: string }> = [
  { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/username', icon: FacebookIcon, iconClass: 'bg-[#1877F2] text-white' },
  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/username', icon: InstagramIcon, iconClass: 'bg-[#E1306C] text-white' },
  { key: 'twitter', label: 'Twitter/X URL', placeholder: 'https://x.com/username', icon: TwitterIcon, iconClass: 'bg-[#111827] text-white' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username', icon: LinkedInIcon, iconClass: 'bg-[#0A66C2] text-white' },
  { key: 'zalo', label: 'Zalo', placeholder: 'Số điện thoại Zalo', icon: ZaloIcon, iconClass: 'bg-[#0084FF] text-white' },
]

const authStore = useAuthStore()
const BASE_URL = 'http://localhost:8080'
const EXTENDED_STORAGE_KEY = 'profile_extended_fields'
const SOCIAL_STORAGE_KEY = 'profile_social_links'

const loading = ref(true)
const profile = ref<AdminUserResponse | null>(null)
const activeTab = ref<TabKey>('basic')
const avatarSrc = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadingAvatar = ref(false)

const basicEditingField = ref<BasicField | null>(null)
const basicEditDraft = ref('')
const savingBasic = ref(false)

const extendedForm = reactive<Record<ExtendedKey, string>>({
  birthDate: '',
  gender: '',
  address: '',
  city: '',
  province: '',
  country: 'Việt Nam',
  idNumber: '',
  occupation: '',
})
const extendedEditingField = ref<ExtendedKey | null>(null)
const extendedDraft = ref('')
const savingExtended = ref(false)

const socialForm = reactive<Record<SocialKey, string>>({
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  zalo: '',
})
const savingSocial = ref(false)

const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const showPwd = ref({ current: false, newPassword: false, confirmPassword: false })
const savingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)
const errorShake = ref(false)

const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

const avatarInitial = computed(() => (profile.value?.fullName || profile.value?.username || 'U').charAt(0).toUpperCase())
const roleBadgeClass = computed(() => profile.value?.role === 'ADMIN' ? 'bg-[#0F2E4A] text-white' : 'bg-[#F7EFE3] text-[#8E6C3E]')

const passwordStrength = computed(() => {
  const pwd = passwordForm.value.newPassword
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
})
const strengthColor = computed(() => passwordStrength.value <= 1 ? 'bg-red-400' : passwordStrength.value === 2 ? 'bg-amber-400' : passwordStrength.value === 3 ? 'bg-yellow-400' : 'bg-emerald-500')
const strengthTextColor = computed(() => passwordStrength.value <= 1 ? 'text-red-500' : passwordStrength.value === 2 ? 'text-amber-500' : passwordStrength.value === 3 ? 'text-yellow-500' : 'text-emerald-600')
const strengthLabel = computed(() => passwordStrength.value <= 1 ? 'Yếu' : passwordStrength.value === 2 ? 'Trung bình' : passwordStrength.value === 3 ? 'Khá' : 'Mạnh')
const passwordStrengthPercent = computed(() => passwordStrength.value * 25)
const hasUppercase = computed(() => /[A-Z]/.test(passwordForm.value.newPassword))
const hasNumber = computed(() => /[0-9]/.test(passwordForm.value.newPassword))
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(passwordForm.value.newPassword))
const hasMinLength = computed(() => passwordForm.value.newPassword.length >= 8)
const passwordsMatch = computed(() =>
  !!passwordForm.value.confirmPassword && passwordForm.value.newPassword === passwordForm.value.confirmPassword,
)
const canSubmitPassword = computed(() =>
  !!passwordForm.value.currentPassword &&
  !!passwordForm.value.newPassword &&
  !!passwordForm.value.confirmPassword &&
  hasMinLength.value &&
  passwordsMatch.value,
)
const passwordMissingHints = computed(() => {
  const hints: string[] = []
  if (!hasUppercase.value) hints.push('chữ hoa')
  if (!hasNumber.value) hints.push('số')
  if (!hasSpecial.value) hints.push('ký tự đặc biệt')
  return hints
})

function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 2500)
}

function normalizeUser(raw: any): AdminUserResponse {
  return {
    id: raw.id ?? '',
    username: raw.username ?? '',
    email: raw.email ?? '',
    fullName: raw.fullName ?? '',
    phone: raw.phone ?? '',
    role: raw.role ?? 'MANAGER',
    createdAt: raw.createdAt ?? '',
    active: raw.active ?? true,
    avatarUrl: raw.avatarUrl ?? '',
  }
}

function buildAvatarUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('blob:')) return url
  return BASE_URL + url
}

function displayValue(value: string | undefined | null) {
  return value && value.trim() ? value : 'Chưa cập nhật'
}

function emptyClass(value: string | undefined | null) {
  return value && value.trim() ? 'text-[#37424C]' : 'italic text-[#9AA7B2]'
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function normalizeExtendedDisplay(key: ExtendedKey, value: string) {
  if (key !== 'gender') return value
  if (value === 'male') return 'Nam'
  if (value === 'female') return 'Nữ'
  if (value === 'other') return 'Khác'
  return ''
}

function triggerFilePicker() {
  fileInput.value?.click()
}

async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !profile.value) return
  if (file.size > 2 * 1024 * 1024) {
    showToast('error', 'File ảnh tối đa 2MB')
    input.value = ''
    return
  }
  const previewUrl = URL.createObjectURL(file)
  avatarSrc.value = previewUrl
  uploadingAvatar.value = true
  try {
    const res = await adminUserService.uploadAvatar(profile.value.id, file)
    const raw: any = (res.data as any)?.data ?? res.data
    const serverRelativeUrl: string | undefined = raw?.avatarUrl
    if (serverRelativeUrl) {
      profile.value = { ...profile.value, avatarUrl: serverRelativeUrl }
      avatarSrc.value = buildAvatarUrl(serverRelativeUrl)
      authStore.updateUser({ avatarUrl: serverRelativeUrl })
    } else {
      await fetchProfile()
    }
    showToast('success', 'Đã cập nhật ảnh đại diện')
  } catch {
    avatarSrc.value = buildAvatarUrl(profile.value.avatarUrl)
    showToast('error', 'Tải ảnh thất bại')
  } finally {
    URL.revokeObjectURL(previewUrl)
    uploadingAvatar.value = false
    input.value = ''
  }
}

function startBasicEdit(field: BasicField) {
  if (!profile.value) return
  basicEditingField.value = field
  basicEditDraft.value = profile.value[field] ?? ''
}

function cancelBasicEdit() {
  basicEditingField.value = null
  basicEditDraft.value = ''
}

async function saveBasicField(field: BasicField) {
  savingBasic.value = true
  try {
    const payload: Record<string, unknown> = { [field]: basicEditDraft.value.trim() || null }
    const res = await http.put('/users/me/profile', payload)
    const raw: any = (res.data as any)?.data ?? res.data
    if (raw?.id) profile.value = normalizeUser(raw)
    else if (profile.value) profile.value = { ...profile.value, [field]: basicEditDraft.value.trim() }
    showToast('success', 'Cập nhật thành công')
    cancelBasicEdit()
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Không thể cập nhật')
  } finally {
    savingBasic.value = false
  }
}

function startExtendedEdit(field: ExtendedKey) {
  extendedEditingField.value = field
  extendedDraft.value = extendedForm[field] || (field === 'country' ? 'Việt Nam' : '')
}

function cancelExtendedEdit() {
  extendedEditingField.value = null
  extendedDraft.value = ''
}

function loadExtendedFromStorage() {
  try {
    const raw = localStorage.getItem(EXTENDED_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Partial<Record<ExtendedKey, string>>
    for (const key of Object.keys(extendedForm) as ExtendedKey[]) {
      extendedForm[key] = parsed[key] ?? extendedForm[key]
    }
  } catch {
    // ignore malformed localStorage
  }
}

function loadSocialFromStorage() {
  try {
    const raw = localStorage.getItem(SOCIAL_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Partial<Record<SocialKey, string>>
    for (const key of Object.keys(socialForm) as SocialKey[]) {
      socialForm[key] = parsed[key] ?? ''
    }
  } catch {
    // ignore malformed localStorage
  }
}

function saveExtendedToStorage() {
  localStorage.setItem(EXTENDED_STORAGE_KEY, JSON.stringify(extendedForm))
}

function saveSocialToStorage() {
  localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(socialForm))
}

async function persistExtrasToBackend(payload: Record<string, unknown>) {
  try {
    await http.put('/admin/users/me', payload)
    return true
  } catch {
    return false
  }
}

async function saveExtendedField(field: ExtendedKey) {
  savingExtended.value = true
  try {
    extendedForm[field] = extendedDraft.value.trim()
    if (field === 'country' && !extendedForm.country) extendedForm.country = 'Việt Nam'

    const ok = await persistExtrasToBackend({ [field]: extendedForm[field] || null })
    if (!ok) {
      // TODO: remove localStorage fallback when backend supports extended profile fields in /admin/users/me.
      saveExtendedToStorage()
      showToast('success', 'Đã lưu tạm trên trình duyệt')
    } else {
      showToast('success', 'Đã cập nhật thông tin mở rộng')
    }
    cancelExtendedEdit()
  } catch {
    showToast('error', 'Không thể lưu thông tin mở rộng')
  } finally {
    savingExtended.value = false
  }
}

function buildSocialLink(key: SocialKey, value: string) {
  const v = value.trim()
  if (!v) return '#'
  if (key === 'zalo') return `https://zalo.me/${v.replace(/\D/g, '')}`
  if (/^https?:\/\//i.test(v)) return v
  return `https://${v}`
}

function focusSocialInput(_key: SocialKey) {
  // kept for UX parity with "+" action
}

function resetSocial() {
  loadSocialFromStorage()
}

async function saveSocialLinks() {
  savingSocial.value = true
  try {
    const payload = {
      facebook: socialForm.facebook || null,
      instagram: socialForm.instagram || null,
      twitter: socialForm.twitter || null,
      linkedin: socialForm.linkedin || null,
      zalo: socialForm.zalo || null,
    }
    const ok = await persistExtrasToBackend(payload)
    if (!ok) {
      // TODO: remove localStorage fallback when backend supports social link fields in /admin/users/me.
      saveSocialToStorage()
      showToast('success', 'Đã lưu liên kết tạm trên trình duyệt')
    } else {
      showToast('success', 'Đã cập nhật liên kết mạng xã hội')
    }
  } catch {
    showToast('error', 'Không thể lưu mạng xã hội')
  } finally {
    savingSocial.value = false
  }
}

function resetPasswordForm(keepSuccess = false) {
  passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  passwordError.value = ''
  if (!keepSuccess) passwordSuccess.value = false
  errorShake.value = false
}

async function submitPassword() {
  errorShake.value = false
  passwordError.value = ''
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    passwordError.value = 'Vui lòng nhập đầy đủ thông tin mật khẩu'
    errorShake.value = true
    return
  }
  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'Mật khẩu mới phải có ít nhất 8 ký tự'
    errorShake.value = true
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Xác nhận mật khẩu không khớp'
    errorShake.value = true
    return
  }
  savingPassword.value = true
  try {
    await authService.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    })
    showToast('success', 'Đổi mật khẩu thành công')
    passwordSuccess.value = true
    resetPasswordForm(true)
  } catch (e: any) {
    passwordError.value = e?.response?.data?.message ?? 'Đổi mật khẩu thất bại'
    errorShake.value = true
  } finally {
    savingPassword.value = false
  }
}

watch(
  () => [passwordForm.value.currentPassword, passwordForm.value.newPassword, passwordForm.value.confirmPassword],
  () => {
    errorShake.value = false
    if (passwordSuccess.value) passwordSuccess.value = false
  },
)

async function fetchProfile() {
  loading.value = true
  try {
    const res = await authService.getMe()
    const raw: any = (res.data as any)?.data ?? res.data
    profile.value = normalizeUser(raw)
    avatarSrc.value = buildAvatarUrl(profile.value.avatarUrl)

    extendedForm.birthDate = raw.birthDate ?? ''
    extendedForm.gender = raw.gender ?? ''
    extendedForm.address = raw.address ?? ''
    extendedForm.city = raw.city ?? ''
    extendedForm.province = raw.province ?? ''
    extendedForm.country = raw.country ?? 'Việt Nam'
    extendedForm.idNumber = raw.idNumber ?? raw.cccd ?? raw.cmnd ?? ''
    extendedForm.occupation = raw.occupation ?? ''

    socialForm.facebook = raw.facebook ?? ''
    socialForm.instagram = raw.instagram ?? ''
    socialForm.twitter = raw.twitter ?? raw.x ?? ''
    socialForm.linkedin = raw.linkedin ?? ''
    socialForm.zalo = raw.zalo ?? ''
  } finally {
    loadExtendedFromStorage()
    loadSocialFromStorage()
    loading.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.label {
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #9aa7b2;
}

.icon-wrap {
  display: inline-flex;
  height: 22px;
  width: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #eef3f8;
  flex-shrink: 0;
}

.field-readonly {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  border-radius: 12px;
  border: 1px solid #e6edf3;
  background: #f9fbfd;
  padding: 0 12px;
  transition: all 0.2s ease;
}

.field-edit {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid #a8845a;
  background: #fffdf9;
  padding: 8px 12px;
}

.card-field {
  border: 1px solid #e9edf2;
  border-radius: 14px;
  padding: 14px;
  background: white;
  transition: all 0.2s ease;
}

.card-field:hover {
  border-color: #d8e1ea;
  box-shadow: 0 6px 16px rgba(15, 46, 74, 0.05);
}

.btn-save {
  border-radius: 10px;
  background: #a8845a;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  transition: background 0.2s ease;
}

.btn-save:hover {
  background: #916e48;
}

.btn-save:disabled {
  opacity: 0.6;
}

.btn-cancel {
  border-radius: 10px;
  border: 1px solid #d8e1ea;
  background: white;
  color: #40505f;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
}

.password-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dce5ed;
  background: #f8fafc;
  border-radius: 12px;
  padding: 0 10px;
}

.password-wrap:focus-within {
  border-color: #a8845a;
  box-shadow: 0 0 0 3px rgba(168, 132, 90, 0.15);
}

.password-input {
  flex: 1;
  height: 42px;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #33414e;
}

.pwd-toggle {
  color: #6b7b88;
  font-size: 12px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.pwd-toggle:hover {
  color: #0f2e4a;
}

.shake-error {
  animation: shakeX 0.35s ease;
}

.success-ping {
  animation: successPop 0.35s ease;
}

@keyframes shakeX {
  0% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}

@keyframes successPop {
  0% { opacity: 0; transform: scale(0.8); }
  60% { opacity: 1; transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
