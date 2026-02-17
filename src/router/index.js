// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Importar nuestro store
//import { useAuthStore } from '/src/stores/auth'
// Definimos las rutas (aún no las hemos creado, pero ya las declaramos)
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'), // Página pública
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
    // Meta: solo para no autenticados (si ya está logueado, que no vea el login)
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    // *** RUTA PROTEGIDA ***
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// *** GUARDIA DE NAVEGACIÓN (El portero) ***
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Si la ruta requiere autenticación y el usuario NO está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  }
  // Si la ruta es solo para invitados (login/register) y el usuario SÍ está autenticado
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' }) // Lo mandamos al dashboard
  }
  // En cualquier otro caso, dejamos pasar
  else {
    next()
  }
})

export default router
