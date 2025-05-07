<script setup lang="ts">
import { ref } from 'vue'

const { onAddTodo } = defineProps<{
  onAddTodo: (label: string) => void
}>()

const input = ref('')

function addTodo() {
  if (!input.value.trim()) return

  onAddTodo(input.value)
  input.value = ''
}
</script>

<template>
  <div class="add-input">
    <input type="text" v-model="input" placeholder="Enter a todo" />
    <span class="add-icon" @click="addTodo">➕</span>
  </div>
</template>

<style scoped>
.add-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.add-icon {
  font-size: 1.5rem;
  color: #4caf50;
  cursor: pointer;
  transition: color 0.2s ease;
}

.add-icon:hover {
  color: #388e3c;
}
</style>
