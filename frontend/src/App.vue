<template>
  <Sidebar :items="menuItems" :user="currentUser" />
</template>

<script>
import Sidebar from '@/components/sidebar.vue'
import gearSvg from '@/components/gear.svg'
import circleUserSvg from '@/components/circleuser.svg'

export default {
  name: 'App',
  components: { Sidebar },
  data() {
    return {
      menuItems: [
        { icon: 'fas fa-home', label: 'Home', route: '/' },
        { icon: 'fas fa-file-medical-alt', label: 'Records', route: '/records' },
        { icon: 'fas fa-calendar-alt', label: 'Appointments', route: '/appointments' },
        { icon: 'fas fa-chart-line', label: 'Reports', route: '/reports' },
        { svg: gearSvg, label: 'Settings', route: '/settings' },
        { icon: 'fas fa-sign-out-alt', label: 'Logout', route: '/logout' }
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
