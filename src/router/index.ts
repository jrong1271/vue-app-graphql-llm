import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AIView from '../views/AIView.vue'
import DemoView from '../views/DemoView.vue'
import DemoView2 from '../views/DemoView2.vue'
import TestView from '../views/TestView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Root',
      redirect: '/home',
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: AIView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/demo',
      name: 'Demo',
      component: DemoView,
      meta: { requiresAuth: true },
    },
    {
      path: '/demo2',
      name: 'Demo2',
      component: DemoView2,
      meta: { requiresAuth: true },
    },
    {
      path: '/test',
      name: 'Test',
      component: TestView,
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard to check JWT authentication
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Check if user is authenticated
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isLoggedIn && localStorage.getItem('jwt')

  // If route is login and user is already authenticated, redirect to home
  if (to.path === '/login' && isAuthenticated) {
    next('/home')
    return
  }

  // If route doesn't require auth, proceed
  if (!requiresAuth) {
    next()
    return
  }

  // Handle protected routes
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    next('/login')
  } else {
    // Proceed to route if authenticated
    next()
  }
})

export default router
