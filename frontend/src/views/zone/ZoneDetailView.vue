<template>
  <div class="p-6 space-y-6">

    <!-- Back -->
    <button @click="router.push('/zones')" class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#A8845A] transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Quay lại Phân khu
    </button>

    <!-- Page loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-4 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
    </div>

    <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 mb-3">{{ loadError }}</p>
      <button @click="init" class="text-sm text-red-500 underline">Thử lại</button>
    </div>

    <template v-else-if="zone">

      <!-- Top row: zone info + portfolio -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Zone info card (2 cols) -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-[#DDE8EF] p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div v-if="!editingZone">
                <div class="flex items-center gap-3 mb-1">
                  <h1 class="text-2xl font-bold text-[#0F2E4A]">{{ zone.name }}</h1>
                  <span class="font-mono text-sm bg-[#F0F5F9] text-gray-600 px-2.5 py-1 rounded-lg">{{ zone.code }}</span>
                </div>
                <p v-if="zone.description" class="text-gray-500 text-sm mt-1">{{ zone.description }}</p>
                <p v-else class="text-gray-300 text-sm mt-1 italic">Không có mô tả</p>
                <p class="text-xs text-gray-400 mt-3">Tạo lúc {{ formatDate(zone.createdAt) }}</p>
              </div>
              <form v-else @submit.prevent="saveZone" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Tên <span class="text-red-500">*</span></label>
                    <input v-model="zoneForm.name" type="text" placeholder="Tên phân khu"
                      class="w-full px-3 py-2 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] transition"
                      :class="{ 'border-red-400': zoneFormErrors.name }" />
                    <p v-if="zoneFormErrors.name" class="text-xs text-red-500 mt-0.5">{{ zoneFormErrors.name }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Mã <span class="text-red-500">*</span></label>
                    <input v-model="zoneForm.code" type="text" placeholder="ZONE-A"
                      class="w-full px-3 py-2 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm font-mono outline-none focus:border-[#A8845A] transition uppercase"
                      :class="{ 'border-red-400': zoneFormErrors.code }"
                      @input="zoneForm.code = (zoneForm.code as string).toUpperCase()" />
                    <p v-if="zoneFormErrors.code" class="text-xs text-red-500 mt-0.5">{{ zoneFormErrors.code }}</p>
                  </div>
                </div>
                <textarea v-model="zoneForm.description" rows="2" placeholder="Mô tả (tuỳ chọn)"
                  class="w-full px-3 py-2 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] transition resize-none" />
                <p v-if="zoneFormError" class="text-xs text-red-500">{{ zoneFormError }}</p>
                <div class="flex gap-2">
                  <button type="submit" :disabled="savingZone"
                    class="px-4 py-2 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center gap-2">
                    <span v-if="savingZone" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Lưu
                  </button>
                  <button type="button" @click="editingZone = false"
                    class="px-4 py-2 border border-[#DDE8EF] text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition">
                    Huỷ
                  </button>
                </div>
              </form>
            </div>
            <button v-if="!editingZone" @click="startEditZone"
              class="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-[#A8845A] border border-[#DDE8EF] hover:border-[#A8845A] rounded-xl transition flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Chỉnh sửa
            </button>
          </div>
        </div>

        <!-- Portfolio card (1 col) -->
        <div class="bg-white rounded-2xl border border-[#DDE8EF] p-6">
          <h3 class="text-sm font-semibold text-gray-600 mb-3">Thuộc Portfolio</h3>
          <div v-if="currentPortfolio" class="mb-3">
            <button @click="router.push(`/portfolios/${currentPortfolio.id}`)"
              class="font-medium text-[#0F2E4A] hover:text-[#A8845A] transition-colors text-sm">
              {{ currentPortfolio.name }}
            </button>
            <p v-if="currentPortfolio.description" class="text-xs text-gray-400 mt-0.5 line-clamp-1">{{ currentPortfolio.description }}</p>
          </div>
          <div v-else class="text-sm text-gray-400 italic mb-3">Chưa gán portfolio</div>
          <div v-if="!editingPortfolio">
            <button @click="startEditPortfolio"
              class="text-xs text-[#A8845A] hover:underline font-medium">
              {{ currentPortfolio ? 'Thay đổi' : 'Gán portfolio' }} →
            </button>
          </div>
          <div v-else class="space-y-2">
            <select v-model="selectedPortfolioId"
              class="w-full px-3 py-2 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] transition">
              <option value="">— Không gán —</option>
              <option v-for="p in allPortfolios" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
            <p v-if="portfolioError" class="text-xs text-red-500">{{ portfolioError }}</p>
            <div class="flex gap-2">
              <button @click="savePortfolioAssign" :disabled="savingPortfolio"
                class="flex-1 px-3 py-1.5 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-xs font-medium rounded-lg transition flex items-center justify-center gap-1">
                <span v-if="savingPortfolio" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Lưu
              </button>
              <button @click="editingPortfolio = false"
                class="flex-1 px-3 py-1.5 border border-[#DDE8EF] text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition">
                Huỷ
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Buildings section -->
      <div class="bg-white rounded-2xl border border-[#DDE8EF]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#DDE8EF]">
          <div>
            <h2 class="font-semibold text-[#0F2E4A]">Tòa nhà</h2>
            <p class="text-xs text-gray-400 mt-0.5">{{ buildings.length }} tòa nhà</p>
          </div>
          <button @click="openBuildingModal()"
            class="flex items-center gap-1.5 px-3 py-2 bg-[#A8845A] hover:bg-[#8f6e4a] text-white text-sm font-medium rounded-xl transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Thêm tòa
          </button>
        </div>

        <div v-if="loadingBuildings" class="flex justify-center py-8">
          <div class="w-6 h-6 border-4 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
        </div>
        <div v-else-if="buildings.length === 0" class="px-6 py-10 text-center text-sm text-gray-400">
          Chưa có tòa nhà nào trong phân khu này
        </div>
        <div v-else class="divide-y divide-[#F0F5F9]">
          <div v-for="b in buildings" :key="b.id"
            class="flex items-center justify-between px-6 py-4 hover:bg-[#FAFCFE] transition group">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-[#F0F5F9] flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-[#0F2E4A]">{{ b.name }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="font-mono text-xs bg-[#F0F5F9] text-gray-500 px-1.5 py-0.5 rounded">{{ b.code }}</span>
                  <span class="text-xs text-gray-400">{{ buildingTypeLabel(b.type) }}</span>
                  <span v-if="b.totalFloors" class="text-xs text-gray-400">· {{ b.totalFloors }} tầng</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="openBuildingModal(b)"
                class="p-1.5 rounded-lg text-gray-400 hover:text-[#A8845A] hover:bg-[#FFF8F2] transition" title="Chỉnh sửa">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="confirmDeleteBuilding(b)"
                class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition" title="Xóa">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Apartments section -->
      <div class="bg-white rounded-2xl border border-[#DDE8EF]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#DDE8EF]">
          <div>
            <h2 class="font-semibold text-[#0F2E4A]">Căn hộ</h2>
            <p class="text-xs text-gray-400 mt-0.5">{{ apartmentTotal }} căn hộ trong phân khu</p>
          </div>
          <button @click="router.push(`/apartments/new?zoneId=${zoneId}`)"
            class="flex items-center gap-1.5 px-3 py-2 bg-[#0F2E4A] hover:bg-[#1a4060] text-white text-sm font-medium rounded-xl transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Thêm căn hộ
          </button>
        </div>

        <div v-if="loadingApartments" class="flex justify-center py-8">
          <div class="w-6 h-6 border-4 border-[#A8845A] border-t-transparent rounded-full animate-spin" />
        </div>
        <div v-else-if="apartments.length === 0" class="px-6 py-10 text-center text-sm text-gray-400">
          Chưa có căn hộ nào trong phân khu này
        </div>
        <div v-else>
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-[#F6F9FB] border-b border-[#DDE8EF]">
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mã căn</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Tòa nhà</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Trạng thái</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Diện tích</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Giá bán</th>
                <th class="px-6 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F0F5F9]">
              <tr v-for="apt in apartments" :key="apt.id"
                class="hover:bg-[#FAFCFE] transition cursor-pointer group"
                @click="router.push(`/apartments/${apt.id}`)">
                <td class="px-6 py-3">
                  <span class="font-mono font-medium text-[#0F2E4A] text-xs">{{ apt.unitCode }}</span>
                </td>
                <td class="px-6 py-3 hidden sm:table-cell text-gray-500 text-xs">{{ apt.buildingName }}</td>
                <td class="px-6 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-medium" :class="statusClass(apt.status)">
                    {{ statusLabel(apt.status) }}
                  </span>
                </td>
                <td class="px-6 py-3 hidden md:table-cell text-gray-500 text-xs">{{ apt.area }} m²</td>
                <td class="px-6 py-3 hidden md:table-cell text-gray-700 text-xs font-medium">{{ formatPrice(apt.sellingPrice) }}</td>
                <td class="px-6 py-3">
                  <svg class="w-4 h-4 text-gray-300 group-hover:text-[#A8845A] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination -->
          <div v-if="apartmentTotalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-[#DDE8EF]">
            <p class="text-xs text-gray-400">Trang {{ apartmentPage + 1 }} / {{ apartmentTotalPages }}</p>
            <div class="flex gap-2">
              <button @click="loadApartments(apartmentPage - 1)" :disabled="apartmentPage === 0"
                class="px-3 py-1.5 text-xs border border-[#DDE8EF] rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">← Trước</button>
              <button @click="loadApartments(apartmentPage + 1)" :disabled="apartmentPage >= apartmentTotalPages - 1"
                class="px-3 py-1.5 text-xs border border-[#DDE8EF] rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">Tiếp →</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Building Modal -->
  <Teleport to="body">
    <div v-if="showBuildingModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="closeBuildingModal">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#DDE8EF]">
          <h2 class="text-base font-semibold text-[#0F2E4A]">
            {{ editingBuilding ? 'Chỉnh sửa tòa nhà' : 'Thêm tòa nhà' }}
          </h2>
          <button @click="closeBuildingModal" class="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitBuilding" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Tên tòa <span class="text-red-500">*</span></label>
              <input v-model="buildingForm.name" type="text" placeholder="Tòa A1"
                class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] transition"
                :class="{ 'border-red-400': buildingErrors.name }" />
              <p v-if="buildingErrors.name" class="text-xs text-red-500 mt-1">{{ buildingErrors.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Mã tòa <span class="text-red-500">*</span></label>
              <input v-model="buildingForm.code" type="text" placeholder="TOA-A1"
                class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm font-mono outline-none focus:border-[#A8845A] transition"
                :class="{ 'border-red-400': buildingErrors.code }" />
              <p v-if="buildingErrors.code" class="text-xs text-red-500 mt-1">{{ buildingErrors.code }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Loại tòa</label>
              <select v-model="buildingForm.type"
                class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] transition">
                <option value="">— Chọn loại —</option>
                <option v-for="t in buildingTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Số tầng</label>
              <input v-model.number="buildingForm.totalFloors" type="number" min="1" placeholder="20"
                class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] transition" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea v-model="buildingForm.description" rows="2" placeholder="Mô tả (tuỳ chọn)"
              class="w-full px-4 py-3 bg-[#F6F9FB] border border-[#DDE8EF] rounded-xl text-sm outline-none focus:border-[#A8845A] transition resize-none" />
          </div>
          <p v-if="buildingSubmitError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ buildingSubmitError }}</p>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeBuildingModal"
              class="flex-1 px-4 py-2.5 border border-[#DDE8EF] text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
              Huỷ
            </button>
            <button type="submit" :disabled="submittingBuilding"
              class="flex-1 px-4 py-2.5 bg-[#A8845A] hover:bg-[#8f6e4a] disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2">
              <span v-if="submittingBuilding" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {{ editingBuilding ? 'Lưu thay đổi' : 'Thêm tòa nhà' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Delete Building Confirm -->
  <Teleport to="body">
    <div v-if="deleteBuildingTarget"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="deleteBuildingTarget = null">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-[#0F2E4A]">Xác nhận xóa tòa nhà</h3>
            <p class="text-sm text-gray-500 mt-0.5">Xóa <span class="font-medium text-gray-700">{{ deleteBuildingTarget.name }}</span>?</p>
          </div>
        </div>
        <p class="text-xs text-gray-400 mb-5">Hành động này không thể hoàn tác.</p>
        <div class="flex gap-3">
          <button @click="deleteBuildingTarget = null"
            class="flex-1 px-4 py-2.5 border border-[#DDE8EF] text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
            Huỷ
          </button>
          <button @click="doDeleteBuilding" :disabled="deletingBuilding"
            class="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2">
            <span v-if="deletingBuilding" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Toast -->
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toast"
        class="fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl text-white text-sm shadow-xl flex items-center gap-2"
        :class="toast.type === 'success' ? 'bg-[#0F2E4A]' : 'bg-red-500'">
        <svg v-if="toast.type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import zoneService from '@/services/zoneService'
import portfolioService from '@/services/portfolioService'
import apartmentService from '@/services/apartmentService'
import type { ZoneResponse, BuildingResponse } from '@/types/zone'
import type { Portfolio } from '@/types/portfolio'
import type { ApartmentResponse, ApartmentStatus } from '@/types/apartment'

const router = useRouter()
const route = useRoute()
const zoneId = route.params.id as string

// ── Data ──────────────────────────────────────────────
const zone = ref<ZoneResponse | null>(null)
const buildings = ref<BuildingResponse[]>([])
const apartments = ref<ApartmentResponse[]>([])
const allPortfolios = ref<Portfolio[]>([])

const loading = ref(false)
const loadError = ref('')
const loadingBuildings = ref(false)
const loadingApartments = ref(false)

const apartmentPage = ref(0)
const apartmentTotal = ref(0)
const apartmentTotalPages = ref(0)

// ── Zone edit ─────────────────────────────────────────
const editingZone = ref(false)
const zoneForm = ref({ name: '', code: '', description: '' })
const zoneFormErrors = ref<{ name?: string; code?: string }>({})
const zoneFormError = ref('')
const savingZone = ref(false)

// ── Portfolio assign ──────────────────────────────────
const editingPortfolio = ref(false)
const selectedPortfolioId = ref('')
const portfolioError = ref('')
const savingPortfolio = ref(false)

const currentPortfolio = computed(() =>
  allPortfolios.value.find(p => p.zones?.some(z => z.id === zoneId)) ?? null
)

// ── Building modal ────────────────────────────────────
const showBuildingModal = ref(false)
const editingBuilding = ref<BuildingResponse | null>(null)
const buildingForm = ref({ name: '', code: '', type: '', totalFloors: null as number | null, description: '' })
const buildingErrors = ref<{ name?: string; code?: string }>({})
const buildingSubmitError = ref('')
const submittingBuilding = ref(false)
const deleteBuildingTarget = ref<BuildingResponse | null>(null)
const deletingBuilding = ref(false)

const buildingTypes = [
  { value: 'CHUNG_CU', label: 'Chung cư' },
  { value: 'SHOPHOUSE', label: 'Shophouse' },
  { value: 'VILLAS', label: 'Biệt thự' },
  { value: 'OFFICETEL', label: 'Officetel' },
  { value: 'OTHER', label: 'Khác' },
]

function buildingTypeLabel(type: string) {
  return buildingTypes.find(t => t.value === type)?.label ?? type
}

// ── Toast ─────────────────────────────────────────────
const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>
function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

// ── Helpers ───────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatPrice(price: number) {
  if (!price) return '—'
  const ty = price / 1_000_000_000
  if (ty >= 1) return `${ty % 1 === 0 ? ty : ty.toFixed(2)} tỷ`
  return `${Math.round(price / 1_000_000)} triệu`
}

const STATUS_MAP: Record<ApartmentStatus, { label: string; cls: string }> = {
  DANG_BAN: { label: 'Đang bán', cls: 'bg-emerald-100 text-emerald-700' },
  DA_COC:   { label: 'Đã cọc',   cls: 'bg-yellow-100 text-yellow-700' },
  DA_BAN:   { label: 'Đã bán',   cls: 'bg-blue-100 text-blue-700' },
  GIU_CHO:  { label: 'Giữ chỗ', cls: 'bg-orange-100 text-orange-700' },
  KHOA:     { label: 'Khoá',     cls: 'bg-gray-100 text-gray-500' },
}
function statusLabel(s: ApartmentStatus) { return STATUS_MAP[s]?.label ?? s }
function statusClass(s: ApartmentStatus) { return STATUS_MAP[s]?.cls ?? '' }

// ── Fetch ─────────────────────────────────────────────
async function fetchZone() {
  const res = await zoneService.getById(zoneId)
  zone.value = res.data.data
}

async function fetchBuildings() {
  loadingBuildings.value = true
  try {
    const res = await zoneService.getBuildingsByZone(zoneId)
    buildings.value = res.data.data ?? []
  } finally {
    loadingBuildings.value = false
  }
}

async function loadApartments(page = 0) {
  loadingApartments.value = true
  try {
    const res = await apartmentService.getList({ zoneId, page, size: 10 })
    const pg = res.data.data
    apartments.value = pg.content ?? []
    apartmentTotal.value = pg.totalElements
    apartmentTotalPages.value = pg.totalPages
    apartmentPage.value = page
  } finally {
    loadingApartments.value = false
  }
}

async function fetchPortfolios() {
  const res = await portfolioService.getAll()
  allPortfolios.value = res.data.data ?? []
}

async function init() {
  loading.value = true
  loadError.value = ''
  try {
    await Promise.all([fetchZone(), fetchBuildings(), loadApartments(0), fetchPortfolios()])
  } catch {
    loadError.value = 'Không thể tải dữ liệu phân khu'
  } finally {
    loading.value = false
  }
}

// ── Zone edit ─────────────────────────────────────────
function startEditZone() {
  if (!zone.value) return
  zoneForm.value = { name: zone.value.name, code: zone.value.code, description: zone.value.description ?? '' }
  zoneFormErrors.value = {}
  zoneFormError.value = ''
  editingZone.value = true
}

async function saveZone() {
  zoneFormErrors.value = {}
  if (!zoneForm.value.name.trim()) zoneFormErrors.value.name = 'Tên không được để trống'
  if (!zoneForm.value.code.trim()) zoneFormErrors.value.code = 'Mã không được để trống'
  else if (!/^[-A-Z0-9_]+$/.test(zoneForm.value.code)) zoneFormErrors.value.code = 'Chỉ dùng chữ hoa, số, - hoặc _'
  if (Object.keys(zoneFormErrors.value).length) return
  savingZone.value = true
  zoneFormError.value = ''
  try {
    const res = await zoneService.update(zoneId, {
      name: zoneForm.value.name.trim(),
      code: zoneForm.value.code.trim(),
      description: zoneForm.value.description.trim() || undefined,
    })
    zone.value = res.data.data
    editingZone.value = false
    showToast('success', 'Đã lưu thông tin phân khu')
  } catch (e: any) {
    zoneFormError.value = e?.response?.data?.message ?? 'Lưu thất bại'
  } finally {
    savingZone.value = false
  }
}

// ── Portfolio assign ──────────────────────────────────
function startEditPortfolio() {
  selectedPortfolioId.value = currentPortfolio.value?.id ?? ''
  portfolioError.value = ''
  editingPortfolio.value = true
}

async function savePortfolioAssign() {
  savingPortfolio.value = true
  portfolioError.value = ''
  try {
    const prev = currentPortfolio.value

    // Remove from old portfolio
    if (prev && prev.id !== selectedPortfolioId.value) {
      const remainingIds = prev.zones.filter(z => z.id !== zoneId).map(z => z.id)
      await portfolioService.update(prev.id, {
        name: prev.name,
        description: prev.description,
        zoneIds: remainingIds,
      })
    }

    // Add to new portfolio
    if (selectedPortfolioId.value) {
      const newP = allPortfolios.value.find(p => p.id === selectedPortfolioId.value)!
      const existingIds = newP.zones?.map(z => z.id) ?? []
      if (!existingIds.includes(zoneId)) {
        await portfolioService.update(selectedPortfolioId.value, {
          name: newP.name,
          description: newP.description,
          zoneIds: [...existingIds, zoneId],
        })
      }
    }

    await fetchPortfolios()
    editingPortfolio.value = false
    showToast('success', 'Đã cập nhật portfolio')
  } catch (e: any) {
    portfolioError.value = e?.response?.data?.message ?? 'Cập nhật thất bại'
  } finally {
    savingPortfolio.value = false
  }
}

// ── Building CRUD ─────────────────────────────────────
function openBuildingModal(b?: BuildingResponse) {
  editingBuilding.value = b ?? null
  buildingForm.value = b
    ? { name: b.name, code: b.code, type: b.type ?? '', totalFloors: b.totalFloors ?? null, description: b.description ?? '' }
    : { name: '', code: '', type: '', totalFloors: null, description: '' }
  buildingErrors.value = {}
  buildingSubmitError.value = ''
  showBuildingModal.value = true
}

function closeBuildingModal() {
  showBuildingModal.value = false
}

function validateBuildingForm(): boolean {
  buildingErrors.value = {}
  if (!buildingForm.value.name.trim()) buildingErrors.value.name = 'Tên không được để trống'
  if (!buildingForm.value.code.trim()) buildingErrors.value.code = 'Mã không được để trống'
  return Object.keys(buildingErrors.value).length === 0
}

async function submitBuilding() {
  if (!validateBuildingForm()) return
  submittingBuilding.value = true
  buildingSubmitError.value = ''
  try {
    type BuildingType = 'CHUNG_CU' | 'SHOPHOUSE' | 'VILLAS' | 'OFFICETEL' | 'OTHER'
    const payload = {
      name: buildingForm.value.name.trim(),
      code: buildingForm.value.code.trim(),
      type: (buildingForm.value.type || undefined) as BuildingType | undefined,
      totalFloors: buildingForm.value.totalFloors ?? undefined,
      description: buildingForm.value.description.trim() || undefined,
    }
    if (editingBuilding.value) {
      const res = await zoneService.updateBuilding(editingBuilding.value.id, payload)
      const idx = buildings.value.findIndex(b => b.id === editingBuilding.value!.id)
      if (idx !== -1) buildings.value[idx] = res.data.data
      showToast('success', 'Đã cập nhật tòa nhà')
    } else {
      const res = await zoneService.createBuilding(zoneId, payload)
      buildings.value.push(res.data.data)
      showToast('success', 'Đã thêm tòa nhà')
    }
    closeBuildingModal()
  } catch (e: any) {
    buildingSubmitError.value = e?.response?.data?.message ?? 'Có lỗi xảy ra'
  } finally {
    submittingBuilding.value = false
  }
}

function confirmDeleteBuilding(b: BuildingResponse) {
  deleteBuildingTarget.value = b
}

async function doDeleteBuilding() {
  if (!deleteBuildingTarget.value) return
  deletingBuilding.value = true
  try {
    await zoneService.deleteBuilding(deleteBuildingTarget.value.id)
    buildings.value = buildings.value.filter(b => b.id !== deleteBuildingTarget.value!.id)
    showToast('success', 'Đã xóa tòa nhà')
    deleteBuildingTarget.value = null
  } catch (e: any) {
    showToast('error', e?.response?.data?.message ?? 'Xóa thất bại')
    deleteBuildingTarget.value = null
  } finally {
    deletingBuilding.value = false
  }
}

onMounted(init)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
.line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
</style>
