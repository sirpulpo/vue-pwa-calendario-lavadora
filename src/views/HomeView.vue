<template>
  <v-container fluid class="py-4 py-md-6">
    <v-sheet elevation="2" rounded="lg" class="pa-2 pa-sm-4">
      <v-toolbar flat color="transparent" density="comfortable">
        <v-btn icon="mdi-chevron-left" variant="text" aria-label="Mes anterior" @click="prevMonth" />

        <v-spacer />

        <v-toolbar-title class="text-capitalize text-center flex-grow-0 mx-2 text-h6">
          {{ monthLabel }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn icon="mdi-chevron-right" variant="text" aria-label="Mes siguiente" @click="nextMonth" />

        <v-btn variant="tonal" color="primary" prepend-icon="mdi-calendar-today" class="ml-2" @click="goToday">
          Hoy
        </v-btn>
      </v-toolbar>

      <v-calendar
        v-model="focus"
        type="month"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        :events="events"
        class="mt-2"
      />
    </v-sheet>

    <v-sheet elevation="2" rounded="lg" class="pa-4 mt-4">
      <v-form ref="form" @submit.prevent="save">
        <v-row>
          <v-col cols="12" sm="5">
            <v-select
              v-model="persona"
              :items="personas"
              label="Persona"
              :rules="[(v) => !!v || 'Selecciona una persona']"
            />
          </v-col>

          <v-col cols="12" sm="5">
            <v-date-input
              v-model="fecha"
              label="Fecha"
              :min="today"
              prepend-icon=""
              prepend-inner-icon="mdi-calendar"
              :rules="[(v) => !!v || 'Selecciona una fecha']"
            />
          </v-col>

          <v-col cols="12" sm="2" class="d-flex align-center">
            <v-btn type="submit" color="primary" prepend-icon="mdi-content-save" block>
              Guardar
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDate } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useAppStore } from '@/stores/app'

const dateAdapter = useDate()
const store = useAppStore()

const focus = ref(new Date())
const events = ref([])

const personas = ['Daniel', 'Jose', 'Pau', 'Invitado']
const today = dateAdapter.startOfDay(new Date())

const form = ref(null)
const persona = ref(null)
const fecha = ref(null)

async function save() {
  const { valid } = await form.value.validate()
  if (!valid) return

  store.addReserva({ persona: persona.value, fecha: fecha.value })
  form.value.reset()
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
