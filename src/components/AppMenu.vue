<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import './AppMenu.css'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const activeLink = ref(route.path)

const setActiveLink = (path: string) => {
  activeLink.value = path
}

const logout = () => {
  authStore.logout()
  router.push('login')
}
</script>

<template>
  <header class="app-header">
    <nav>
      <ul class="main-menu">
        <li>
          <router-link to="/" :class="{ active: activeLink === '/' }" @click="setActiveLink('/')"
            >Home</router-link
          >
        </li>
        <li>
          <router-link
            to="/ai"
            :class="{ active: activeLink === '/ai' }"
            @click="setActiveLink('/ai')"
            >Ai Bot</router-link
          >
        </li>
        <li>
          <router-link
            to="/test"
            :class="{ active: activeLink === '/test' }"
            @click="setActiveLink('/test')"
            >Test</router-link
          >
        </li>
        <li class="dropdown">
          <a
            href="#"
            :class="{
              active:
                activeLink.startsWith('/todo') ||
                activeLink.startsWith('/calculator') ||
                activeLink.startsWith('/data-table'),
            }"
          >
            Apps
          </a>
          <ul class="dropdown-menu">
            <li>
              <router-link
                to="/todo"
                :class="{ active: activeLink === '/todo' }"
                @click="setActiveLink('/todo')"
                >To Do List</router-link
              >
            </li>
            <li>
              <router-link
                to="/calculator"
                :class="{ active: activeLink === '/calculator' }"
                @click="setActiveLink('/calculator')"
                >Calculator</router-link
              >
            </li>
            <li>
              <router-link
                to="/data-table"
                :class="{ active: activeLink === '/data-table' }"
                @click="setActiveLink('/data-table')"
                >Data Table</router-link
              >
            </li>
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
/* Add these styles to your existing CSS */
.router-link-active,
.active {
  color: #4caf50 !important;
  font-weight: bold;
}

.dropdown a.active {
  color: #4caf50 !important;
  font-weight: bold;
}

.dropdown-menu .router-link-active,
.dropdown-menu .active {
  background-color: #f0f0f0;
  color: #4caf50 !important;
}

/* Ensure the dropdown items maintain visibility when active */
.dropdown:hover .dropdown-menu {
  display: block;
}

/* Add a subtle transition for the highlight effect */
.router-link-active,
.active,
a {
  transition: color 0.3s ease;
}
</style>
