<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
        <li><router-link to="/about">About</router-link></li>

        <li class="dropdown">
          <router-link to="/demo">Demo</router-link>
          <ul class="dropdown-menu">
            <li><router-link to="/demo">Demo</router-link></li>
            <li><router-link to="/demo2">Demo2</router-link></li>
          </ul>
        </li>
      </ul>
    </nav>
    <div class="auth-section">
      <button v-if="authStore.isLoggedIn" @click="logout" class="logout-button">Logout</button>
    </div>
  </header>
</template>

<style scoped>
.app-header nav {
  display: flex;
  align-items: center;
}

.main-menu {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.main-menu li {
  margin-right: 1rem;
  position: relative;
}

.main-menu li:last-child {
  margin-right: 0;
}

.auth-section {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
}

.login-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
}

.login-button:hover {
  background-color: #388e3c;
}

.logout-button {
  background-color: #89a4d7;
  color: white;
  border: none;
  padding: 0.2rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #d32f2f;
}

/* Dropdown styles */
.dropdown {
  position: relative;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 120px;
  z-index: 100;
  flex-direction: column;
}

.dropdown-menu li {
  margin: 0 !important;
  width: 100%;
}

.dropdown-menu li a {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: inherit;
}

.dropdown-menu li a:hover {
  background-color: #f5f5f5;
}

.dropdown:hover .dropdown-menu {
  display: flex;
}
</style>
