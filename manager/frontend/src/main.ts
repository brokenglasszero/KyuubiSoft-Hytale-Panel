import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from './i18n'
import App from './App.vue'

import './assets/styles/main.css'

// Import views
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Console from './views/Console.vue'
import Backups from './views/Backups.vue'
import Players from './views/Players.vue'
import Settings from './views/Settings.vue'

// Import auth store
import { useAuthStore } from './stores/auth'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/console',
      name: 'console',
      component: Console,
      meta: { requiresAuth: true },
    },
    {
      path: '/backups',
      name: 'backups',
      component: Backups,
      meta: { requiresAuth: true },
    },
    {
      path: '/players',
      name: 'players',
      component: Players,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Create app
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(i18n)

// Navigation guard (must be after pinia is installed)
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

app.use(router)
app.mount('#app')
