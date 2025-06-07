import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const TABS_KEY = 'openTabs'
const ACTIVE_TAB_KEY = 'activeTabKey'

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

  // Restore tabs from localStorage
  function restoreTabs() {
    const savedTabs = localStorage.getItem(TABS_KEY)
    const savedActive = localStorage.getItem(ACTIVE_TAB_KEY)
    if (savedTabs) {
      try {
        const parsed = JSON.parse(savedTabs)
        if (Array.isArray(parsed) && parsed.length) {
          tabs.value = parsed
        }
      } catch {}
    }
    if (savedActive) activeTabKey.value = savedActive
  }

  // Save tabs to localStorage on change
  watch([tabs, activeTabKey], () => {
    localStorage.setItem(TABS_KEY, JSON.stringify(tabs.value))
    localStorage.setItem(ACTIVE_TAB_KEY, activeTabKey.value)
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

  return { tabs, activeTabKey, openTab, closeTab, setActiveTab, activeTab, restoreTabs }
})
