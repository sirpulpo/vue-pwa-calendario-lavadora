import { defineStore } from 'pinia'
import authService from '@/services/auth'
import { getSessionUser } from '@/helpers/session'

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
  },
  actions: {
    async login({ alias, nip }) {
      this.usuario = await authService.loginService({ alias, nip })
    },
    logout() {
      authService.logout()
      this.usuario = null
    },
    addReserva({ persona, fecha }) {
      const color = this.personas.find((p) => p.nombre === persona)?.color
      this.reservas.push({
        id: crypto.randomUUID(),
        persona,
        fecha,
        color,
      })
    },
    removeReserva(id) {
      this.reservas = this.reservas.filter((r) => r.id !== id)
    },
  },
})
