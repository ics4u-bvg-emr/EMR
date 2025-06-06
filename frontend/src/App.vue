<template>
  <v-app>
    <div class="layout">
      <Sidebar
        v-if="!hideSidebarRoutes.includes(route.path)"
        :items="filteredMenuItems"
        :user="currentUser"
      />
      <div class="content-area" :class="{ 'full-width': hideSidebarRoutes.includes(route.path) }">
        <router-view />
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { userRole } from '@/stores/user.js'
import axios from 'axios'

import gearSvg from '@/components/icons/gear.svg'
import circleUserSvg from '@/components/icons/circleuser.svg'
import fileSvg from '@/components/icons/file.svg'
import calendarSvg from '@/components/icons/calendar.svg'
import graphSvg from '@/components/icons/graph.svg'
import homeSvg from '@/components/icons/home.svg'

const route = useRoute()
const router = useRouter()

const hideSidebarRoutes = [
  '/login',
  '/register',
  '/register-doctor',
  '/register-user',
  '/reset-password',
  '/request-password-reset'
]

const menuItems = [
  { svg: homeSvg, label: 'Home', route: '/dashboard', roles: ['doctor'] },
  { svg: fileSvg, label: 'Records', route: '/records', roles: ['doctor'] },
  { svg: fileSvg, label: 'Agendas', route: '/agendas', roles: ['receptionist'] },
  { svg: calendarSvg, label: 'Appointments', route: '/appointments', roles: ['doctor', 'receptionist'] },
  { svg: graphSvg, label: 'Reports', route: '/reports', roles: ['doctor'] },
  { svg: gearSvg, label: 'Settings', route: '/settings', roles: ['doctor', 'receptionist'] },
]

const currentUser = ref({
  svg: 'https://bulma.io/images/placeholders/128x128.png',
  name: 'Jane Doe',
  route: '/profile'
})

const token = localStorage.getItem('token')

onMounted(async () => {
  if (!token) {
    router.push('/login')
    return
  }

  let decoded
  try {
    decoded = JSON.parse(atob(token.split('.')[1]))
  } catch {
    router.push('/login')
    return
  }

  const { id, role } = decoded
  if (!id || !role) {
    router.push('/login')
    return
  }

  try {
    let res
    if (role === 'doctor') {
      res = await axios.get(`/api/doctors/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    } else if (role === 'receptionist') {
      res = await axios.get(`/api/receptionists/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    } else {
      router.push('/login')
      return
    }

    const data = res.data

    currentUser.value.name = `${data.firstName} ${data.lastName}`
    currentUser.value.svg = data.profilePhoto || currentUser.value.svg
  } catch (err) {
    console.error('Failed to load profile:', err)
  }
})

const filteredMenuItems = computed(() =>
  menuItems.filter(item => !item.roles || item.roles.includes(userRole.value))
)
</script>

<style>
.layout {
  display: flex;
  height: 100vh;
}

.content-area {
  flex-grow: 1;
  padding: 1.5rem 2.5rem;
  background: #fff;
  color: #585b65;
  font-family: 'Geist Sans', sans-serif;
  overflow-y: auto;
  min-width: 0;
}
</style>
