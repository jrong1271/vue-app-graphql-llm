<template>
  <div class="calculator">
    <div class="display">
      <div class="equation">{{ equation }}</div>
      <div class="result">{{ answer }}</div>
    </div>
    <div class="numbers">
      <div class="button" @click="onClickClear">AC</div>
      <div class="button" @click="onPlusMinusModeSwitch">+/-</div>
      <div class="button" @click="onClickPercent">%</div>
      <div class="button" @click="onClickButton('7')">7</div>
      <div class="button" @click="onClickButton('8')">8</div>
      <div class="button" @click="onClickButton('9')">9</div>
      <div class="button" @click="onClickButton('4')">4</div>
      <div class="button" @click="onClickButton('5')">5</div>
      <div class="button" @click="onClickButton('6')">6</div>
      <div class="button" @click="onClickButton('1')">1</div>
      <div class="button" @click="onClickButton('2')">2</div>
      <div class="button" @click="onClickButton('3')">3</div>
      <div class="button" @click="onClickButton('0')">0</div>
      <div class="button" @click="onClickButton('.')">.</div>
    </div>
    <div class="operations">
      <div class="button" @click="onClickButton('+')">+</div>
      <div class="button" @click="onClickButton('-')">-</div>
      <div class="button" @click="onClickButton('*')">*</div>
      <div class="button" @click="onClickButton('/')">/</div>
      <div class="button" @click="onSubmit">=</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const equation = ref('')
const answer = ref('')
const lastOperation = ref('')
const calculationDone = ref(false)

// Refactored to pass the value directly instead of using event
function onClickButton(value: string) {
  // If we just completed a calculation and start typing a new number
  if (calculationDone.value && !isOperator(value)) {
    equation.value = value
    answer.value = ''
    calculationDone.value = false
  }
  // If we just completed a calculation and press an operator, continue with the result
  else if (calculationDone.value && isOperator(value)) {
    equation.value = answer.value + value
    calculationDone.value = false
  } else {
    equation.value += value
  }
}

function isOperator(value: string): boolean {
  return ['+', '-', '*', '/'].includes(value)
}

function onSubmit() {
  try {
    // Store the equation for display
    const currentEquation = equation.value

    // Use a safer approach than eval
    const result = calculateResult(equation.value)

    // Update the answer and equation display
    answer.value = result.toString()

    // Set flag that calculation is done
    calculationDone.value = true
  } catch (error) {
    answer.value = 'Error'
  }
}

function calculateResult(expr: string): number {
  // Handle basic operations with proper operator precedence
  // This is a simple implementation - for a real calculator, consider using a proper expression parser

  // Replace all occurrences of % with /100
  expr = expr.replace(/%/g, '/100')

  // First, handle multiplication and division
  const tokens = tokenize(expr)
  let i = 1
  while (i < tokens.length - 1) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      const left = parseFloat(tokens[i - 1])
      const right = parseFloat(tokens[i + 1])
      let result

      if (tokens[i] === '*') {
        result = left * right
      } else {
        if (right === 0) throw new Error('Division by zero')
        result = left / right
      }

      // Replace the operation and operands with the result
      tokens.splice(i - 1, 3, result.toString())
      i = 1 // Reset to check from beginning
    } else {
      i += 2
    }
  }

  // Then handle addition and subtraction
  let result = parseFloat(tokens[0])
  for (i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i]
    const operand = parseFloat(tokens[i + 1])

    if (operator === '+') {
      result += operand
    } else if (operator === '-') {
      result -= operand
    }
  }

  return result
}

function tokenize(expr: string): string[] {
  // Convert expression string to tokens (numbers and operators)
  const tokens = []
  let currentNumber = ''

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i]

    if (isOperator(char)) {
      if (currentNumber) {
        tokens.push(currentNumber)
        currentNumber = ''
      }
      tokens.push(char)
    } else {
      currentNumber += char
    }
  }

  if (currentNumber) {
    tokens.push(currentNumber)
  }

  return tokens
}

function onPlusMinusModeSwitch() {
  // If there's no equation yet, just add a negative sign
  if (!equation.value) {
    equation.value = '-'
    return
  }

  // Find the last number in the equation
  const tokens = tokenize(equation.value)
  if (tokens.length > 0) {
    const lastToken = tokens[tokens.length - 1]

    // If the last token is a number
    if (!isOperator(lastToken)) {
      if (lastToken.startsWith('-')) {
        // Remove the negative sign
        tokens[tokens.length - 1] = lastToken.substring(1)
      } else {
        // Add a negative sign
        tokens[tokens.length - 1] = '-' + lastToken
      }

      // Reconstruct the equation
      equation.value = tokens.join('')
    } else {
      // If the last token is an operator, add a negative sign for the next number
      equation.value += '-'
    }
  }
}

function onClickPercent() {
  // Add % to the equation
  equation.value += '%'
}

function onClickClear() {
  equation.value = ''
  answer.value = ''
  calculationDone.value = false
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
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.equation {
  font-size: 16px;
  text-align: right;
  color: #333;
  min-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.result {
  font-size: 24px;
  font-weight: bold;
  text-align: right;
  color: #000;
  min-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.button:hover {
  background-color: #bbbbbb;
}
.button:active {
  background-color: #aaaaaa;
}
</style>
