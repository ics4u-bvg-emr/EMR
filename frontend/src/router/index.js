import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Settings from '@/views/Settings.vue'
import Agendas from '@/views/Agendas.vue'
import Appointments from '@/views/Appointments.vue'
import Patients from '@/views/Patients.vue'
import Reports from '@/views/Reports.vue'
import Profile from '@/views/Profile.vue'
import PatientEdit from '@/views/PatientView.vue'
import DraftsList from '@/components/PatientDiagnosis/DraftsList.vue'
import Register from '@/views/Register.vue'
import RegisterDoctor from '@/views/RegisterDoctor.vue'
import RegisterReceptionist from '@/views/RegisterReceptionist.vue'
import RequestPasswordReset from '@/views/RequestPasswordReset.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import CreatePatient from '@/views/CreatePatient.vue'
import { useTabsStore } from '@/stores/tabs'

const routes = [
  {
    path: '/',
    redirect: () => {
      const token = localStorage.getItem('token')
      if (!token) return '/login'
      try {
        const { role, exp } = jwtDecode(token)
        if (exp * 1000 < Date.now()) {
          localStorage.removeItem('token')
          return '/login'
        }
        if (role === 'doctor') return '/dashboard'
        if (role === 'receptionist') return '/appointments'
        return '/login'
      } catch {
        return '/login'
      }
    }
  },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/register-doctor', name: 'RegisterDoctor', component: RegisterDoctor },
  { path: '/register-receptionist', name: 'RegisterReceptionist', component: RegisterReceptionist },
  { path: '/request-password-reset', name: 'RequestPasswordReset', component: RequestPasswordReset },
  { path: '/reset-password/:token', name: 'ResetPassword', component: ResetPassword },
  { path: '/dashboard', name: 'Dashboard', component: Home, meta: { requiresAuth: true, role: 'doctor' } },
  // { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true, role: ['doctor','receptionist'] } },
  { path: '/agendas', name: 'Agendas', component: Agendas, meta: { requiresAuth: true, role: ['receptionist'] } },
  { path: '/create-patient', name: 'CreatePatient', component: CreatePatient, meta: { requiresAuth: true, role: ['receptionist'] } },
  { path: '/appointments', name: 'Appointments', component: Appointments, meta: { requiresAuth: true, role: ['doctor', 'receptionist'] } },
  { path: '/patients', name: 'Patients', component: Patients, meta: { requiresAuth: true, role: 'doctor' } },
  { path: '/agendas', name: 'Agendas', component: Agendas, meta: { requiresAuth: true, role: 'receptionist' } },
  { path: '/appointments', name: 'Appointments', component: Appointments, meta: { requiresAuth: true, role: ['doctor','receptionist'] } },
  { path: '/patients', name: 'Patients', component: Patients, meta: { requiresAuth: true, role: 'doctor' } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { requiresAuth: true, role: 'doctor' } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true, role: ['doctor','receptionist'] } },
  { path: '/patients/:id', name: 'PatientEdit', component: PatientEdit, meta: { requiresAuth: true, role: 'doctor' } },
  {path: '/diagnosis/drafts', name: 'DiagnosisDrafts', component: DraftsList, meta: { requiresAuth: true, role: 'doctor' }}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Modular role-based navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' })
  }

  let payload = null
  if (token) {
    try {
      payload = jwtDecode(token)
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        return next({ name: 'Login' })
      }
    } catch {
      localStorage.removeItem('token')
      return next({ name: 'Login' })
    }
  }

  if (to.meta.role && payload) {
    const allowed = Array.isArray(to.meta.role)
      ? to.meta.role.includes(payload.role)
      : to.meta.role === payload.role

    if (!allowed) {
      return next({ name: 'Login' })
    }
  }

  next()
})

router.afterEach(async (to, from) => {
  const tabsStore = useTabsStore()
  // Save default tab route if needed
  if (tabsStore.activeTabKey === 'home') {
    tabsStore.setDefaultTabLastRoute({
      name: to.name,
      path: to.path,
      params: to.params,
      query: to.query
    })
  }
  // Open a patient tab if route is PatientEdit
  if (to.name === 'PatientEdit' && to.params.id) {
    const patientId = to.params.id
    const tabKey = `patient-${patientId}`
    const existingTab = tabsStore.tabs.find(tab => tab.key === tabKey)
    if (!existingTab) {
      // Fetch patient name from API for tab title
      let title = `Patient ${patientId}`
      try {
        const res = await axios.get(`/api/patients/${patientId}`)
        const patient = res.data
        if (patient && patient.firstName && patient.lastName) {
          title = `${patient.firstName} ${patient.lastName}`
        }
      } catch (e) {
        // fallback to id if fetch fails
      }
      tabsStore.openTab({
        key: tabKey,
        title,
        route: { name: 'PatientEdit', params: { id: patientId } },
        closeable: true
      })
    }
    // Do NOT reset/replace tabsStore.tabs here!
  }
})

export default router
