<!-- src/App.vue -->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link to="/" class="navbar-brand">📈 Simulador Bursátil</router-link>
        <div class="navbar-nav">
          <router-link to="/" class="nav-link">Inicio</router-link>
          <!-- Elimina o comenta esta línea si no tienes ruta /about -->
          <!-- <router-link to="/about" class="nav-link">Acerca de</router-link> -->
        </div>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
body {
  background-color: #f8f9fa;
}
</style>
