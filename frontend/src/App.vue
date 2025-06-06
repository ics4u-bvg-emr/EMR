<template>
  <v-app>
    <div class="layout">
      <Sidebar
        v-if="!hideSidebarRoutes.includes(route.path)"
        :items="menuItems"
        :user="currentUser"
      />
      <div class="content-area" :class="{ 'full-width': hideSidebarRoutes.includes(route.path) }">
        <router-view />
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

import gearSvg from '@/components/icons/gear.svg'
import circleUserSvg from '@/components/icons/circleuser.svg'
import fileSvg from '@/components/icons/file.svg'
import calendarSvg from '@/components/icons/calendar.svg'
import graphSvg from '@/components/icons/graph.svg'
import homeSvg from '@/components/icons/home.svg'

const route = useRoute()

const hideSidebarRoutes = [
  '/login',
  '/register',
  '/register-doctor',
  '/register-user',
  '/reset-password',
  '/request-password-reset'
]

const menuItems = [
  { svg: homeSvg, label: 'Home', route: '/dashboard' },
  { svg: fileSvg, label: 'Records', route: '/records' },
  { svg: fileSvg, label: 'Agendas', route: '/agendas' },
  { svg: calendarSvg, label: 'Appointments', route: '/appointments' },
  { svg: graphSvg, label: 'Reports', route: '/reports' },
  { svg: gearSvg, label: 'Settings', route: '/settings' },
]

const currentUser = {
  svg: circleUserSvg,
  name: 'Jane Doe',
  route: '/profile'
}
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
