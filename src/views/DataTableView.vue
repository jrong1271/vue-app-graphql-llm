<script setup lang="ts">
import { ref } from 'vue'
import DeleteTable from '@/components/DeleteTable.vue'
import { sampleTableData } from '@/data/sampleTableData.ts'

const tableData = ref([...sampleTableData])
</script>

<template>
  <div class="table-view">
    <h1>Data Table Example</h1>
    <DeleteTable v-model:tableData="tableData" />
  </div>
</template>

<style scoped>
.table-view {
  padding: 2rem;
}
</style>
