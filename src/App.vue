<script setup>
import { useAppStore } from '@/stores/app'

const store = useAppStore()
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title>{{ store.appName }}</v-app-bar-title>
      <v-btn icon="mdi-information-outline" aria-label="Acerca de" :to="{ name: 'about' }" />
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
