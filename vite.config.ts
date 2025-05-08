import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  // const apiTarget = useLocalApi
  //   ? 'http://localhost:4000/'
  //   : 'https://0isr0jxbc8.execute-api.us-east-1.amazonaws.com/dev/'

  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000/',
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
})
