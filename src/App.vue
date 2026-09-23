<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const drawer = ref(false)
const confirmarLogout = ref(false)
const snackbar = ref(false)

function abrirConfirmarLogout() {
  confirmarLogout.value = true
}

function logout() {
  store.logout()
  confirmarLogout.value = false
  drawer.value = false
  snackbar.value = true
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-icon icon="mdi-calendar" class="ml-3 mr-2" style="cursor: pointer" @click="$router.push({ name: 'home' })" />
      <v-app-bar-title>{{ store.appName }}</v-app-bar-title>
      <template v-if="store.usuario">
        <span class="mr-2 d-none d-sm-inline">{{ store.usuario.nombre }}</span>
        <v-btn icon="mdi-account-circle" aria-label="Usuario" @click="drawer = !drawer" />
      </template>
      <v-btn icon="mdi-information-outline" aria-label="Acerca de" :to="{ name: 'about' }" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="right" temporary width="300">
      <v-list-item
        v-if="store.usuario"
        class="py-4"
        :subtitle="'Usuario'"
        :title="store.usuario.nombre"
      >
        <template #prepend>
          <v-avatar color="primary" class="mr-1">
            {{ store.iniciales }}
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider />

      <template #append>
        <div class="pa-3">
          <v-btn block color="error" variant="tonal" prepend-icon="mdi-logout" @click="abrirConfirmarLogout">
            Cerrar sesión
          </v-btn>
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

    <v-snackbar v-model="snackbar" timeout="3000">Sesión cerrada</v-snackbar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
