<script setup>
import Todo from '@/components/TodoList.vue'
</script>

<template>
  <div class="todo-container">
    <h1>My ToDo</h1>
    <Todo />
  </div>
</template>
<style scoped>
.todo-container {
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  padding: 1.5em;
  border-radius: 1em;
  width: 300px;
}
</style>
