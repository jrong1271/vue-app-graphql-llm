<script setup lang="ts">
import { defineProps } from 'vue'

const { id, label, checked, onChange, onDelete } = defineProps<{
  id: string
  label: string
  checked: boolean
  onChange: (id: string, checked: boolean) => void
  onDelete: (id: string) => void
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  onChange(id, target.checked)
}

const handleDelete = () => {
  onDelete(id)
}
</script>

<template>
  <div class="todo-item">
    <input class="task_toggle" type="checkbox" :checked="checked" @change="handleChange" />
    <span :class="{ completed: checked }">{{ label }}</span>
    <span class="delete-icon" @click="handleDelete">x</span>
  </div>
</template>

<style scoped>
.completed {
  text-decoration: line-through;
  color: gray;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
  position: relative;
}

.delete-icon {
  font-size: 1.4rem;
  color: red;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.todo-item:hover .delete-icon {
  opacity: 1;
}
</style>
