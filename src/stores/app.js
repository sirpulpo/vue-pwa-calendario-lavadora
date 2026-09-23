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
    reservas: [],
  }),
  actions: {
    addReserva({ persona, fecha }) {
      this.reservas.push({
        id: crypto.randomUUID(),
        persona,
        fecha,
      })
    },
  },
})
