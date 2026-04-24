<template>
  <!-- Fullscreen dark gallery — đứng ngoài MainLayout để chiếm full viewport -->
  <div
    class="fixed inset-0 bg-[#0A1A2E] flex flex-col z-50 select-none"
    @keydown.left="prev"
    @keydown.right="next"
    @keydown.escape="close"
    tabindex="0"
    ref="containerRef"
  >
    <!-- Top bar -->
    <div class="flex items-center justify-between px-5 pt-10 pb-3 flex-shrink-0">
      <!-- Counter -->
      <span class="text-white/60 text-sm font-medium">
        {{ images.length ? `${activeIdx + 1} / ${images.length}` : '' }}
      </span>

      <!-- Right actions -->
      <div class="flex items-center gap-2">
        <button
          class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          title="Chia sẻ"
          @click="share"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="13" cy="3" r="2" stroke="white" stroke-width="1.4"/>
            <circle cx="3" cy="8" r="2" stroke="white" stroke-width="1.4"/>
            <circle cx="13" cy="13" r="2" stroke="white" stroke-width="1.4"/>
            <path d="M5 7l6-3M5 9l6 3" stroke="white" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </button>

        <button
          class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          title="Thông tin"
          @click="showInfo = !showInfo"
          :class="showInfo ? 'bg-white/25' : ''"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="white" stroke-width="1.4"/>
            <path d="M8 7v5M8 5h.01" stroke="white" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </button>

        <button
          class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          title="Đóng"
          @click="close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <svg class="animate-spin" width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="15" stroke="white" stroke-width="2.5" stroke-dasharray="40 55" stroke-opacity="0.4"/>
        <circle cx="18" cy="18" r="15" stroke="white" stroke-width="2.5" stroke-dasharray="20 75"/>
      </svg>
    </div>

    <!-- Error state -->
    <div v-else-if="loadError" class="flex-1 flex flex-col items-center justify-center text-center px-8">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" class="mb-4 opacity-40">
        <circle cx="24" cy="24" r="22" stroke="white" stroke-width="2"/>
        <path d="M24 15v10M24 30h.01" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <p class="text-white/60 text-base">Không thể tải ảnh</p>
      <button @click="fetchApartment" class="mt-4 text-[#A8845A] text-sm font-medium hover:underline">Thử lại</button>
    </div>

    <!-- No images -->
    <div v-else-if="!images.length" class="flex-1 flex flex-col items-center justify-center text-center px-8">
      <div class="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center mb-5">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="4" y="10" width="40" height="30" rx="4" stroke="white" stroke-width="2" stroke-opacity="0.3"/>
          <circle cx="15" cy="20" r="4" stroke="white" stroke-width="2" stroke-opacity="0.3"/>
          <path d="M4 32l10-10 8 8 6-7 10 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"/>
        </svg>
      </div>
      <p class="text-white/50 text-lg font-medium">Chưa có ảnh</p>
      <p class="text-white/30 text-sm mt-1">Căn hộ này chưa có hình ảnh nào</p>
      <button
        @click="close"
        class="mt-6 flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        Quay lại
      </button>
    </div>

    <!-- Main image area -->
    <div v-else class="flex-1 flex flex-col min-h-0">
      <!-- Main image + nav arrows -->
      <div
        class="flex-1 relative flex items-center justify-center px-4 min-h-0"
        @click="handleMainClick"
      >
        <!-- Prev arrow -->
        <button
          v-if="images.length > 1"
          @click.stop="prev"
          class="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
          :class="activeIdx === 0 ? 'opacity-30 cursor-default' : ''"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Image -->
        <Transition :name="slideDir" mode="out-in">
          <div
            :key="activeIdx"
            class="relative max-w-2xl w-full flex flex-col items-center"
          >
            <img
              :src="getImageUrl(images[activeIdx].url)"
              :alt="images[activeIdx].label || `Ảnh ${activeIdx + 1}`"
              class="rounded-2xl object-cover max-h-[55vh] w-full shadow-2xl"
              @error="handleImgError"
            />

            <!-- Label chip -->
            <div
              v-if="images[activeIdx].label"
              class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#0F2E4A]/80 backdrop-blur-sm text-white text-xs font-medium px-4 py-1.5 rounded-full whitespace-nowrap"
            >
              {{ images[activeIdx].label }}
            </div>
          </div>
        </Transition>

        <!-- Next arrow -->
        <button
          v-if="images.length > 1"
          @click.stop="next"
          class="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
          :class="activeIdx === images.length - 1 ? 'opacity-30 cursor-default' : ''"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1l6 6-6 6" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Apartment info overlay -->
      <Transition name="slide-up">
        <div v-if="showInfo && apartment" class="bg-[#0F2E4A]/90 backdrop-blur-sm px-5 py-4 flex-shrink-0">
          <p class="text-white font-bold text-base">{{ apartment.displayCode || apartment.unitCode }}</p>
          <div class="flex items-center gap-4 mt-1.5 flex-wrap">
            <span class="text-[#A9B8A8] text-xs">{{ apartment.zoneName }}</span>
            <span v-if="apartment.buildingName" class="text-[#A9B8A8] text-xs">{{ apartment.buildingName }}</span>
            <span v-if="apartment.area" class="text-[#A9B8A8] text-xs">{{ apartment.area }} m²</span>
            <span v-if="apartment.sellingPrice" class="text-[#A8845A] text-xs font-semibold">{{ formatPrice(apartment.sellingPrice) }}</span>
          </div>
        </div>
      </Transition>

      <!-- Thumbnail strip -->
      <div class="flex-shrink-0 px-4 pb-8 pt-3">
        <div class="flex gap-2 overflow-x-auto scrollbar-hide justify-center">
          <button
            v-for="(img, idx) in images"
            :key="idx"
            class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 ring-2 ring-offset-2 ring-offset-[#0A1A2E]"
            :class="idx === activeIdx
              ? 'ring-[#A8845A] scale-105'
              : 'ring-transparent opacity-50 hover:opacity-80'"
            @click="goTo(idx)"
          >
            <img
              :src="getImageUrl(img.url)"
              :alt="img.label || `Ảnh ${idx + 1}`"
              class="w-full h-full object-cover"
              @error="(e) => (e.target as HTMLImageElement).parentElement!.classList.add('bg-white/10')"
            />
          </button>

          <!-- +N more -->
          <div
            v-if="images.length > MAX_THUMBS"
            class="flex-shrink-0 w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-white/60 text-xs font-bold"
          >
            +{{ images.length - MAX_THUMBS }}
          </div>
        </div>

        <!-- Dot indicators for small counts -->
        <div v-if="images.length <= 8 && images.length > 1" class="flex justify-center gap-1.5 mt-3">
          <span
            v-for="(_, idx) in images"
            :key="idx"
            class="rounded-full transition-all duration-200"
            :class="idx === activeIdx ? 'w-4 h-1.5 bg-[#A8845A]' : 'w-1.5 h-1.5 bg-white/30'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apartmentService from '@/services/apartmentService'
import type { ApartmentResponse } from '@/types/apartment'
import type { ImageResponse } from '@/types/common'

const route = useRoute()
const router = useRouter()
const apartmentId = computed(() => route.params.id as string)

const MAX_THUMBS = 6

// State
const loading = ref(true)
const loadError = ref(false)
const apartment = ref<ApartmentResponse | null>(null)
const images = ref<ImageResponse[]>([])
const activeIdx = ref(0)
const showInfo = ref(false)
const slideDir = ref('slide-right')
const containerRef = ref<HTMLElement | null>(null)

function getImageUrl(url: string) {
  if (!url) return '/placeholder.jpg'
  if (url.startsWith('http')) return url
  return `http://localhost:8080${url}`
}

function formatPrice(v: number) {
  const ty = v / 1_000_000_000
  return ty >= 1 ? `${ty.toFixed(1).replace(/\.0$/, '')} tỷ` : `${(v / 1_000_000).toFixed(0)} triệu`
}

function goTo(idx: number) {
  if (idx === activeIdx.value) return
  slideDir.value = idx > activeIdx.value ? 'slide-right' : 'slide-left'
  activeIdx.value = idx
}

function next() {
  if (activeIdx.value < images.value.length - 1) goTo(activeIdx.value + 1)
}

function prev() {
  if (activeIdx.value > 0) goTo(activeIdx.value - 1)
}

function close() {
  router.push(`/apartments/${apartmentId.value}`)
}

function share() {
  if (navigator.share) {
    navigator.share({ url: window.location.href }).catch(() => {})
  } else {
    navigator.clipboard?.writeText(window.location.href)
  }
}

function handleMainClick(e: MouseEvent) {
  const w = (e.currentTarget as HTMLElement).offsetWidth
  if (e.clientX < w / 2) prev()
  else next()
}

function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

// Touch / swipe
let touchStartX = 0
function onTouchStart(e: TouchEvent) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 50) dx < 0 ? next() : prev()
}

async function fetchApartment() {
  loading.value = true
  loadError.value = false
  try {
    const res = await apartmentService.getById(apartmentId.value)
    apartment.value = res.data.data
    images.value = [...(res.data.data.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
    console.log('[Gallery] images from API:', images.value)
    // Start at image index from query param if present
    const startIdx = Number(route.query.idx ?? 0)
    activeIdx.value = Math.min(startIdx, Math.max(0, images.value.length - 1))
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

// Keyboard handling
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'Escape') close()
}

onMounted(async () => {
  document.body.style.overflow = 'hidden'
  await fetchApartment()
  await nextTick()
  containerRef.value?.focus()
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
})
</script>

<style scoped>
/* Thumbnail scrollbar hide */
.scrollbar-hide { scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* Slide transitions */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s ease;
}
.slide-right-enter-from { opacity: 0; transform: translateX(40px); }
.slide-right-leave-to  { opacity: 0; transform: translateX(-40px); }
.slide-left-enter-from  { opacity: 0; transform: translateX(-40px); }
.slide-left-leave-to   { opacity: 0; transform: translateX(40px); }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(8px); }
</style>
