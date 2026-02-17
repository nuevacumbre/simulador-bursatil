<!-- src/views/RegisterPage.vue -->
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0">Registro de Usuario</h4>
          </div>
          <div class="card-body">
            <!-- Mostrar error si existe -->
            <div v-if="authStore.error" class="alert alert-danger">
              {{ authStore.error }}
            </div>

            <!-- Mostrar mensaje de éxito temporal (opcional) -->
            <div v-if="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>

            <form @submit.prevent="handleRegister">
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
                  placeholder="Mínimo 6 caracteres"
                  minlength="6"
                />
                <small class="text-muted">La contraseña debe tener al menos 6 caracteres</small>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  required
                  placeholder="Repite tu contraseña"
                />
                <small v-if="password !== confirmPassword && confirmPassword" class="text-danger">
                  Las contraseñas no coinciden
                </small>
              </div>

              <button
                type="submit"
                class="btn btn-success w-100"
                :disabled="authStore.loading || password !== confirmPassword"
              >
                <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ authStore.loading ? 'Registrando...' : 'Registrarse' }}
              </button>
            </form>

            <p class="mt-3 text-center mb-0">
              ¿Ya tienes cuenta?
              <router-link :to="{ name: 'login' }">Inicia sesión aquí</router-link>
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
const confirmPassword = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  // Validación local
  if (password.value !== confirmPassword.value) {
    authStore.error = 'Las contraseñas no coinciden'
    return
  }
  console.log('Enviando registro...')
  // Llamar al store - ESTO AHORA DEVOLVERÁ UN OBJETO
  const result = await authStore.register(email.value, password.value)
  console.log('Resultado recibido:', result)

  // Verificar el resultado
  if (result && result.success) {
    console.log('Registro exitoso, redirigiendo...')
    successMessage.value = 'Registro exitoso. Redirigiendo...'
    setTimeout(() => {
      router.push({ name: 'dashboard' })
    }, 1500)
  } else if (result && result.error) {
    // El error ya está en authStore.error
    console.error('Error en registro:', result.error)
  } else {
    console.log('Resultado inesperado:', result)
  }
}
</script>
