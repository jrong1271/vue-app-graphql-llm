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
.content-container {
  padding: 20px;
  margin: 0 auto;
}
/* Add global styles here if needed */
</style>
