<template>
  <aside class="sidebar is-hidden-mobile">
    <div class="sidebar-header">
      <img src="@/components/logo.svg" alt="Logo" class="logo" />
      <h1 class="app-name">BVGCare</h1>
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
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    items: Array,
    user: Object
  }
}
</script>

<style scoped>
/* Copy all sidebar-specific styles from your original file */
@import "https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css"; 
@import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;700&display=swap'); 

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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.logo {
  width: 30px;
  height: 30px;
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

.nav-item:hover,
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

.user-link:hover,
.user-link:active {
  background-color: #e3ebf9;
}

.user-link .footer-icon {
  margin-right: 0.25rem;
  display: flex;
  align-items: center;
}

.is-active {
  background-color: #e3ebf9 !important;
  color: inherit !important;
}

.is-active .icon img,
.is-active .icon i {
  filter: none !important;
}
</style>
