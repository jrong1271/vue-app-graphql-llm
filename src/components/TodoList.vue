<script setup lang="ts">
import { ref, watch } from 'vue'
import { v4 as uuid } from 'uuid'

import AddInput from './ToDo/AddInput.vue'
import TodoItem from './ToDo/TodoItem.vue'
interface Todo {
  id: string
  label: string
  checked: boolean
}
const storeTodos = JSON.parse(localStorage.getItem('todos') || '[]')
if (storeTodos.length <= 0) {
  localStorage.setItem(
    'todos',
    JSON.stringify([
      {
        id: uuid(),
        label: 'Buy groceries',
        checked: false,
      },
      {
        id: uuid(),
        label: 'Reboot computer',
        checked: false,
      },
      {
        id: uuid(),
        label: 'Ace CoderPad interview',
        checked: true,
      },
    ]),
  )
}
const todos = ref(JSON.parse(localStorage.getItem('todos') || '[]'))

watch(
  todos,
  (newTodos) => {
    localStorage.setItem('todos', JSON.stringify(newTodos))
  },
  { deep: true },
)

function addTodo(label: string) {
  if (!label.trim()) return

  todos.value.push({
    id: uuid(),
    label: label,
    checked: false,
  })
  console.log('Todo added:', label)
}

function handleChange(id: string, checked: boolean) {
  const todo = todos.value.find((todo: Todo) => todo.id === id)
  if (todo) {
    todo.checked = checked
  }
}
function handleDelete(id: string) {
  const index = todos.value.findIndex((todo: Todo) => todo.id === id)
  if (index !== -1) {
    todos.value.splice(index, 1)
  }
}
</script>

<template>
  <AddInput :onAddTodo="addTodo" />
  <TodoItem
    v-for="todo in todos"
    :key="todo.id"
    :id="todo.id"
    :label="todo.label"
    :checked="todo.checked"
    :onChange="handleChange"
    :onDelete="handleDelete"
  />
</template>
