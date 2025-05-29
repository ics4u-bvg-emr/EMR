<template>
  <main class="home-screen">
    <h2>Settings</h2>
    <div class="field">
      <label class="checkbox">
        <input type="checkbox" v-model="darkMode" />
        Enable Dark Mode
      </label>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const darkMode = ref(false)

onMounted(() => {
  // Load preference from localStorage
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  applyDarkMode()
})

watch(darkMode, (val) => {
  localStorage.setItem('darkMode', val)
  applyDarkMode()
})

function applyDarkMode() {
  if (darkMode.value) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
}
</script>

<style scoped>
.home-screen {
  padding: 2rem;
  font-family: 'Geist Sans', sans-serif;
}
.home-screen h2 {
  margin-bottom: 1rem;
  font-size: 2.5rem;  /* Larger font size */
  font-weight: bold;  /* Make it bold */
  border-bottom: 2px solid #2b2e3b;  /* Add a line underneath */
  padding-bottom: 0.5rem;  /* Space between text and line */
}
</style>
