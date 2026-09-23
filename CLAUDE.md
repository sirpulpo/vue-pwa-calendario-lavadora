# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — serve the production build locally
- `npm run generate-pwa-assets` — regenerate PWA icons from `pwa-assets.config.js`

No lint or test scripts/tooling are configured in this project.

## Architecture

Single-page Vue 3 PWA (Vite + Vuetify + Pinia + Vue Router) for scheduling shared washing-machine time slots. UI text and copy are in Spanish.

- **State**: all app state lives in one Pinia store, `src/stores/app.js` (`useAppStore`). It holds the static list of `personas` (name + color) and the reactive `reservas` (bookings) array, plus `addReserva`/`removeReserva` actions. There is no persistence layer — state is in-memory only and resets on reload.
- **Routing**: `src/router/index.js` defines two routes — `/` (`HomeView`, eager) and `/acerca` (`AboutView`, lazy-loaded).
- **Views**: `src/views/HomeView.vue` is the core feature — a Vuetify `v-calendar` (month view) plus a booking form (`v-select` for persona, `VDateInput` from `vuetify/labs` for date). Booking rules: only future dates, one reservation per date (enforced via `allowedDates` cross-checking `store.reservas`), color-coded events per persona. Clicking a calendar event opens a delete-confirmation dialog. `src/views/AboutView.vue` is a static tech-stack showcase using `~icons/logos/*` (via `unplugin-icons`, auto-resolved, no explicit registration needed).
- **Plugins**: `src/plugins/vuetify.js` configures Vuetify with the Spanish locale/date adapter and the app's primary theme color (`#1867C0`). `vite.config.js` wires up Vue, Vuetify (auto-import), unplugin-icons, `vite-plugin-pwa` (manifest, autoUpdate), and vue-devtools.
- **PWA**: manifest and icon set are defined in `vite.config.js`'s `VitePWA` block; `pwa-assets.config.js` controls icon generation from a source asset.
