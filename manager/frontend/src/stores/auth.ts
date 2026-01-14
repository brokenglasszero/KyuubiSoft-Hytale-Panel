import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type TokenResponse } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const username = ref<string | null>(localStorage.getItem('username'))

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value)

  // Actions
  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  }

  function setUser(name: string) {
    username.value = name
    localStorage.setItem('username', name)
  }

  async function login(credentials: { username: string; password: string }) {
    const response = await authApi.login(credentials)
    setTokens(response.access_token, response.refresh_token)
    setUser(credentials.username)
    return response
  }

  async function refresh() {
    if (!refreshToken.value) {
      throw new Error('No refresh token')
    }
    const response = await authApi.refresh(refreshToken.value)
    setTokens(response.access_token, response.refresh_token)
    return response
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    username.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('username')
  }

  return {
    // State
    accessToken,
    refreshToken,
    username,
    // Getters
    isAuthenticated,
    // Actions
    setTokens,
    setUser,
    login,
    refresh,
    logout,
  }
})
