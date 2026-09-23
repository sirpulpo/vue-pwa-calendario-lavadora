<script setup>
import { useAppStore } from '@/stores/app'

const store = useAppStore()
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-icon icon="mdi-calendar" class="ml-3 mr-2" style="cursor: pointer" @click="$router.push({ name: 'home' })" />
      <v-app-bar-title>{{ store.appName }}</v-app-bar-title>
      <span class="mr-2">Victor Daniel Aguirre Gil</span>
      <v-btn icon="mdi-account-circle" aria-label="Usuario" />
      <v-btn icon="mdi-information-outline" aria-label="Acerca de" :to="{ name: 'about' }" />
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
