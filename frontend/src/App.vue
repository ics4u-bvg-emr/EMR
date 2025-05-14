<template>
  <Sidebar :items="menuItems" :user="currentUser" />
</template>

<script>
import Sidebar from '@/components/sidebar.vue'
import gearSvg from '@/components/gear.svg'
import circleUserSvg from '@/components/circleuser.svg'
import fileSvg from '@/components/file.svg'
import calendarSvg from '@/components/calendar.svg'
import graphSvg from '@/components/graph.svg'
import homeSvg from '@/components/home.svg'

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
/* Any global styles if needed */
</style>
