import { createRouter, createWebHistory } from 'vue-router';
import authenticateLogged from './auth-logged.js';
import authenticateGuard from './auth-guard.js';

const routes = [
  {
    path: '/login',
    name: 'Login',
    beforeEnter: [authenticateLogged],
    component: () => import(/* webpackChunkName: "Login" */'@/views/LoginView.vue'),
  },
  {
    path: '/',
    name: 'Home',
    beforeEnter: [authenticateGuard],
    component: () => import(/* webpackChunkName: "Home" */'@/views/HomeView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
