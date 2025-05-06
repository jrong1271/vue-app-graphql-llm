<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import './AiAssistant.css'

// State
const userInput = ref('')
const messages = ref<Array<{ role: string; content: string }>>([])
const conversationHistory = ref<Array<{ role: string; content: string }>>([
  { role: 'system', content: 'You are a helpful assistant.' },
])
const isLoading = ref(false)
const errorMessage = ref('')
const apiKey = ref(import.meta.env.VITE_OPENAI_API_KEY || '')
const messagesContainer = ref<HTMLElement | null>(null)

// Queue and rate-limiting state
const requestQueue = ref<Array<() => Promise<void>>>([])
const isProcessingQueue = ref(false)

// Add a welcome message on mount
onMounted(() => {
  messages.value.push({
    role: 'assistant',
    content: 'Hello! How can I help you today?',
  })
})

// Auto-scroll to the bottom when messages change
watch(
  () => messages.value.length,
  async () => {
    await nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  },
)

// Simplified API request function
async function makeApiRequest(messages: Array<{ role: string; content: string }>): Promise<any> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey.value}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      },
    )
    return response.data
  } catch (error: any) {
    console.error('Error in makeApiRequest:', error)
    throw new Error('Failed to communicate with the API.')
  }
}

// Simplified queue processing
async function processQueue() {
  if (isProcessingQueue.value || requestQueue.value.length === 0) return

  isProcessingQueue.value = true
  while (requestQueue.value.length > 0) {
    const nextRequest = requestQueue.value.shift()
    if (nextRequest) {
      try {
        await nextRequest()
      } catch (error) {
        console.error('Error processing request:', error)
      }
    }
  }
  isProcessingQueue.value = false
}

// Add a request to the queue
function queueRequest(requestFn: () => Promise<void>) {
  requestQueue.value.push(requestFn)
  processQueue()
}

// Send a message
async function sendMessage() {
  if (!userInput.value.trim()) return
  if (!apiKey.value) {
    errorMessage.value = 'API key is missing. Please check your environment variables.'
    return
  }

  const userMessage = userInput.value
  userInput.value = ''

  // Add user message to UI and conversation history
  messages.value.push({ role: 'user', content: userMessage })
  conversationHistory.value.push({ role: 'user', content: userMessage })

  // Show loading state
  isLoading.value = true
  errorMessage.value = ''

  // Queue the API request
  queueRequest(async () => {
    try {
      const response = await makeApiRequest(conversationHistory.value)
      const assistantMessage =
        response.choices[0]?.message?.content || 'No response from assistant.'

      // Add assistant response to UI and conversation history
      messages.value.push({ role: 'assistant', content: assistantMessage })
      conversationHistory.value.push({ role: 'assistant', content: assistantMessage })

      // Trim conversation history to avoid token limits
      if (conversationHistory.value.length > 10) {
        const systemMessage = conversationHistory.value[0]
        conversationHistory.value = [systemMessage, ...conversationHistory.value.slice(-9)]
      }
    } catch (error: any) {
      errorMessage.value = error.message || 'An error occurred while processing your request.'
      messages.value.push({
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again later.',
      })
    } finally {
      isLoading.value = false
    }
  })
}
</script>

<template>
  <div class="ai-assistant">
    <div class="messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']"
      >
        <div class="message-header">
          <strong>{{ message.role === 'user' ? 'You' : 'Assistant' }}</strong>
        </div>
        <div class="message-content">{{ message.content }}</div>
      </div>
      <div v-if="isLoading" class="message assistant-message loading">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="input-container">
      <textarea
        v-model="userInput"
        @keyup.enter.exact.prevent="sendMessage"
        placeholder="Type a message..."
        :disabled="isLoading"
        rows="2"
      ></textarea>
      <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">
        <span v-if="!isLoading">Send</span>
        <span v-else class="button-loader"></span>
      </button>
    </div>
  </div>
</template>
