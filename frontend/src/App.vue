<template>
  <div v-if="isPublicRoute">
    <router-view />
  </div>
  <div v-else class="app-layout">
    <Sidebar :items="filteredSidebarItems" :user="user" />
    <div class="main-content">
      <TabBar />
      <router-view :key="tabsStore.activeTabKey" />
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

onMounted(() => {
  tabsStore.restoreTabs()

  const currentRoute = router.currentRoute.value
  const isPatientTab = currentRoute.name === 'PatientEdit' && currentRoute.params.id
  const currentTabKey = isPatientTab ? `patient-${currentRoute.params.id}` : null

  if (
    isPatientTab &&
    !tabsStore.tabs.find(tab => tab.key === currentTabKey)
  ) {
    tabsStore.openTab({
      key: currentTabKey,
      title: `Patient ${currentRoute.params.id}`,
      route: { name: 'PatientEdit', params: { id: currentRoute.params.id } },
      closeable: true
    })
    tabsStore.setActiveTab(currentTabKey)
  } else if (
    isPatientTab &&
    tabsStore.tabs.find(tab => tab.key === currentTabKey)
  ) {
    tabsStore.setActiveTab(currentTabKey)
  }

  // Always push the active tab's route (from restored tabs)
  const activeTab = tabsStore.tabs.find(tab => tab.key === tabsStore.activeTabKey)
  if (
    activeTab &&
    activeTab.route &&
    (router.currentRoute.value.fullPath !== router.resolve(activeTab.route).fullPath)
  ) {
    router.push(activeTab.route)
  }
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
