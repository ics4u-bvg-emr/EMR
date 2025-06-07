<template>
  <div v-if="isPublicRoute">
    <router-view />
  </div>
  <div v-else class="app-layout">
    <Sidebar :items="filteredSidebarItems" :user="user" />
    <div class="main-content">
      <TabBar />
      <router-view :key="activeTab?.key" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import TabBar from '@/components/TabBar.vue'
import { userRole } from '@/stores/user.js'
import { useTabsStore } from '@/stores/tabs'
import axios from 'axios'

import gearSvg from '@/components/icons/gear.svg'
import circleUserSvg from '@/components/icons/circleuser.svg'
import fileSvg from '@/components/icons/file.svg'
import calendarSvg from '@/components/icons/calendar.svg'
import graphSvg from '@/components/icons/graph.svg'
import homeSvg from '@/components/icons/home.svg'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

const sidebarItems = [
  { svg: homeSvg, label: 'Home', route: '/dashboard', roles: ['doctor'] },
  { svg: fileSvg, label: 'Patients', route: '/patients', roles: ['doctor'] },
  { svg: fileSvg, label: 'Drafts', route: '/diagnosis/drafts', roles: ['doctor'] },
  { svg: fileSvg, label: 'Agendas', route: '/agendas', roles: ['receptionist'] },
  { svg: fileSvg, label: 'Create Patient', route: '/create-patient', roles: ['receptionist'] },
  { svg: calendarSvg, label: 'Appointments', route: '/appointments', roles: ['doctor', 'receptionist'] },
  { svg: graphSvg, label: 'Reports', route: '/reports', roles: ['doctor'] },
  // { svg: gearSvg, label: 'Settings', route: '/settings', roles: ['doctor', 'receptionist'] },
]

const user = ref({
  svg: circleUserSvg,
  name: 'Profile',
  route: '/profile',
  get role() { return userRole.value } // <-- Make role reactive!
})

const filteredSidebarItems = computed(() =>
  sidebarItems.filter(item =>
    !item.roles || item.roles.includes(user.value.role)
  )
)

const activeTab = computed(() => tabsStore.activeTab)

// List of route names that should NOT show the tab framework
const publicRoutes = [
  'Login',
  'Register',
  'RegisterDoctor',
  'RegisterReceptionist',
  'RequestPasswordReset',
  'ResetPassword'
]

const isPublicRoute = computed(() => publicRoutes.includes(route.name))

// You may want to fetch the real user info here as you already do in your onMounted

onMounted(() => {
  tabsStore.restoreTabs()
})
</script>

<style>
.app-layout {
  display: flex;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 1.5rem 2.5rem;
  background: #fff;
  color: #585b65;
  font-family: 'Geist Sans', sans-serif;
  overflow-y: auto;
  min-width: 0;
}
</style>
