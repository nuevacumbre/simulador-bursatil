<!-- src/views/Dashboard.vue -->
<template>
  <div class="container mt-4">
    <!-- Header con info del usuario -->
    <div class="row mb-4">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2>Bienvenido, {{ authStore.userEmail }}</h2>
            <small class="text-muted"> Última actualización: {{ ultimaActualizacion }} </small>
          </div>
          <div>
            <button
              @click="refrescarDatos"
              class="btn btn-outline-primary me-2"
              :disabled="refrescando"
            >
              <span v-if="refrescando" class="spinner-border spinner-border-sm me-2"></span>
              {{ refrescando ? 'Actualizando...' : '🔄 Actualizar' }}
            </button>
            <button @click="logout" class="btn btn-danger">
              <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Cargando datos del mercado...</span>
      </div>
      <p class="mt-2">Obteniendo datos en tiempo real de Yahoo Finance...</p>
    </div>

    <!-- Grid de activos reales -->
    <div v-else>
      <h3 class="mb-3">Mercado en Tiempo Real</h3>
      <div class="row">
        <div v-for="activo in activos" :key="activo.id" class="col-md-4 mb-3">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title mb-0">{{ activo.nombre }}</h5>
                <span class="badge bg-secondary">{{ activo.simbolo }}</span>
              </div>

              <div class="mt-2">
                <span class="badge" :class="sectorBadgeClass(activo.sector)">
                  {{ activo.sector }}
                </span>
              </div>

              <hr />

              <div class="row text-center">
                <div class="col-6">
                  <small class="text-muted d-block">Precio</small>
                  <strong class="h5">${{ formatPrice(activo.precio) }}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Variación</small>
                  <strong :class="activo.variacion >= 0 ? 'text-success' : 'text-danger'">
                    {{ activo.variacion >= 0 ? '+' : '' }}{{ activo.variacion }}%
                  </strong>
                </div>
              </div>

              <hr />

              <div class="d-grid gap-2">
                <button @click="comprarActivo(activo)" class="btn btn-success btn-sm">
                  Comprar
                </button>
                <button @click="venderActivo(activo)" class="btn btn-warning btn-sm">Vender</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Portafolio del usuario -->
    <div class="row mt-5">
      <div class="col">
        <h3>Mi Portafolio</h3>
        <div class="card">
          <div class="card-body">
            <div v-if="portafolio.length === 0" class="text-center text-muted py-3">
              No tienes activos en tu cartera. ¡Empieza a invertir!
            </div>
            <ul v-else class="list-group list-group-flush">
              <li
                v-for="(item, index) in portafolio"
                :key="index"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{{ item.nombre }}</strong>
                  <small class="text-muted ms-2">({{ item.cantidad }} acciones)</small>
                </div>
                <span class="badge bg-primary rounded-pill">${{ formatPrice(item.total) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue' //computed
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { obtenerAccionesReales, SYMBOLS, obtenerDatosRespaldo } from '@/services/stockApi'

const authStore = useAuthStore()
const router = useRouter()

const activos = ref([])
const loading = ref(true)
const refrescando = ref(false)
const portafolio = ref([])
const ultimaActualizacion = ref('')

// Formatear precio
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

// Clase CSS para badges de sector
const sectorBadgeClass = (sector) => {
  const clases = {
    Tecnología: 'bg-primary',
    Consumo: 'bg-success',
    Automotriz: 'bg-warning text-dark',
    Financiero: 'bg-info text-dark',
    Salud: 'bg-danger',
  }
  return clases[sector] || 'bg-secondary'
}

// Cargar datos reales
const cargarDatosReales = async () => {
  try {
    const datos = await obtenerAccionesReales()
    if (datos && datos.length > 0) {
      activos.value = datos
      ultimaActualizacion.value = new Date().toLocaleTimeString()
      console.log('📊 Activos cargados:', datos.length, 'primer activo:', datos[0])
    } else {
      console.warn('No se obtuvieron datos')
    }
  } catch (error) {
    console.error('Error cargando datos:', error)
    // Usar datos de respaldo en caso de error
    activos.value = SYMBOLS.map(s => obtenerDatosRespaldo(s))
  } finally {
    loading.value = false
    refrescando.value = false
  }
}
// Refrescar datos manualmente
const refrescarDatos = async () => {
  refrescando.value = true
  await cargarDatosReales()
}

// Cerrar sesión
const logout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}

// Comprar activo
const comprarActivo = (activo) => {
  const existente = portafolio.value.find((item) => item.nombre === activo.nombre)

  if (existente) {
    existente.cantidad += 1
    existente.total = existente.cantidad * activo.precio
  } else {
    portafolio.value.push({
      nombre: activo.nombre,
      cantidad: 1,
      total: activo.precio,
    })
  }
}

// Vender activo
const venderActivo = (activo) => {
  const existente = portafolio.value.find((item) => item.nombre === activo.nombre)

  if (existente && existente.cantidad > 0) {
    existente.cantidad -= 1

    if (existente.cantidad === 0) {
      portafolio.value = portafolio.value.filter((item) => item.nombre !== activo.nombre)
    } else {
      existente.total = existente.cantidad * activo.precio
    }
  }
}

onMounted(() => {
  cargarDatosReales()
})
</script>
