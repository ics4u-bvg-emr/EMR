<template>
  <div class="modal-backdrop">
    <div class="modal-content">
      <h3>New Appointment for {{ date }}</h3>
      <form @submit.prevent="submitForm">
        <label>Doctor ID:</label>
        <input v-model="doctorId" required />

        <label>Patient ID:</label>
        <input v-model="patientId" required />

        <label>Time:</label>
        <input type="time" v-model="time" required />

        <label>Reason:</label>
        <input v-model="reason" />

        <label>Notes:</label>
        <textarea v-model="notes" />

        <div class="actions">
          <button type="submit">Create</button>
          <button type="button" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const emit = defineEmits(['close', 'submitted'])
const props = defineProps({ date: String })

const doctorId = ref('')
const patientId = ref('')
const time = ref('')
const reason = ref('')
const notes = ref('')

const start = computed(() => {
  return time.value && props.date
    ? `${props.date}T${time.value}:00`
    : ''
})

const end = computed(() => {
  if (!start.value) return ''
  const startDate = new Date(start.value)
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
  return endDate.toISOString()
})

const submitForm = async () => {
  if (!start.value || !end.value) {
    alert('Please select a valid time')
    return
  }

  try {
    const res = await axios.post('https://localhost:8000/api/appointments', {
      doctorId: doctorId.value,
      patientId: patientId.value,
      start: start.value,
      end: end.value,
      reason: reason.value,
      notes: notes.value,
      status: 'pending'
    })

    emit('submitted', res.data)
  } catch (err) {
    console.error('Failed to create appointment:', err)
    alert('Failed to create appointment, please try again.')
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  position: relative;
  z-index: 10000;
}
.modal-content form {
  display: flex;
  flex-direction: column;
}
.modal-content label {
  margin-top: 10px;
}
.modal-content input,
.modal-content textarea {
  padding: 8px;
  margin-bottom: 10px;
}
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
