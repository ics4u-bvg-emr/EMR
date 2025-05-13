import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Settings from '@/views/Settings.vue'

const routes = [
  { path: '/',      name: 'Home',  component: Home },
  { path: '/settings', name: 'Settings', component: Settings },
]

const router = createRouter({
  history: createWebHistory(),  // HTML5 history mode
  routes,
})

export default router
