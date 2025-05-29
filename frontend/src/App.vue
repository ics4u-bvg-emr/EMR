<template>
  <div class="layout">
    <Sidebar :items="menuItems" :user="currentUser" />
    <div class="content-area">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import gearSvg from '@/components/icons/gear.svg'
import circleUserSvg from '@/components/icons/circleuser.svg'
import fileSvg from '@/components/icons/file.svg'
import calendarSvg from '@/components/icons/calendar.svg'
import graphSvg from '@/components/icons/graph.svg'
import homeSvg from '@/components/icons/home.svg'

export default {
  name: 'App',
  components: { Sidebar },
  data() {
    return {
      menuItems: [
        { svg: homeSvg, label: 'Home', route: '/' },
        { svg: fileSvg, label: 'Records', route: '/records' },
        { svg: calendarSvg, label: 'Appointments', route: '/appointments' },
        { svg: graphSvg, label: 'Reports', route: '/reports' },
        { svg: gearSvg, label: 'Settings', route: '/settings' },
      ],
      currentUser: {
        svg: circleUserSvg,
        name: 'Jane Doe',
        route: '/profile'
      }
    }
  }
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
