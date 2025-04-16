import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'

import App from './App.vue'
import router from './router'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

provideApolloClient(apolloClient)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
