<template>
  <div class="min-h-screen flex font-inter">

    <!-- LEFT PANEL: visual/branding -->
    <div class="hidden lg:flex w-1/2 bg-[#1A4D6D] flex-col items-center
                justify-center relative overflow-hidden px-12">

      <!-- animated blobs -->
      <div class="absolute top-[-80px] left-[-80px] w-72 h-72
                  bg-[#00897B] rounded-full opacity-20 animate-blob"></div>
      <div class="absolute bottom-[-60px] right-[-60px] w-96 h-96
                  bg-[#546E7A] rounded-full opacity-20 animate-blob
                  animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/3 w-48 h-48
                  bg-[#B8D0DE] rounded-full opacity-10 animate-blob
                  animation-delay-4000"></div>

      <!-- building SVG illustration -->
      <svg class="w-64 h-64 mb-8 relative z-10 drop-shadow-xl"
           viewBox="0 0 200 200" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <!-- Ground -->
        <rect x="10" y="170" width="180" height="8" rx="2"
              fill="#B8D0DE" opacity="0.4"/>
        <!-- Main building -->
        <rect x="50" y="60" width="100" height="112" rx="4"
              fill="white" opacity="0.15"/>
        <rect x="50" y="60" width="100" height="112" rx="4"
              stroke="white" stroke-width="1.5" opacity="0.4"/>
        <!-- Roof triangle -->
        <polygon points="40,60 100,20 160,60"
                 fill="white" opacity="0.2"/>
        <polygon points="40,60 100,20 160,60"
                 stroke="white" stroke-width="1.5"
                 stroke-linejoin="round" opacity="0.5"/>
        <!-- Windows row 1 -->
        <rect x="65" y="80" width="20" height="18" rx="2"
              fill="#00897B" opacity="0.7"/>
        <rect x="115" y="80" width="20" height="18" rx="2"
              fill="#00897B" opacity="0.7"/>
        <!-- Windows row 2 -->
        <rect x="65" y="110" width="20" height="18" rx="2"
              fill="white" opacity="0.3"/>
        <rect x="115" y="110" width="20" height="18" rx="2"
              fill="#00897B" opacity="0.7"/>
        <!-- Windows row 3 -->
        <rect x="65" y="140" width="20" height="18" rx="2"
              fill="white" opacity="0.3"/>
        <rect x="115" y="140" width="20" height="18" rx="2"
              fill="white" opacity="0.3"/>
        <!-- Door -->
        <rect x="85" y="148" width="30" height="24" rx="3"
              fill="white" opacity="0.25"/>
        <!-- Door knob -->
        <circle cx="112" cy="162" r="2" fill="white" opacity="0.6"/>
        <!-- Left small building -->
        <rect x="18" y="100" width="28" height="72" rx="3"
              fill="white" opacity="0.08"/>
        <rect x="18" y="100" width="28" height="72" rx="3"
              stroke="white" stroke-width="1" opacity="0.25"/>
        <rect x="24" y="112" width="10" height="10" rx="1"
              fill="white" opacity="0.2"/>
        <rect x="24" y="130" width="10" height="10" rx="1"
              fill="#00897B" opacity="0.5"/>
        <!-- Right small building -->
        <rect x="154" y="110" width="28" height="62" rx="3"
              fill="white" opacity="0.08"/>
        <rect x="154" y="110" width="28" height="62" rx="3"
              stroke="white" stroke-width="1" opacity="0.25"/>
        <rect x="160" y="122" width="10" height="10" rx="1"
              fill="#00897B" opacity="0.5"/>
        <rect x="160" y="140" width="10" height="10" rx="1"
              fill="white" opacity="0.2"/>
        <!-- Stars / dots -->
        <circle cx="80" cy="35" r="2" fill="white" opacity="0.4"/>
        <circle cx="130" cy="28" r="1.5" fill="white" opacity="0.3"/>
        <circle cx="155" cy="42" r="1" fill="white" opacity="0.5"/>
        <circle cx="48" cy="44" r="1.5" fill="white" opacity="0.3"/>
      </svg>

      <!-- branding text -->
      <h1 class="font-manrope font-bold text-3xl text-white
                 text-center leading-tight relative z-10">
        Apartment<br/>Management
      </h1>
      <p class="text-[#B8D0DE] text-sm mt-3 text-center
                max-w-xs relative z-10 leading-relaxed">
        Hệ thống quản lý chung cư thông minh — theo dõi căn hộ,
        cư dân và dịch vụ trong một nền tảng.
      </p>

      <!-- stats row -->
      <div class="flex gap-8 mt-10 relative z-10">
        <div class="text-center">
          <p class="font-manrope font-bold text-2xl text-white">500+</p>
          <p class="text-[#B8D0DE] text-xs mt-1">Căn hộ</p>
        </div>
        <div class="w-px bg-white opacity-20"></div>
        <div class="text-center">
          <p class="font-manrope font-bold text-2xl text-white">1,200+</p>
          <p class="text-[#B8D0DE] text-xs mt-1">Cư dân</p>
        </div>
        <div class="w-px bg-white opacity-20"></div>
        <div class="text-center">
          <p class="font-manrope font-bold text-2xl text-white">99%</p>
          <p class="text-[#B8D0DE] text-xs mt-1">Uptime</p>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: login form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center
                bg-[#DCE9F0] px-6 py-12">
      <RouterView />
    </div>

  </div>
</template>
