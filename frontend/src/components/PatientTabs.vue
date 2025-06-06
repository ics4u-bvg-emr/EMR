<script setup>
import { ref, computed } from 'vue'

const openTabs = ref([]) // Array of patients
const selectedTabIndex = ref(null)

const selectedTab = computed(() =>
  selectedTabIndex.value !== null ? openTabs.value[selectedTabIndex.value] : null
)

function openTab(patient) {
  const index = openTabs.value.findIndex(p => p._id === patient._id)
  if (index === -1) {
    openTabs.value.push(patient)
    selectedTabIndex.value = openTabs.value.length - 1
  } else {
    selectedTabIndex.value = index
  }
}

function closeTab(index) {
  openTabs.value.splice(index, 1)
  if (selectedTabIndex.value === index) {
    selectedTabIndex.value = openTabs.value.length ? 0 : null
  } else if (selectedTabIndex.value > index) {
    selectedTabIndex.value--
  }
}

defineExpose({ openTab })
</script>

<style scoped>
.tabs a {
  display: flex;
  align-items: center;
}
</style>

<template>
  <div class="tabs is-boxed is-small">
    <ul>
      <li
        v-for="(tab, index) in openTabs"
        :key="tab._id"
        :class="{ 'is-active': selectedTabIndex === index }"
      >
        <a @click="selectedTabIndex = index">
          {{ tab.name }}
          <button
            class="delete is-small ml-2"
            @click.stop="closeTab(index)"
          ></button>
        </a>
      </li>
    </ul>
  </div>

  <div v-if="selectedTab">
    <div class="box">
      <h2 class="title is-5">{{ selectedTab.name }}</h2>
      <p><strong>Phone:</strong> {{ selectedTab.phone }}</p>
      <p><strong>Complaint:</strong> {{ selectedTab.complaint }}</p>
      <!-- Add more patient data or subcomponents here -->
    </div>
  </div>
</template>