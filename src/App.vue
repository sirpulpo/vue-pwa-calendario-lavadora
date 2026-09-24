<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import CambiarNipDialog from '@/components/CambiarNipDialog.vue'

import IconVue from '~icons/logos/vue'
import IconVitejs from '~icons/logos/vitejs'
import IconVuetify from '~icons/logos/vuetifyjs'
import IconPinia from '~icons/logos/pinia'
import IconPwa from '~icons/logos/pwa'

const store = useAppStore()
const router = useRouter()

const drawer = ref(false)
const confirmarLogout = ref(false)
const cambiarNip = ref(false)
const snackbar = ref(false)
const snackbarTexto = ref('')

const iconComponents = {
  vue: IconVue,
  vitejs: IconVitejs,
  vuetifyjs: IconVuetify,
  pinia: IconPinia,
  pwa: IconPwa,
}

function abrirConfirmarLogout() {
  confirmarLogout.value = true
}

function logout() {
  store.logout()
  confirmarLogout.value = false
  drawer.value = false
  snackbarTexto.value = 'Sesión cerrada'
  snackbar.value = true
  router.push({ name: 'Login' })
}

function abrirCambiarNip() {
  cambiarNip.value = true
  drawer.value = false
}

function onNipCambiado() {
  snackbarTexto.value = 'NIP actualizado'
  snackbar.value = true
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-icon icon="mdi-calendar" class="ml-3 mr-2" style="cursor: pointer" @click="$router.push({ name: 'Home' })" />
      <v-app-bar-title>{{ store.appName }}</v-app-bar-title>
      <v-btn v-if="store.usuario" variant="text" class="mr-1" aria-label="Usuario" @click="drawer = !drawer">
        <span class="d-none d-sm-inline mr-2 text-none">{{ store.usuario.name }}</span>
        <v-icon icon="mdi-account-circle" size="large" />
      </v-btn>
      <!-- <v-btn icon="mdi-information-outline" aria-label="Acerca de" :to="{ name: 'about' }" /> -->
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="right" temporary width="300">
      <v-list-item
        v-if="store.usuario"
        class="py-4"
        :subtitle="'Usuario'"
        :title="store.usuario.name"
      >
        <template #prepend>
          <v-avatar color="primary" class="mr-1">
            {{ store.iniciales }}
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider />

      <template #append>
        <div class="pa-3 d-flex flex-column ga-2">
          <v-btn block variant="tonal" prepend-icon="mdi-lock-reset" @click="abrirCambiarNip">
            Cambiar NIP
          </v-btn>
          <v-btn block color="error" variant="tonal" prepend-icon="mdi-logout" @click="abrirConfirmarLogout">
            Cerrar sesión
          </v-btn>
        </div>

        <v-divider />

        <div class="pa-3 text-center">
          <div class="text-subtitle-2 font-weight-bold">Tecnologías</div>
          <div class="text-caption text-medium-emphasis mb-2">{{ store.appName }} está construido con</div>
          <div class="d-flex flex-wrap justify-center ga-2">
            <v-card
              v-for="tech in store.technologies"
              :key="tech.name"
              :href="tech.url"
              target="_blank"
              rel="noopener"
              variant="tonal"
              hover
              width="80"
              class="py-2 text-center"
            >
              <component :is="iconComponents[tech.icon]" style="font-size: 24px" />
              <div class="text-caption mt-1">{{ tech.name }}</div>
            </v-card>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <v-dialog v-model="confirmarLogout" max-width="400">
      <v-card title="Cerrar sesión">
        <v-card-text> ¿Seguro que deseas cerrar sesión? </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmarLogout = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="logout">Cerrar sesión</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <CambiarNipDialog v-model="cambiarNip" @success="onNipCambiado" />

    <v-snackbar v-model="snackbar" timeout="3000">{{ snackbarTexto }}</v-snackbar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
