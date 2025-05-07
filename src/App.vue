<script setup>
import AppMenu from './components/AppMenu.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <AppMenu />
  <div class="content-container">
    <RouterView />
  </div>
</template>

<style>
/* Add global styles here if needed */
</style>
