import { defineStore } from 'pinia'

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
    usuario: { nombre: 'Victor Daniel Aguirre Gil' },
  }),
  getters: {
    iniciales(state) {
      if (!state.usuario?.nombre) return ''
      return state.usuario.nombre
        .split(' ')
        .slice(0, 2)
        .map((palabra) => palabra.charAt(0).toUpperCase())
        .join('')
    },
    personaUsuario(state) {
      const palabras = state.usuario?.nombre?.toLowerCase().split(' ') ?? []
      return state.personas.find((p) => palabras.includes(p.nombre.toLowerCase()))?.nombre ?? null
    },
  },
  actions: {
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
    logout() {
      this.usuario = null
    },
  },
})
