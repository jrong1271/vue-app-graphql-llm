<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'

const userInput = ref('')
const messages = ref<Array<{role: string, content: string}>>([])
const conversationHistory = ref<Array<{role: string, content: string}>>([
  { role: 'system', content: 'You are a helpful assistant.' }
])
const isLoading = ref(false)
const errorMessage = ref('')
const apiKey = ref(import.meta.env.VITE_OPENAI_API_KEY || '')
const messagesContainer = ref<HTMLElement | null>(null)

// Rate limiting parameters
const requestQueue = ref<Array<() => Promise<void>>>([])
const isProcessingQueue = ref(false)
const requestsPerMinute = 3 // Adjust based on your API tier
const lastRequestTimestamps = ref<number[]>([])

onMounted(() => {
  // Add a welcome message
  messages.value.push({ 
    role: 'assistant', 
    content: 'Hello! How can I help you today?' 
  })
})

// Auto-scroll to bottom when messages change
watch(() => messages.value.length, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})

async function sendMessage() {
  if (!userInput.value.trim()) return
  if (!apiKey.value) {
    errorMessage.value = 'API key is missing. Please check your environment variables.'
    return
  }

  const userMessage = userInput.value
  userInput.value = ''
  
  // Add user message to UI
  messages.value.push({ role: 'user', content: userMessage })
  
  // Add user message to conversation history
  conversationHistory.value.push({ role: 'user', content: userMessage })
  
  // Show loading state
  isLoading.value = true
  errorMessage.value = ''
  
  // Queue the API request
  queueRequest(async () => {
    try {
      const response = await makeApiRequest(conversationHistory.value)
      
      if (response && response.data && response.data.choices && response.data.choices[0]) {
        const assistantMessage = response.data.choices[0].message.content
        
        // Add assistant response to UI
        messages.value.push({ role: 'assistant', content: assistantMessage })
        
        // Add to conversation history
        conversationHistory.value.push({ role: 'assistant', content: assistantMessage })
        
        // Trim conversation history if it gets too long (to avoid token limits)
        if (conversationHistory.value.length > 10) {
          // Keep system message and last 9 exchanges
          const systemMessage = conversationHistory.value[0]
          conversationHistory.value = [
            systemMessage,
            ...conversationHistory.value.slice(-9)
          ]
        }
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (error: any) {
      console.error('Error communicating with ChatGPT API:', error)
      errorMessage.value = error.message || 'An error occurred while processing your request'
      messages.value.push({ 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request. Please try again later.' 
      })
    } finally {
      isLoading.value = false
    }
  })
}

function queueRequest(requestFn: () => Promise<void>) {
  requestQueue.value.push(requestFn)
  processQueue()
}

async function processQueue() {
  if (isProcessingQueue.value || requestQueue.value.length === 0) return
  
  isProcessingQueue.value = true
  
  try {
    // Check if we're within rate limits
    const now = Date.now()
    const oneMinuteAgo = now - 60000
    
    // Remove timestamps older than 1 minute
    lastRequestTimestamps.value = lastRequestTimestamps.value.filter(
      timestamp => timestamp > oneMinuteAgo
    )
    
    // If we've made too many requests in the last minute, wait
    if (lastRequestTimestamps.value.length >= requestsPerMinute) {
      const oldestTimestamp = lastRequestTimestamps.value[0]
      const timeToWait = 60000 - (now - oldestTimestamp) + 100 // Add 100ms buffer
      
      console.log(`Rate limit would be exceeded. Waiting ${timeToWait}ms before next request.`)
      await new Promise(resolve => setTimeout(resolve, timeToWait))
    }
    
    // Process the next request
    const nextRequest = requestQueue.value.shift()
    if (nextRequest) {
      // Record this request timestamp
      lastRequestTimestamps.value.push(Date.now())
      
      // Execute the request
      await nextRequest()
    }
  } catch (error) {
    console.error('Error processing queue:', error)
  } finally {
    isProcessingQueue.value = false
    
    // If there are more requests in the queue, process the next one
    if (requestQueue.value.length > 0) {
      processQueue()
    }
  }
}

async function makeApiRequest(messages: Array<{role: string, content: string}>, retries = 3): Promise<any> {
  let delay = 2000 // Start with a 2-second delay
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo', // Using a more stable model, change as needed
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey.value}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000 // 30 second timeout
        }
      )
    } catch (error: any) {
      console.error(`API request attempt ${attempt + 1} failed:`, error)
      
      // Handle different error types
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status
        
        if (status === 429) {
          // Rate limit error - get retry delay from headers if available
          const retryAfter = error.response.headers['retry-after']
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay
          
          console.warn(`Rate limit hit. Retrying in ${waitTime}ms...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          delay *= 2 // Exponential backoff
          continue // Try again
        } else if (status === 401 || status === 403) {
          throw new Error('Authentication error. Please check your API key.')
        } else if (status >= 500) {
          // Server error, retry with backoff
          if (attempt < retries - 1) {
            console.warn(`Server error (${status}). Retrying in ${delay}ms...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            delay *= 2 // Exponential backoff
            continue // Try again
          }
        }
      } else if (error.request) {
        // The request was made but no response was received
        if (attempt < retries - 1) {
          console.warn(`No response received. Retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          delay *= 2 // Exponential backoff
          continue // Try again
        }
      }
      
      // If we get here, we've either exhausted retries or hit a non-retryable error
      throw error
    }
  }
  
  throw new Error('Max retries reached')
}
</script>

<template>
  <div class="ai-assistant">
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" 
           :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']">
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

<style scoped>
.ai-assistant {
  display: flex;
  flex-direction: column;
  height: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  animation: fadeIn 0.3s ease;
  word-break: break-word;
}

.user-message {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}

.assistant-message {
  align-self: flex-start;
  background-color: #e9ecef;
  color: #212529;
  border-bottom-left-radius: 4px;
}

.message-header {
  margin-bottom: 4px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.message-content {
  line-height: 1.5;
}

.error-message {
  padding: 10px;
  margin: 0 1rem 1rem;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.input-container {
  display: flex;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #eaeaea;
  gap: 0.5rem;
}

textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button {
  padding: 0 1.5rem;
  height: 40px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Loading indicators */
.loading {
  background-color: transparent;
  padding: 8px 16px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #adb5bd;
  border-radius: 50%;
  animation: bounce 1.5s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

.button-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s infinite linear;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>