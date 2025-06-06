import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Settings from '@/views/Settings.vue'
import Agendas from '@/views/Agendas.vue'
import Appointments from '@/views/Appointments.vue'
import Records from '@/views/Records.vue'
import Reports from '@/views/Reports.vue'
import Profile from '@/views/Profile.vue'
import PatientEdit from '@/views/PatientEdit.vue'
import DraftsList from '@/components/PatientDiagnosis/DraftsList.vue'
import Register from '@/views/Register.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import RequestPasswordReset from '@/views/RequestPasswordReset.vue'
import RegisterDoctor from '@/views/RegisterDoctor.vue'
import RegisterReceptionist from '@/views/RegisterReceptionist.vue'

const routes = [
  {
    path: '/',
    redirect: () => {
      const role = localStorage.getItem('role')
      if (role === 'doctor') return '/dashboard'
      if (role === 'receptionist') return '/appointments'
      return '/login'
    }
  },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', component: Register },
  { path: '/register-doctor', name: 'RegisterDoctor', component: RegisterDoctor },
  { path: '/register-receptionist', name: 'RegisterReceptionist', component: RegisterReceptionist },
  { path: '/reset-password/:token', component: ResetPassword },
  { path: '/request-password-reset', component: RequestPasswordReset },
  { path: '/dashboard', name: 'Dashboard', component: Home, meta: { requiresAuth: true, role: 'doctor' } },
  { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true, role: ['doctor','receptionist'] } },
  { path: '/agendas', name: 'Agendas', component: Agendas, meta: { requiresAuth: true, role: ['receptionist'] } },
  { path: '/appointments', name: 'Appointments', component: Appointments, meta: { requiresAuth: true, role: ['doctor', 'receptionist'] } },
  { path: '/records', name: 'Records', component: Records, meta: { requiresAuth: true, role: 'doctor' } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { requiresAuth: true, role: 'doctor' } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true, role: ['doctor','receptionist'] } },
  { path: '/records/:id', name: 'PatientEdit', component: PatientEdit, meta: { requiresAuth: true, role: 'doctor' } },
  {path: '/diagnosis/drafts', name: 'DiagnosisDrafts', component: DraftsList, meta: { requiresAuth: true, role: 'doctor' }}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Modular role-based navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  if (to.meta.role) {
    if (Array.isArray(to.meta.role)) {
      if (!to.meta.role.includes(role)) {
        return next('/login')
      }
    } else {
      if (to.meta.role !== role) {
        return next('/login')
      }
    }
  }

  next()
})

export default router
