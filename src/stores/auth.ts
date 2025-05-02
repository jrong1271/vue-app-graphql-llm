import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: !!localStorage.getItem('jwt'),
    user: null
  }),
  actions: {
    login(token: string, userData = {}) {
      // Store the JWT token in localStorage
      localStorage.setItem('jwt', token)
      this.isLoggedIn = true
      this.user = userData
    },
    logout() {
      localStorage.removeItem('jwt')
      this.isLoggedIn = false
      this.user = null
    },
    checkAuth() {
      // Check if the token exists and is valid
      const token = localStorage.getItem('jwt')
      this.isLoggedIn = !!token
      return this.isLoggedIn
    }
  },
})
