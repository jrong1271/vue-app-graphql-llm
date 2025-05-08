<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { v4 as uuid } from 'uuid'

import AddInput from './ToDo/AddInput.vue'
import TodoItem from './ToDo/TodoItem.vue'

import { useAddTodo, useGetTodos, useUpdateTodo, useDeleteTodo } from '@/data/graphql/useGraphQL'

interface Todo {
  id: string
  label: string
  checked: boolean
}

const { mutate: addTodoMutation } = useAddTodo()
const { mutate: updateTodoMutation } = useUpdateTodo()
const { mutate: deleteTodoMutation } = useDeleteTodo()

const todos = ref<Todo[]>([])

onMounted(() => {
  const { onResult } = useGetTodos()
  // Apollo Client tries to keep the cache and UI in sync, so when we call updateTodoMutation, it will automatically call the useGetTodos query again
  onResult((result) => {
    // Separate checked and unchecked todos
    const uncheckedTodos = result.data.todos.filter((todo: Todo) => !todo.checked)
    const checkedTodos = result.data.todos.filter((todo: Todo) => todo.checked)

    // Combine unchecked todos first, followed by checked todos
    todos.value = [...uncheckedTodos, ...checkedTodos]
  })
})

function addTodo(label: string) {
  if (!label.trim()) return
  addTodoMutation({ label })

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
    updateTodoMutation({
      id: id,
      checked: checked,
    })
  }
}
function handleDelete(id: string) {
  const index = todos.value.findIndex((todo: Todo) => todo.id === id)
  if (index !== -1) {
    deleteTodoMutation({ id: id })
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
