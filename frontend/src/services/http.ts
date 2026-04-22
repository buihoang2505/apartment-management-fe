import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT, fix FormData Content-Type
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // For FormData, delete the default 'application/json' so the browser
  // can set 'multipart/form-data; boundary=...' automatically
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

// Response interceptor — handle 401/403 (expired or missing token)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const isAuthEndpoint = error.config?.url?.includes('/auth')
    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      useAuthStore().logout()
      useToastStore().show('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default http
