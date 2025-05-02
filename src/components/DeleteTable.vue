<!-- Do not modify template -->
<template>
  <div>
    <button @click="deleteRows">Delete Selected Rows</button>
    <table>
      <thead>
        <tr>
          <th>Select</th>
          <th>Name</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData" :key="index">
          <td><input type="checkbox" v-model="selectedRows" :value="item" /></td>
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
})
const emits = defineEmits(['update:tableData'])
// Editable start.
// --- write your code here ---
// Create `selectedRows` and other variables needed.
const selectedRows = new ref([])

function deleteRows() {
  // --- write your code here ---
  const newArray = props.tableData.filter((item) => !selectedRows.value.includes(item))
  selectedRows.value = [] // Clear selected rows after deletion
  // ** Do not forget to emit processed data of table! **
  emits('update:tableData', newArray)
  // ** Do not forget to emit processed data of table! **
}
// Editable end.
</script>
