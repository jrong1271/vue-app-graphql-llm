<template>
  <div class="calculator">
    <div class="display">
      <!-- TODO: Display the equation above the answer when we get the answer -->
      {{ equation }}
      <span>{{ answer }}</span>
    </div>
    <div class="numbers">
      <!-- TODO: How can we refactor this to avoid duplicate code? -->
      <div class="button" @click="onClickClear">AC</div>
      <div class="button" @click="onPlusMinusModeSwitch">+/-</div>
      <div class="button" @click="onClickButton">%</div>
      <div class="button" @click="onClickButton">9</div>
      <div class="button" @click="onClickButton">8</div>
      <div class="button" @click="onClickButton">7</div>
      <div class="button" @click="onClickButton">6</div>
      <div class="button" @click="onClickButton">5</div>
      <div class="button" @click="onClickButton">4</div>
      <div class="button" @click="onClickButton">3</div>
      <div class="button" @click="onClickButton">2</div>
      <div class="button" @click="onClickButton">1</div>
      <div class="button" @click="onClickButton">0</div>
      <div class="button" @click="onClickButton">.</div>
    </div>
    <div class="operations">
      <div class="button" @click="onClickButton">+</div>
      <div class="button" @click="onClickButton">-</div>
      <div class="button" @click="onClickButton">*</div>
      <div class="button" @click="onClickButton">/</div>
      <div class="button" @click="onSubmit">=</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const equation = ref('')
const answer = ref('')

// TODO: Can this be refactored?
function onClickButton(event) {
  // pass actual value instead of an event
  equation.value += event.target.innerText
}

function onSubmit() {
  // TODO: Implement submit
  if (equation.value.indexOf('+')) {
    const result = equation.value.split('+')
    answer.value = parseInt(result[0]) + parseInt(result[1])
  }
  if (equation.value.indexOf('-')) {
    const result = equation.value.split('-')
    answer.value = parseInt(result[0]) - parseInt(result[1])
  }
  if (equation.value.indexOf('*')) {
    // TODO: multiply not working
    const result = equation.value.split('*')
    answer.value = parseInt(result[0]) * parseInt(result[1])
  }
  if (equation.value.indexOf('/')) {
    const result = equation.value.split('/')
    answer.value = parseInt(result[0]) / parseInt(result[1])
  }
}

function onPlusMinusModeSwitch() {
  let n = equation.value.length
  const ret = []
  // '-9999'
  while (--n) {
    console.log(equation.value[n])
    if (!isNaN(equation.value[n])) {
      ret.push(equation.value[n])
    }
  }
  console.log(ret)
}

function onClickClear() {
  equation.value = ''
}
</script>
<style>
.calculator {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 200px;
  height: 400px;
  background-color: #e6e3e1;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
}
.display {
  height: 150px;
  width: 100%;
  margin-bottom: 16px;
  background-color: #a5b9c7;
}
.numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 160px;
}
.operations {
  display: flex;
  gap: 8px;
  flex-direction: column;
  width: 40px;
}
.button {
  display: flex;
  height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
  background-color: #cccccc;
}
</style>
