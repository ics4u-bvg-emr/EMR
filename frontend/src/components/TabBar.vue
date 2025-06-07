<template>
  <div class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.key"
      :class="['tab', { active: tab.key === activeTabKey }]"
      @click="activate(tab)"
    >
      <span>{{ tab.title }}</span>
      <button
        v-if="tab.closeable"
        class="close-btn"
        @click.stop="close(tab.key)"
      >×</button>
    </div>
  </div>
</template>

<script setup>
import { useTabsStore } from '@/stores/tabs'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const tabsStore = useTabsStore()
const router = useRouter()
const tabs = computed(() => tabsStore.tabs)
const activeTabKey = computed(() => tabsStore.activeTabKey)

function close(key) {
  const newRoute = tabsStore.closeTab(key)
  if (newRoute) {
    // Only push if the route is different
    if (router.currentRoute.value.fullPath !== router.resolve(newRoute).fullPath) {
      router.push(newRoute)
    } else {
      // Force update by changing the key on <router-view>
      // This is handled by :key="activeTabKey" in App.vue
    }
  }
}
function activate(tab) {
  tabsStore.setActiveTab(tab.key)
  if (tab.key === 'home') {
    router.push(tabsStore.defaultTabLastRoute)
  } else {
    router.push(tab.route)
  }
}
</script>

<style scoped>
.tab-bar {
  display: flex;
  background: #f5f5f8;
  border-bottom: 1px solid #e0e0e0;
  padding: 0.25rem 1rem;
}
.tab {
  padding: 0.5rem 1.2rem;
  margin-right: 0.2rem;
  border-radius: 8px 8px 0 0;
  background: #eaf2fa;
  cursor: pointer;
  position: relative;
  font-weight: 500;
}
.tab.active {
  background: #fff;
  border-bottom: 2px solid #304ffe;
}
.close-btn {
  background: none;
  border: none;
  color: #888;
  margin-left: 0.5rem;
  font-size: 1.1em;
  cursor: pointer;
}
</style>
