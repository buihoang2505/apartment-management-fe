import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest } from '@/types/auth'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function initAuth() {
    const stored = localStorage.getItem('token')
    if (stored) {
      token.value = stored
    }
  }

  async function login(credentials: LoginRequest) {
    const res = await authService.login(credentials)
    const tokenResponse = res.data.data
    token.value = tokenResponse.token
    user.value = { username: tokenResponse.username, role: tokenResponse.role }
    localStorage.setItem('token', tokenResponse.token)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isAuthenticated, initAuth, login, logout }
})
