<template>
  <div class="exam-field">
    <label>{{ label }}</label>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      class="input"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  placeholder: String,
  modelValue: [String, Number] // Accept both string and number values
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.exam-field {
  display: flex;
  flex-direction: column;
  min-width: 120px;
  flex: 1;
}

.exam-field label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.3rem;
}

.exam-field input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>