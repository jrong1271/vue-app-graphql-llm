<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="app-header">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/demo">Demo</router-link></li>
        <li v-if="!authStore.isLoggedIn"><router-link to="/login">Login</router-link></li>
        <li v-else><button @click="logout">Logout</button></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.app-header nav ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.app-header nav ul li {
  margin-right: 1rem;
}

.app-header nav ul li:last-child {
  margin-right: 0;
}
</style>
