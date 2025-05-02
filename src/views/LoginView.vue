<template>
  <div class="login-page">
    <div class="login-modal">
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-container">
            <i class="icon email-icon">✉️</i>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="your@email.com"
              required
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-container">
            <i class="icon password-icon">🔒</i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              required
              :disabled="loading"
            />
            <i class="icon toggle-password" @click="showPassword = !showPassword">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </i>
          </div>
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div v-if="error" class="error-container">
        <i class="error-icon">⚠️</i>
        <p class="error-message">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

const email = ref('')
const password = ref('')
const error = ref(null)
const showPassword = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const { mutate: login, loading, error: mutationError } = useMutation(LOGIN_MUTATION)

const handleLogin = async () => {
  error.value = null

  try {
    const { data } = await login({
      email: email.value,
      password: password.value,
    })

    const token = data?.login?.token
    const user = data?.login?.user

    if (token) {
      // Use the auth store to properly set the login state
      authStore.login(token, user)

      // Redirect to home page
      router.push('/home')
    } else {
      throw new Error('Invalid credentials')
    }
  } catch (e) {
    console.error('Login error:', e)
    error.value = 'Login failed. Please check your credentials.'
  }
}
</script>

<style scoped>
.login-modal {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  padding: 30px 30px 20px;
  text-align: center;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
}

.login-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  margin: 10px 0 0;
  opacity: 0.9;
  font-size: 16px;
}

.login-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  position: absolute;
  left: 12px;
  font-size: 16px;
  color: #666;
}

.toggle-password {
  left: auto;
  right: 12px;
  cursor: pointer;
}

input[type='email'],
input[type='password'],
input[type='text'] {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input[type='email']:focus,
input[type='password']:focus,
input[type='text']:focus {
  border-color: #6e8efb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.2);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-me input {
  margin-right: 8px;
}

.forgot-password {
  color: #6e8efb;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #5f6d9c, #77d6e3);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(110, 142, 251, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  display: flex;
  align-items: center;
  margin: 0 30px 20px;
  padding: 12px;
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  color: #e53e3e;
}

.error-icon {
  margin-right: 10px;
  font-size: 18px;
}

.error-message {
  margin: 0;
  font-size: 14px;
}

.login-footer {
  padding: 20px 30px;
  text-align: center;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #666;
}

.login-footer a {
  color: #6e8efb;
  text-decoration: none;
  font-weight: 600;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
