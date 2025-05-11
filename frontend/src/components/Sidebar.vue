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
          <router-link :to="user.route" class="user-link">
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
          { icon: 'fas fa-home', label: 'Home', route: '/' }, // IMPLEMENT ICONS
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
    background-color: #2b2e3b;
    color: #fff;
    display: flex;
    flex-direction: column;
    font-family: 'Geist Sans', sans-serif;
    padding: 1rem 0;
  }
  
  .sidebar-header {
    text-align: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #414457;
  }
  
  .app-name {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: 1px;
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
    color: #ffffff;
    text-decoration: none;
    transition: color 0.2s;
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
  
  .nav-item:hover,
  .nav-item.is-active {
    color: #fff;
  }
  
  .sidebar-footer {
    padding-top: 1rem;
    border-top: 1px solid #414457;
    text-align: center;
  }
  
  .user-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0;
    font-weight: 500;
    color: #ffffff;
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .user-link .footer-icon {
    margin-right: 0.25rem;
    display: flex;
    align-items: center;
  }
  
  .user-link:hover {
    color: #fff;
  }
  
  .content-area {
    flex-grow: 1;
    padding: 1rem;
  }
  </style>
  