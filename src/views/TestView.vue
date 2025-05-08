<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const message = ref('Hello, this is a test view! Total: ')
console.log('Current route:', route.path)

const arr = [1, 2, 3, 4, 5]
onBeforeMount(() => {
  console.log('Before mount')
})
onMounted(() => {
  console.log('Mounted')
})
function getSum2() {
  let i = 0
  let sum = 0
  function _sum() {
    if (i >= arr.length) {
      return
    }
    sum += arr[i++]
    _sum()
  }
  _sum()
  return sum
}
</script>

<template>
  <div>
    <h1>Test View</h1>
    <p>This is a test view to demonstrate Vue.js component structure.</p>
    <p>{{ message + getSum2() }}</p>
  </div>
</template>
