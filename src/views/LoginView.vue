<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
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
const router = useRouter()
const authStore = useAuthStore()

const { mutate: login, loading, error: mutationError } = useMutation(LOGIN_MUTATION)

const handleLogin = async () => {
  error.value = null
  console.log('Email:', email.value)
  console.log('Password:', password.value)

  try {
    const { data } = await login({
      email: email.value,
      password: password.value,
    })

    const token = data?.login
    if (token) {
      // Use the auth store to properly set the login state
      authStore.login(token)

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
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
