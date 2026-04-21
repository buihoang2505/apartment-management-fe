import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest } from '@/types/auth'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user  = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin         = computed(() => user.value?.role === 'ADMIN')

  function initAuth() {
    const storedToken = localStorage.getItem('token')
    const storedUser  = localStorage.getItem('user')
    if (storedToken) token.value = storedToken
    if (storedUser) {
      try { user.value = JSON.parse(storedUser) } catch { /* ignore */ }
    }
  }

  async function login(credentials: LoginRequest) {
    const res = await authService.login(credentials)
    const data = res.data.data

    token.value = data.token
    user.value  = { username: data.username, role: data.role }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(user.value))

    // Nếu login không trả về role → gọi thêm /admin/users/me
    if (!data.role) {
      try {
        const me = await authService.getMe()
        const meData = me.data?.data ?? me.data
        user.value = { username: meData.username ?? data.username, role: meData.role ?? 'USER' }
        localStorage.setItem('user', JSON.stringify(user.value))
      } catch { /* giữ nguyên */ }
    }
  }

  function updateUser(patch: Partial<User>) {
    if (!user.value) return
    user.value = { ...user.value, ...patch }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, isAdmin, initAuth, login, updateUser, logout }
})
