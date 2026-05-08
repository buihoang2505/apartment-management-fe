<template>
  <div class="w-full max-w-md">
    <!-- Success state -->
    <div v-if="submitted" class="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[#16A34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-[#0F2E4A] mb-2">Cảm ơn bạn!</h2>
      <p class="text-sm text-[#414A4D]/70 leading-relaxed">
        Chúng tôi đã ghi nhận đăng ký quan tâm. Đội ngũ tư vấn sẽ liên hệ với bạn trong vòng 24 giờ.
      </p>
      <button
        @click="resetForm"
        class="mt-6 text-sm text-[#A8845A] font-medium underline"
      >
        Gửi đăng ký khác
      </button>
    </div>

    <!-- Form -->
    <div v-else class="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-[#0F2E4A]">Đăng ký quan tâm</h1>
        <p class="text-sm text-[#414A4D]/60 mt-2">
          Để lại thông tin, chúng tôi sẽ tư vấn miễn phí
        </p>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-[#414A4D] mb-1.5">
            Họ tên <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.fullName"
            type="text"
            placeholder="Nguyễn Văn A"
            class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
            :class="{ 'border-red-400': errors.fullName }"
          />
          <p v-if="errors.fullName" class="text-xs text-red-500 mt-1">{{ errors.fullName }}</p>
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
            :class="{ 'border-red-400': errors.phone }"
          />
          <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="email@example.com"
            class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
            :class="{ 'border-red-400': errors.email }"
          />
          <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Bạn biết đến chúng tôi qua đâu?</label>
          <select
            v-model="form.source"
            class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition"
          >
            <option value="WEBSITE">Website</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="ZALO">Zalo</option>
            <option value="REFERRAL">Bạn bè giới thiệu</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-[#414A4D] mb-1.5">Nhu cầu / Ghi chú</label>
          <textarea
            v-model="form.note"
            rows="3"
            placeholder="Quan tâm 2PN, ngân sách 3 tỷ..."
            class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] focus:ring-2 focus:ring-[#A8845A]/20 transition resize-none"
          />
        </div>

        <p v-if="submitError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ submitError }}</p>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full px-4 py-3 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
        >
          <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Gửi đăng ký
        </button>

        <p class="text-xs text-[#414A4D]/50 text-center pt-2">
          Bằng việc gửi đăng ký, bạn đồng ý cho chúng tôi liên hệ tư vấn.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import publicLeadService from '@/services/publicLeadService'
import type { LeadSource } from '@/types/customer'

const emptyForm = () => ({
  fullName: '',
  phone: '',
  email: '',
  source: 'WEBSITE' as LeadSource,
  note: '',
})

const form = ref(emptyForm())
const errors = ref<{ fullName?: string; phone?: string; email?: string }>({})
const submitting = ref(false)
const submitError = ref('')
const submitted = ref(false)

function validate(): boolean {
  errors.value = {}
  if (!form.value.fullName.trim()) errors.value.fullName = 'Họ tên không được để trống'
  if (!form.value.phone.trim()) {
    errors.value.phone = 'Số điện thoại không được để trống'
  } else if (!/^[\d\s+()-]{8,20}$/.test(form.value.phone.trim())) {
    errors.value.phone = 'Số điện thoại không hợp lệ'
  }
  if (form.value.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim())) {
    errors.value.email = 'Email không đúng định dạng'
  }
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = ''
  try {
    await publicLeadService.register({
      fullName: form.value.fullName.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email.trim() || undefined,
      source: form.value.source,
      note: form.value.note.trim() || undefined,
    })
    submitted.value = true
  } catch (e: any) {
    submitError.value = e?.response?.data?.message
      ?? e?.response?.data?.error
      ?? 'Có lỗi xảy ra, vui lòng thử lại'
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.value = emptyForm()
  errors.value = {}
  submitError.value = ''
  submitted.value = false
}
</script>
