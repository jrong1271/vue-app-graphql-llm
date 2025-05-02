import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Use API_LOCAL env variable to switch between local and remote API
  const useLocalApi = env.API_LOCAL === 'true'
  const apiTarget = useLocalApi 
    ? 'http://localhost:4000/' 
    : 'https://0isr0jxbc8.execute-api.us-east-1.amazonaws.com/dev/'
  
  console.log(`Using API target: ${apiTarget}`)
  
  return {
    server: {
      proxy: {
        '/graphql': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [vue(), vueJsx(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
