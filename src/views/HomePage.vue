<!-- src/views/HomePage.vue (agregar al final del template) -->
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <h1 class="display-4 mb-4">📈 Simulador Bursátil</h1>
        <p class="lead mb-4">
          Bienvenido al simulador de inversiones. Practica tus estrategias de trading sin riesgo,
          con datos en tiempo real.
        </p>

        <div class="row mt-5">
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">📊 Datos Reales</h5>
                <p class="card-text">
                  Accede a información de activos financieros actualizada en tiempo real.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">🔐 Seguro</h5>
                <p class="card-text">
                  Tu información está protegida con autenticación de Firebase y prácticas seguras.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">🎯 Sin Riesgo</h5>
                <p class="card-text">Practica con dinero virtual antes de invertir dinero real.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <router-link :to="{ name: 'login' }" class="btn btn-primary btn-lg me-3">
            Iniciar Sesión
          </router-link>
          <router-link :to="{ name: 'register' }" class="btn btn-success btn-lg">
            Registrarse
          </router-link>
        </div>

        <!-- 👇 BOTÓN TEMPORAL PARA POBLAR DATOS (visible solo en desarrollo)
        <div v-if="isDevelopment" class="mt-5 pt-4 border-top">
          <h5 class="text-muted mb-3">Administración (solo desarrollo)</h5>
          <button @click="poblarBaseDeDatos" class="btn btn-warning" :disabled="poblando">
            <span v-if="poblando" class="spinner-border spinner-border-sm me-2"></span>
            {{ poblando ? 'Poblando...' : 'Poblar Base de Datos con Activos' }}
          </button>
          <p v-if="mensaje" class="mt-2" :class="mensajeClase">{{ mensaje }}</p>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script setup>
//import { ref } from 'vue' //,computed
//import { poblarActivos } from '@/services/populateData'

// Detectar si estamos en desarrollo
//const isDevelopment = import.meta.env.DEV

//const poblando = ref(false)
//const mensaje = ref('')
//const mensajeClase = ref('')

/*const poblarBaseDeDatos = async () => {
  poblando.value = true
  mensaje.value = ''

  try {
    const resultado = await poblarActivos()

    if (resultado.success) {
      mensaje.value = `✅ ${resultado.count} activos agregados correctamente`
      mensajeClase.value = 'text-success'
    } else {
      mensaje.value = `❌ Error: ${resultado.error}`
      mensajeClase.value = 'text-danger'
    }
  } catch (error) {
    mensaje.value = `❌ Error inesperado: ${error.message}`
    mensajeClase.value = 'text-danger'
  } finally {
    poblando.value = false
  }
}*/
</script>
