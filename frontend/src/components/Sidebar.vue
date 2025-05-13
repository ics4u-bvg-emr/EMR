<template>
  <div class="layout">
    <aside class="sidebar is-hidden-mobile">
      <div class="sidebar-header">
        <h1 class="app-name">EMR</h1>
      </div>
      <nav class="menu-list">
        <ul>
          <li v-for="item in items" :key="item.label">
            <router-link
              :to="item.route"
              class="nav-item"
              active-class="is-active"
            >
              <span class="icon">
                <img
                  v-if="item.svg"
                  :src="item.svg"
                  class="svg-icon"
                  :alt="`${item.label} icon`"
                />
                <i v-else :class="item.icon"></i>
              </span>
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </nav>
    
      <div class="sidebar-footer">
        <router-link :to="user.route" class="user-link" active-class="is-active">
          <span class="icon footer-icon">
            <img
              v-if="user.svg"
              :src="user.svg"
              class="svg-icon footer-svg"
              :alt="`${user.name} icon`"
            />
            <i v-else :class="user.icon"></i>
          </span>
          {{ user.name }}
        </router-link>
      </div>
    </aside>

    <div class="content-area">
      <!-- Main content goes here -->
      <router-view />
    </div>
  </div>
</template>

<script>
import gearSvg from '@/components/gear.svg';
import circleUserSvg from '@/components/circleuser.svg';

export default {
  name: 'Sidebar',
  props: {
    items: {
      type: Array,
      default: () => ([
        { icon: 'fas fa-home', label: 'Home', route: '/' },
        { icon: 'fas fa-file-medical-alt', label: 'Records', route: '/records' },
        { icon: 'fas fa-calendar-alt', label: 'Appointments', route: '/appointments' },
        { icon: 'fas fa-chart-line', label: 'Reports', route: '/reports' },
        { svg: gearSvg, label: 'Settings', route: '/settings' },
        { icon: 'fas fa-sign-out-alt', label: 'Logout', route: '/logout' }
      ])
    },
    user: {
      type: Object,
      default: () => ({
        svg: circleUserSvg,
        name: 'Jane Doe',
        route: '/profile'
      })
    }
  }
}
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css"; 
@import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;700&display=swap'); 

.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 220px;
  background-color: #f8f8fa;
  color: #585b65;
  display: flex;
  flex-direction: column;
  font-family: 'Geist Sans', sans-serif;
  padding: 1rem;
  border-right: 1px solid #d1d1d1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #d1d1d1;
  color: #585b65;
}

.app-name {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #585b65;
}

.menu-list {
  flex-grow: 1;
  margin-top: 1.5rem;
}

.menu-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li + li {
  margin-top: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: #585b65;
  text-decoration: none;
  transition: background-color 0.2s;
  border-radius: 8px;
}

.nav-item:hover {
  background-color: #e3ebf9;
}

.nav-item:active {
  background-color: #e3ebf9;
}

.nav-item .icon {
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
}

.svg-icon {
  width: 20px;
  height: 20px;
}

.footer-svg {
  width: 24px;
  height: 24px;
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid #d1d1d1;
  text-align: center;
  color: #585b65;
}

.user-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0;
  font-weight: 500;
  color: #585b65;
  text-decoration: none;
  transition: background-color 0.2s;
  border-radius: 8px;
}

.user-link:hover {
  background-color: #e3ebf9;
}

.user-link:active {
  background-color: #e3ebf9;
}

.user-link .footer-icon {
  margin-right: 0.25rem;
  display: flex;
  align-items: center;
}

.content-area {
  flex-grow: 1;
  padding: 1rem;
  background-color: #ffffff;
  color: #585b65;
}

/* Ensure the active state stays without changing text or icon colors */
.is-active {
  background-color: #e3ebf9 !important;  /* Keep the background color */
  color: inherit !important;  /* Prevent text color change */
}

.is-active .icon img,
.is-active .icon i {
  filter: none !important;  /* Prevent icon color change */
}
</style>
