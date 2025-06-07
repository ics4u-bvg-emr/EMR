import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  return { tabs, activeTabKey, openTab, closeTab, setActiveTab, activeTab }
})
