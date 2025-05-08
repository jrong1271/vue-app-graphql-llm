<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import './AiAssistant.css'

// Update the type definition for Gemini's response format
type GeminiResponse = {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
    finishReason: string
  }>
}

// State
const userInput = ref('')
const messages = ref<Array<{ role: string; content: string; isHtml?: boolean }>>([])
const conversationHistory = ref<Array<{ role: string; content: string }>>([
  { role: 'system', content: 'You are a helpful assistant.' },
])
const isLoading = ref(false)
const errorMessage = ref('')
const apiKey = ref(import.meta.env.VITE_GEMINI_API_KEY || '')
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

// Update the API request function
async function makeApiRequest(
  messages: Array<{ role: string; content: string }>,
): Promise<GeminiResponse> {
  try {
    // Convert conversation history to Gemini format
    const content = {
      contents: [
        {
          parts: [
            {
              text: messages[messages.length - 1].content,
            },
          ],
        },
      ],
    }

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      content,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey.value,
        },
        timeout: 30000,
      },
    )
    return response.data
  } catch (error: unknown) {
    console.error('Error in makeApiRequest:', error)
    throw new Error('Failed to communicate with the Gemini API.')
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

// Add a function to format the response
async function formatResponse(text: string): Promise<string> {
  // Parse markdown and sanitize HTML
  const sanitizedHtml = DOMPurify.sanitize(marked.parse(text), {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
  })
  return sanitizedHtml
}

// Update the sendMessage function
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
      const rawMessage =
        response.candidates[0]?.content?.parts[0]?.text || 'No response from assistant.'

      // Format the response before adding it to messages
      const formattedMessage = await formatResponse(rawMessage)

      messages.value.push({
        role: 'assistant',
        content: formattedMessage,
        isHtml: true, // Add this flag to identify formatted messages
      })
      conversationHistory.value.push({
        role: 'assistant',
        content: rawMessage, // Keep original text in conversation history
      })

      // Trim conversation history to avoid token limits
      if (conversationHistory.value.length > 10) {
        const systemMessage = conversationHistory.value[0]
        conversationHistory.value = [systemMessage, ...conversationHistory.value.slice(-9)]
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error in sendMessage:', error)
      } else {
        console.error('Unknown error in sendMessage:', error)
      }
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
          <strong>{{ message.role === 'user' ? 'You' : 'Gemini' }}</strong>
        </div>
        <div class="message-content" v-if="message.isHtml" v-html="message.content"></div>
        <div class="message-content" v-else>{{ message.content }}</div>
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
/* Add these styles for formatted content */
:deep(.message-content) {
  code {
    background-color: #f4f4f4;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
  }

  pre {
    background-color: #f4f4f4;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
  }

  p {
    margin: 0.5rem 0;
  }

  ul,
  ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  blockquote {
    border-left: 4px solid #ddd;
    margin: 0.5rem 0;
    padding-left: 1rem;
    color: #666;
  }

  a {
    color: #0066cc;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
}
</style>
