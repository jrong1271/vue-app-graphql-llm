<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const userInput = ref('')
const messages = ref<string[]>([])

async function sendMessage() {
  if (userInput.value.trim()) {
    const userMessage = userInput.value
    messages.value.push(`You: ${userMessage}`)
    userInput.value = ''

    try {
      const response = await makeRequestWithRetry(userMessage)
      const assistantMessage = response.data.choices[0].message.content
      messages.value.push(`Assistant: ${assistantMessage}`)
    } catch (error) {
      console.error('Error communicating with ChatGPT API:', error)
      messages.value.push('Assistant: Sorry, there was an error processing your request.')
    }
  }
}

async function makeRequestWithRetry(userMessage: string, retries = 3, delay = 1000): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: userMessage }],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      )
    } catch (error: any) {
      if (error.response && error.response.status === 429 && attempt < retries - 1) {
        console.warn(`Rate limit hit. Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
      } else {
        throw error
      }
    }
  }
  throw new Error('Max retries reached')
}
</script>

<template>
  <div class="ai-assistant">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        {{ message }}
      </div>
    </div>
    <div class="input-container">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<style scoped>
.ai-assistant {
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
  background-color: #fff;
}

.message {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.input-container {
  display: flex;
  gap: 0.5rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
