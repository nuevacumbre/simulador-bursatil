// src/services/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// 🔐 IMPORTANTE: Las credenciales vienen de las variables de entorno
// NUNCA se deben hardcodear directamente en el código
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Opcional: Solo agregar measurementId si existe
if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  firebaseConfig.measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Validar que las variables de entorno existen
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
]

requiredVars.forEach((varName) => {
  if (!import.meta.env[varName]) {
    console.error(`❌ Variable de entorno faltante: ${varName}`)
    console.error('📝 Cree un archivo .env basado en .env.example')
  }
})

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const auth = getAuth(app)
export const db = getFirestore(app)

// Analytics opcional (solo si está disponible y configurado)
let analytics = null
if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  import('firebase/analytics')
    .then(({ getAnalytics, isSupported }) => {
      isSupported().then((yes) => {
        if (yes) {
          analytics = getAnalytics(app)
          console.log('📊 Analytics inicializado')
        }
      })
    })
    .catch((err) => {
      console.log('Analytics no disponible:', err.message)
    })
}

export { analytics }
export default app
