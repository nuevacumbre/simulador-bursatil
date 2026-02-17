// src/stores/auth.js
import { defineStore } from 'pinia'
import { auth } from '@/services/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

// Nuestro helper de sanitización (lo crearemos a continuación)
import { sanitizeInput } from '@/utils/sanitize'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // Datos del usuario logueado
    loading: false, // Para mostrar un spinner mientras carga
    error: null, // Para mostrar errores al usuario
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email || '',
  },
  actions: {
    // Inicializar listener de autenticación
    initAuthListener() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
        this.loading = false
      })
    },
    // *** [CHECKPOINT DE SEGURIDAD 1] ***
    // Registro de nuevo usuario
    async register(email, password) {
      this.loading = true
      this.error = null
      try {
        // 1. SANITIZAR antes de cualquier otra cosa
        const sanitizedEmail = sanitizeInput(email)
        // La contraseña no se sanitiza (podría eliminar caracteres válidos), pero SÍ se valida.
        // 2. VALIDAR
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres.')
        }

        // 3. LLAMADA A FIREBASE
        const userCredential = await createUserWithEmailAndPassword(auth, sanitizedEmail, password)

        // 4. ACTUALIZAR ESTADO
        this.user = userCredential.user

        // ✅ 5. ¡RETORNAR OBJETO CON SUCCESS: TRUE!
        return {
          success: true,
          user: userCredential.user,
        }
      } catch (err) {
        this.error = err.message
        console.error('Error en registro:', err)
        // ✅ IMPORTANTE: RETORNAR OBJETO CON ERROR, Devolver un objeto con success: false
        return {
          success: false,
          error: err.message,
        }
      } finally {
        this.loading = false
      }
    },

    // Inicio de sesión
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        // 1. SANITIZAR
        const sanitizedEmail = sanitizeInput(email)

        // 2. Llamada a Firebase
        const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password)
        this.user = userCredential.user
        // ✅ IMPORTANTE: Devolver un objeto con success: true
        return {
          success: true,
          user: userCredential.user,
        }
      } catch (err) {
        this.error = err.message
        console.error('Error en login:', err)
        // ✅ IMPORTANTE: Devolver un objeto con success: false
        return {
          success: false,
          error: err.message,
        }
      } finally {
        this.loading = false
      }
    },

    // Inicializar listener de autenticación
    initAuthListener() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
        this.loading = false
      })
    },

    // Cerrar sesión
    async logout() {
      try {
        await signOut(auth)
        this.user = null
      } catch (err) {
        console.error('Error al cerrar sesión:', err)
      }
    },

    // Escuchar cambios en la autenticación (para persistencia de sesión)
    listenToAuthChanges() {
      this.initAuthListener()
      /*onAuthStateChanged(auth, (user) => {
        this.user = user
      })*/
    },
  },
})
