<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <v-card max-width="360" width="100%" rounded="lg" elevation="2" class="pa-6">
      <div class="d-flex flex-column align-center mb-4">
        <v-icon icon="mdi-washing-machine" color="primary" size="40" class="mb-2" />
        <span class="text-h6">Iniciar sesión</span>
        <span class="text-body-2 text-medium-emphasis">Accede con tu alias y NIP</span>
      </div>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="compact"
        closable
        class="mb-4"
        @click:close="error = ''"
      >
        {{ error }}
      </v-alert>

      <v-form ref="form" @submit.prevent="submit">
        <v-text-field
          v-model="alias"
          label="Alias"
          variant="outlined"
          prepend-inner-icon="mdi-account"
          autocomplete="username"
          class="mb-2"
          :disabled="loading"
          :rules="[(v) => !!v || 'Ingresa tu alias']"
        />

        <v-text-field
          v-model="nip"
          label="NIP"
          :type="mostrarNip ? 'text' : 'password'"
          variant="outlined"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="mostrarNip ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="mostrarNip = !mostrarNip"
          inputmode="numeric"
          maxlength="4"
          autocomplete="current-password"
          class="mb-2"
          :disabled="loading"
          :rules="[(v) => !!v || 'Ingresa tu NIP', (v) => /^\d{4}$/.test(v) || 'El NIP debe tener 4 dígitos']"
          @input="onNipInput"
        />

        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          class="mt-2"
          :loading="loading"
          :disabled="!alias || !nip"
        >
          Entrar
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const router = useRouter()

const form = ref(null)
const alias = ref('')
const nip = ref('')
const mostrarNip = ref(false)
const loading = ref(false)
const error = ref('')

function onNipInput() {
  nip.value = nip.value.replace(/\D/g, '').slice(0, 4)
}

async function submit() {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  error.value = ''

  try {
    await store.login({ alias: alias.value.trim(), nip: nip.value })
    router.replace({ name: 'Home' })
  } catch (err) {
    if (err?.status === 401 || err?.status === 400) {
      error.value = 'Alias o NIP incorrectos'
    } else if (!err?.status) {
      error.value = 'No se pudo conectar con el servidor'
    } else {
      error.value = 'Ocurrió un error, intenta de nuevo'
    }
    nip.value = ''
  } finally {
    loading.value = false
  }
}
</script>
