import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const TABS_KEY = 'openTabs'
const ACTIVE_TAB_KEY = 'activeTabKey'
const DEFAULT_TAB_ROUTE_KEY = 'defaultTabLastRoute'

function getUserKey() {
  // Use a unique identifier for the user, e.g. username or user id
  return localStorage.getItem('username') || localStorage.getItem('userId') || 'guest'
}
function getNamespacedKey(base) {
  return `${base}:${getUserKey()}`
}

export const useTabsStore = defineStore('tabs', () => {
  // The default tab is always present and uncloseable
  const tabs = ref([
    {
      key: 'home',
      title: 'Home',
      route: { name: 'Dashboard' }, // Make sure this matches your router's dashboard route name
      closeable: false,
    }
  ])
  const activeTabKey = ref('home')

  // Track last route for default tab
  const defaultTabLastRoute = ref(
    JSON.parse(localStorage.getItem(getNamespacedKey(DEFAULT_TAB_ROUTE_KEY))) || { name: 'Dashboard' }
  )

  function setDefaultTabLastRoute(route) {
    defaultTabLastRoute.value = route
  }

  watch(defaultTabLastRoute, (val) => {
    localStorage.setItem(getNamespacedKey(DEFAULT_TAB_ROUTE_KEY), JSON.stringify(val))
  }, { deep: true })

  // Restore tabs from localStorage
  function restoreTabs() {
    const savedTabs = localStorage.getItem(getNamespacedKey(TABS_KEY))
    const savedActive = localStorage.getItem(getNamespacedKey(ACTIVE_TAB_KEY))
    if (savedTabs) {
      try {
        const parsed = JSON.parse(savedTabs)
        if (Array.isArray(parsed) && parsed.length) {
          tabs.value = parsed
        }
      } catch {}
    }
    if (savedActive) activeTabKey.value = savedActive
    // Restore last route for default tab
    const savedDefaultRoute = localStorage.getItem(getNamespacedKey(DEFAULT_TAB_ROUTE_KEY))
    if (savedDefaultRoute) {
      try {
        defaultTabLastRoute.value = JSON.parse(savedDefaultRoute)
      } catch {}
    }
  }

  // Save tabs to localStorage on change
  watch([tabs, activeTabKey], () => {
    localStorage.setItem(getNamespacedKey(TABS_KEY), JSON.stringify(tabs.value))
    localStorage.setItem(getNamespacedKey(ACTIVE_TAB_KEY), activeTabKey.value)
  }, { deep: true })

  function openTab({ key, title, route, closeable = true }) {
    if (!tabs.value.find(tab => tab.key === key)) {
      tabs.value.push({ key, title, route, closeable })
    }
    activeTabKey.value = key
  }

  function closeTab(key) {
    const idx = tabs.value.findIndex(tab => tab.key === key)
    if (idx > -1 && tabs.value[idx].closeable) {
      tabs.value.splice(idx, 1)
      // If closing the active tab, switch to the previous or next tab
      if (activeTabKey.value === key) {
        const newIdx = idx === 0 ? 0 : idx - 1
        activeTabKey.value = tabs.value[newIdx]?.key || tabs.value[0]?.key
        return tabs.value[newIdx]?.route || tabs.value[0]?.route
      }
    }
    return null
  }

  function setActiveTab(key) {
    if (tabs.value.find(tab => tab.key === key)) {
      activeTabKey.value = key
    }
  }

  const activeTab = computed(() =>
    tabs.value.find(tab => tab.key === activeTabKey.value)
  )

  function clearTabDataForCurrentUser() {
    localStorage.removeItem(getNamespacedKey(TABS_KEY))
    localStorage.removeItem(getNamespacedKey(ACTIVE_TAB_KEY))
    localStorage.removeItem(getNamespacedKey(DEFAULT_TAB_ROUTE_KEY))
  }

  function resetTabs() {
    tabs.value = [
      {
        key: 'home',
        title: 'Home',
        route: { name: 'Dashboard' },
        closeable: false,
      }
    ]
    activeTabKey.value = 'home'
    defaultTabLastRoute.value = { name: 'Dashboard' }
  }

  return {
    tabs,
    activeTabKey,
    openTab,
    closeTab,
    setActiveTab,
    activeTab,
    restoreTabs,
    defaultTabLastRoute,
    setDefaultTabLastRoute,
    getUserKey,
    clearTabDataForCurrentUser,
    resetTabs,
  }
})
