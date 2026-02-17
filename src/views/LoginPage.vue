<!-- src/views/LoginPage.vue -->
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Iniciar Sesión</h4>
          </div>
          <div class="card-body">
            <!-- Mostrar error si existe -->
            <div v-if="authStore.error" class="alert alert-danger">
              {{ authStore.error }}
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="authStore.loading">
                <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ authStore.loading ? 'Ingresando...' : 'Ingresar' }}
              </button>
            </form>

            <p class="mt-3 text-center mb-0">
              ¿No tienes cuenta?
              <router-link :to="{ name: 'register' }">Regístrate aquí</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const result = await authStore.login(email.value, password.value)
  if (result.success) {
    router.push({ name: 'dashboard' })
  }
}
</script>
