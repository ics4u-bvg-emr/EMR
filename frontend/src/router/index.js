import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

import Settings from '@/views/Settings.vue'
import Appointments from '@/views/Appointments.vue'
import Records from '@/views/Records.vue'
import Reports from '@/views/Reports.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  { path: '/',      name: 'Home',  component: Home },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/appointments', name: 'Appointments', component: Appointments },
  { path: '/records', name: 'Records', component: Records },
  { path: '/reports', name: 'Reports', component: Reports },
  { path: '/profile', name: 'Profile', component: Profile },
]

const router = createRouter({
  history: createWebHistory(),  // HTML5 history mode
  routes,
})

export default router
