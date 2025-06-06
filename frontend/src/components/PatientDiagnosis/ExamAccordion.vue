<script setup>
defineProps({
  title: String,
  open: Boolean
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="exam-accordion">
    <div class="accordion-header" @click="emit('toggle')">
      <span>{{ title }}</span>
      <span class="chevron">{{ open ? '▲' : '▼' }}</span>
    </div>

    <div v-if="open" class="accordion-body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.exam-accordion {
  border-top: 1px solid #ddd;
  padding-top: 1rem;
  margin-top: 1rem;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.accordion-body {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
}
</style>
