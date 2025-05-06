<template>
  <DeleteTable :table-data="data" @update:table-data="updateData" />
</template>

<script lang="ts" setup>
import { isRef, ref, unref } from 'vue'
import DeleteTable from '@/components/DeleteTable.vue'

const data = ref([
  {
    name: 'Tom',
    age: 22,
  },
  {
    name: 'Jerry',
    age: 20,
  },
  {
    name: 'Jack',
    age: 26,
  },
  {
    name: 'Rose',
    age: 23,
  },
  {
    name: 'Bob',
    age: 30,
  },
  {
    name: 'Mike',
    age: 27,
  },
])
const isWrong = ref(false)

function updateData(newVal) {
  if (isRef(newVal)) {
    isWrong.value = true
  } else {
    data.value = unref(newVal)
  }
}
</script>

<style scoped></style>
