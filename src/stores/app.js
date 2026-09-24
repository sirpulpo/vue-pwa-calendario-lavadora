import { defineStore } from 'pinia'
import authService from '@/services/auth'
import reservationService from '@/services/reservation'
import userService from '@/services/user'
import { getSessionUser, saveSession } from '@/helpers/session'

function mapReserva(reservation) {
  return {
    id: reservation.uid,
    persona: reservation.user?.name ?? '',
    fecha: new Date(reservation.date),
    color: reservation.user?.color ?? 'primary',
  }
}

export const useAppStore = defineStore('app', {
  state: () => ({
    appName: 'Calendario Lavadora',
    technologies: [
      { name: 'Vue.js', icon: 'vue', url: 'https://vuejs.org' },
      { name: 'Vite', icon: 'vitejs', url: 'https://vite.dev' },
      { name: 'Vuetify', icon: 'vuetifyjs', url: 'https://vuetifyjs.com' },
      { name: 'Pinia', icon: 'pinia', url: 'https://pinia.vuejs.org' },
      { name: 'Vue Router', icon: 'vue', url: 'https://router.vuejs.org' },
      { name: 'PWA', icon: 'pwa', url: 'https://vite-pwa-org.netlify.app' },
    ],
    personas: [
      { nombre: 'Daniel', color: 'green' },
      { nombre: 'Jose', color: 'blue' },
      { nombre: 'Pau', color: 'pink' },
      { nombre: 'Invitado', color: 'orange' },
    ],
    reservas: [],
    reservasCargando: false,
    usuario: getSessionUser(),
  }),
  getters: {
    iniciales(state) {
      if (!state.usuario?.name) return ''
      return state.usuario.name
        .split(' ')
        .slice(0, 2)
        .map((palabra) => palabra.charAt(0).toUpperCase())
        .join('')
    },
    personaUsuario(state) {
      const palabras = state.usuario?.name?.toLowerCase().split(' ') ?? []
      return state.personas.find((p) => palabras.includes(p.nombre.toLowerCase()))?.nombre ?? null
    },
    aliasUsuario(state) {
      return state.usuario?.name ?? ''
    },
    colorUsuario(state) {
      const palabras = state.usuario?.name?.toLowerCase().split(' ') ?? []
      return state.personas.find((p) => palabras.includes(p.nombre.toLowerCase()))?.color ?? 'primary'
    },
  },
  actions: {
    async login({ alias, nip }) {
      this.usuario = await authService.loginService({ alias, nip })
    },
    logout() {
      authService.logout()
      this.usuario = null
    },
    async cambiarNip({ currentNip, newNip }) {
      const token = await userService.updateNip({ currentNip, newNip })
      saveSession({ token, user: this.usuario })
    },
    addReserva({ persona, fecha }) {
      const color = this.personas.find((p) => p.nombre === persona)?.color ?? this.colorUsuario
      this.reservas.push({
        id: crypto.randomUUID(),
        persona,
        fecha,
        color,
      })
    },
    async crearReserva(fecha) {
      const reservation = await reservationService.create({ date: fecha })
      this.reservas.push(mapReserva({ ...reservation, user: this.usuario }))
      return reservation
    },
    async cargarReservas({ from, to, signal } = {}) {
      this.reservasCargando = true
      try {
        const reservations = await reservationService.getAll({ from, to }, { signal })
        this.reservas = reservations.map(mapReserva)
      } finally {
        this.reservasCargando = false
      }
    },
    async removeReserva(id) {
      await reservationService.remove(id)
      this.reservas = this.reservas.filter((r) => r.id !== id)
    },
  },
})
