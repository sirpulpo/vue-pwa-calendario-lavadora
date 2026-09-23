<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" class="text-center mb-6">
        <h1 class="text-h3 font-weight-bold">Tecnologías</h1>
        <p class="text-subtitle-1 text-medium-emphasis mt-2">{{ store.appName }} está construido con</p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col v-for="tech in store.technologies" :key="tech.name" cols="6" sm="4" md="2">
        <v-card class="text-center py-6" :href="tech.url" target="_blank" rel="noopener" elevation="2" hover>
          <component :is="iconComponents[tech.icon]" style="font-size: 48px" />
          <v-card-subtitle class="mt-2">{{ tech.name }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

import IconVue from '~icons/logos/vue'
import IconVitejs from '~icons/logos/vitejs'
import IconVuetify from '~icons/logos/vuetifyjs'
import IconPinia from '~icons/logos/pinia'
import IconPwa from '~icons/logos/pwa'

const store = useAppStore()

const iconComponents = {
  vue: IconVue,
  vitejs: IconVitejs,
  vuetifyjs: IconVuetify,
  pinia: IconPinia,
  pwa: IconPwa,
}
</script>