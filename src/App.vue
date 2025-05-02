<script setup>
import Menu from './components/Menu.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <Menu />
  <div class="content-container">
    <RouterView />
  </div>
</template>

<style>
.content-container {
  padding: 20px;
  margin: 0 auto;
  max-width: 900px;
  text-align: center;
}
/* Add global styles here if needed */
</style>
