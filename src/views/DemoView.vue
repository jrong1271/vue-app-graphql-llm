<template>
  <v-container class="demo">
    <Wrapper>
      <template #default>
        <h1>Demo View</h1>
        <p>This is a demonstration view.</p>
      </template>
    </Wrapper>
  </v-container>
</template>

<script setup lang="ts">
import Wrapper from '@/components/Wrapper.vue'
</script>
