<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import './AppMenu.css'
const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('login')
}
</script>

<template>
  <header class="app-header">
    <nav>
      <ul class="main-menu">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/ai">Ai Bot</router-link></li>
        <li><router-link to="/test">Test</router-link></li>
        <li class="dropdown">
          <a href="#">Application Demo</a>
          <ul class="dropdown-menu">
            <li><router-link to="/calculator">Calculator</router-link></li>
            <li><router-link to="/data-table">Data Table</router-link></li>
          </ul>
        </li>
      </ul>
    </nav>
    <div class="auth-section">
      <button v-if="authStore.isLoggedIn" @click="logout" class="logout-button">Logout</button>
    </div>
  </header>
</template>
