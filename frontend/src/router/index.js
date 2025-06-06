import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Settings from '@/views/Settings.vue'
import Appointments from '@/views/Appointments.vue'
import Records from '@/views/Records.vue'
import Reports from '@/views/Reports.vue'
import Profile from '@/views/Profile.vue'
import PatientEdit from '@/views/PatientEdit.vue'
import Register from '@/views/Register.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import RequestPasswordReset from '@/views/RequestPasswordReset.vue'
import Dashboard from '@/views/Home.vue'
import RegisterDoctor from '@/views/RegisterDoctor.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', component: Register },
  { path: '/register-doctor', name: 'RegisterDoctor', component: RegisterDoctor },
  { path: '/reset-password/:token', component: ResetPassword },
  { path: '/request-password-reset', component: RequestPasswordReset },

  // ✅ Protected routes (sidebar only shows here)
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/appointments', name: 'Appointments', component: Appointments, meta: { requiresAuth: true } },
  { path: '/records', name: 'Records', component: Records, meta: { requiresAuth: true } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/records/:id', name: 'PatientEdit', component: PatientEdit, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
