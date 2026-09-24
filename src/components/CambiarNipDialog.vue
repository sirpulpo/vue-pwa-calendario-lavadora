<template>
  <v-dialog v-model="model" max-width="400" persistent>
    <v-card title="Cambiar NIP">
      <v-card-text>
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
            v-model="currentNip"
            label="NIP actual"
            :type="mostrarCurrentNip ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="mostrarCurrentNip ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="mostrarCurrentNip = !mostrarCurrentNip"
            inputmode="numeric"
            maxlength="4"
            autocomplete="current-password"
            class="mb-2"
            :disabled="loading"
            :rules="[(v) => !!v || 'Ingresa tu NIP actual', (v) => /^\d{4}$/.test(v) || 'El NIP debe tener 4 dígitos']"
            @input="currentNip = sanitize(currentNip)"
          />

          <v-text-field
            v-model="newNip"
            label="Nuevo NIP"
            :type="mostrarNewNip ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock-plus"
            :append-inner-icon="mostrarNewNip ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="mostrarNewNip = !mostrarNewNip"
            inputmode="numeric"
            maxlength="4"
            autocomplete="new-password"
            class="mb-2"
            :disabled="loading"
            :rules="[
              (v) => !!v || 'Ingresa el nuevo NIP',
              (v) => /^\d{4}$/.test(v) || 'El NIP debe tener 4 dígitos',
              (v) => v !== currentNip || 'El nuevo NIP debe ser distinto al actual',
            ]"
            @input="newNip = sanitize(newNip)"
          />

          <v-text-field
            v-model="confirmNip"
            label="Confirmar nuevo NIP"
            :type="mostrarConfirmNip ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock-check"
            :append-inner-icon="mostrarConfirmNip ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="mostrarConfirmNip = !mostrarConfirmNip"
            inputmode="numeric"
            maxlength="4"
            autocomplete="new-password"
            :disabled="loading"
            :rules="[(v) => !!v || 'Confirma el nuevo NIP', (v) => v === newNip || 'Los NIP no coinciden']"
            @input="confirmNip = sanitize(confirmNip)"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" :disabled="loading" @click="cerrar">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" :loading="loading" @click="submit">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const model = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['success'])

const store = useAppStore()
const router = useRouter()

const form = ref(null)
const currentNip = ref('')
const newNip = ref('')
const confirmNip = ref('')
const mostrarCurrentNip = ref(false)
const mostrarNewNip = ref(false)
const mostrarConfirmNip = ref(false)
const loading = ref(false)
const error = ref('')

function sanitize(value) {
  return value.replace(/\D/g, '').slice(0, 4)
}

function resetForm() {
  currentNip.value = ''
  newNip.value = ''
  confirmNip.value = ''
  mostrarCurrentNip.value = false
  mostrarNewNip.value = false
  mostrarConfirmNip.value = false
  error.value = ''
  form.value?.resetValidation()
}

watch(model, (abierto) => {
  if (!abierto) resetForm()
})

function cerrar() {
  model.value = false
}

async function submit() {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  error.value = ''

  try {
    await store.cambiarNip({ currentNip: currentNip.value, newNip: newNip.value })
    model.value = false
    emit('success')
  } catch (err) {
    if (err?.status === 401) {
      model.value = false
      store.logout()
      router.push({ name: 'Login' })
    } else if (err?.status === 400 && err?.data?.msg) {
      error.value = 'El NIP actual es incorrecto'
    } else if (err?.status === 400) {
      error.value = 'Revisa los datos ingresados'
    } else if (!err?.status) {
      error.value = 'No se pudo conectar con el servidor'
    } else {
      error.value = 'Ocurrió un error, intenta de nuevo'
    }
    currentNip.value = ''
    newNip.value = ''
    confirmNip.value = ''
  } finally {
    loading.value = false
  }
}
</script>
