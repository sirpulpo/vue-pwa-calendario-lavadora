<template>
  <v-container class="py-4 py-md-6" style="max-width: 1100px">
    <v-card elevation="2" rounded="lg" class="pa-2 pa-sm-4">
      <v-toolbar flat color="transparent" density="comfortable">
        <v-btn icon="mdi-chevron-left" variant="text" aria-label="Mes anterior" @click="prevMonth" />

        <v-spacer />

        <v-toolbar-title class="text-capitalize text-center mx-2 text-h6">
          {{ monthLabel }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn icon="mdi-chevron-right" variant="text" aria-label="Mes siguiente" @click="nextMonth" />

        <v-btn variant="tonal" color="primary" prepend-icon="mdi-calendar-today" class="ml-2" @click="goToday">
          Hoy
        </v-btn>
      </v-toolbar>

      <v-progress-linear v-if="store.reservasCargando" indeterminate color="primary" class="mt-2" />

      <v-alert
        v-if="errorCargar"
        type="error"
        variant="tonal"
        density="compact"
        closable
        class="mt-2"
        @click:close="errorCargar = ''"
      >
        {{ errorCargar }}
      </v-alert>

      <v-calendar
        v-model="focus"
        type="month"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        :events="events"
        class="mt-2"
        @click:event="onEventClick"
      />
    </v-card>

    <v-card elevation="2" rounded="lg" class="pa-4 mt-4">
      <v-alert
        v-if="errorGuardar"
        type="error"
        variant="tonal"
        density="compact"
        closable
        class="mb-4"
        @click:close="errorGuardar = ''"
      >
        {{ errorGuardar }}
      </v-alert>

      <v-form ref="form" @submit.prevent="save">
        <v-row>
          <v-col cols="12" sm="5">
            <v-text-field
              :model-value="store.aliasUsuario"
              label="Persona"
              prepend-inner-icon="mdi-account"
              readonly
            />
          </v-col>

          <v-col cols="12" sm="5">
            <v-date-input
              v-model="fecha"
              label="Fecha"
              :min="today"
              :allowed-dates="allowedDates"
              prepend-icon=""
              prepend-inner-icon="mdi-calendar"
              :rules="[(v) => !!v || 'Selecciona una fecha', (v) => allowedDates(v) || 'Esa fecha ya está reservada']"
            />
          </v-col>

          <v-col cols="12" sm="2" class="d-flex align-center">
            <v-btn
              type="submit"
              color="primary"
              prepend-icon="mdi-content-save"
              block
              :loading="guardando"
              :disabled="!store.aliasUsuario || !fecha"
            >
              Guardar
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-dialog
      :model-value="!!reservaAEliminar"
      max-width="400"
      @update:model-value="(v) => !v && (reservaAEliminar = null)"
    >
      <v-card v-if="reservaAEliminar" title="Eliminar reserva">
        <v-card-text>
          ¿Eliminar la reserva de {{ reservaAEliminar.name }} del
          {{ dateAdapter.format(reservaAEliminar.start, 'fullDate') }}?
          <v-alert v-if="errorEliminar" type="error" variant="tonal" density="compact" class="mt-2">
            {{ errorEliminar }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="eliminando" @click="reservaAEliminar = null">Cancelar</v-btn>
          <v-btn color="error" variant="flat" :loading="eliminando" @click="confirmDeleteReserva">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useDate } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useAppStore } from '@/stores/app'

const dateAdapter = useDate()
const store = useAppStore()

const focus = ref(new Date())

const today = dateAdapter.startOfDay(new Date())

const form = ref(null)
const fecha = ref(null)
const guardando = ref(false)
const errorGuardar = ref('')
const errorCargar = ref('')

let cargaController

async function cargarReservas() {
  cargaController?.abort()
  cargaController = new AbortController()
  errorCargar.value = ''
  try {
    await store.cargarReservas({ signal: cargaController.signal })
  } catch (err) {
    if (err?.code !== 'ERR_CANCELED') {
      errorCargar.value = 'No se pudieron cargar las reservas'
    }
  }
}

onMounted(cargarReservas)

onBeforeUnmount(() => {
  cargaController?.abort()
})

const reservedDates = computed(() => store.reservas.map((r) => r.fecha))

const events = computed(() =>
  store.reservas.map((reserva) => ({
    id: reserva.id,
    name: reserva.persona,
    start: reserva.fecha,
    end: reserva.fecha,
    allDay: true,
    color: reserva.color,
  })),
)

const reservaAEliminar = ref(null)
const eliminando = ref(false)
const errorEliminar = ref('')

function onEventClick(_nativeEvent, { event }) {
  errorEliminar.value = ''
  reservaAEliminar.value = event
}

async function confirmDeleteReserva() {
  eliminando.value = true
  errorEliminar.value = ''

  try {
    await store.removeReserva(reservaAEliminar.value.id)
    reservaAEliminar.value = null
  } catch (err) {
    errorEliminar.value = err?.data?.msg ?? 'No se pudo eliminar la reserva'
  } finally {
    eliminando.value = false
  }
}

function allowedDates(date) {
  if (!date) return true
  return !reservedDates.value.some((reservada) => dateAdapter.isSameDay(reservada, date))
}

async function save() {
  const { valid } = await form.value.validate()
  if (!valid) return

  guardando.value = true
  errorGuardar.value = ''

  try {
    await store.crearReserva(fecha.value)
    fecha.value = null
    form.value.resetValidation()
    // cargarReservas()
  } catch (err) {
    if (err?.status === 409) {
      errorGuardar.value = 'Esa fecha ya está reservada'
    } else if (!err?.status) {
      errorGuardar.value = 'No se pudo conectar con el servidor'
    } else {
      errorGuardar.value = err?.data?.msg ?? 'No se pudo guardar la reserva'
    }
  } finally {
    guardando.value = false
  }
}

const monthLabel = computed(() => {
  const label = dateAdapter.format(focus.value, 'monthAndYear')
  return label.charAt(0).toUpperCase() + label.slice(1)
})

function prevMonth() {
  focus.value = dateAdapter.addMonths(focus.value, -1)
}

function nextMonth() {
  focus.value = dateAdapter.addMonths(focus.value, 1)
}

function goToday() {
  focus.value = new Date()
}
</script>
