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
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useRouter } from 'vue-router'

const LOGIN_QUERY = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

const email = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()

const {
  result,
  loading,
  error: queryError,
  refetch,
} = useQuery(LOGIN_QUERY, {
  email: email.value,
  password: password.value,
})

const handleLogin = async () => {
  error.value = null
  try {
    await refetch()
    const token = result.value?.login
    if (token) {
      localStorage.setItem('jwt', token)
      router.push('/home')
    } else {
      throw new Error('Invalid credentials')
    }
  } catch {
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
