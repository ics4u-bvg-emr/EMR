<template>
  <main class="home-screen">
    <h2>Doctor Agendas</h2>

    <!-- Doctor Selection -->
    <div class="field select-field">
      <label class="label" for="doctor-select">Select Doctor:</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select id="doctor-select" v-model="selectedDoctorId">
            <option disabled value="">-- Choose a doctor --</option>
            <option v-for="doc in doctors" :key="doc._id" :value="doc._id">
              {{ doc.firstName }} {{ doc.lastName }} ({{ doc.specialization || 'General' }})
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading/Error -->
    <div v-if="loading" class="notification is-light is-info">Loading agenda...</div>
    <div v-else-if="error" class="notification is-light is-danger">{{ error }}</div>

    <!-- Appointment Cards Grid -->
    <div v-else class="cards-container">
      <div
        v-if="filteredAppointments.length === 0"
        class="no-appointments"
      >
        No appointments found for selected doctor.
      </div>
      <div
        v-for="appt in filteredAppointments"
        :key="appt._id"
        class="appointment-card"
      >
        <div class="card-header">
          <h3 v-if="appt.patientId">
              {{ appt.patientId.firstName || 'Unknown' }} {{ appt.patientId.lastName || '' }}
          </h3>
          <h3 v-else>Unknown Patient</h3>

          <span
            class="tag"
            :class="{
              'is-success': appt.status === 'Confirmed',
              'is-warning': appt.status === 'Pending',
              'is-danger': appt.status === 'Cancelled'
            }"
          >
            {{ appt.status }}
          </span>
        </div>
        <div class="card-body">
          <p><strong>Start:</strong> {{ formatDate(appt.start) }}</p>
          <p><strong>End:</strong> {{ formatDate(appt.end) }}</p>
          <p><strong>Reason:</strong> {{ appt.reason }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const doctors = ref([])
const appointments = ref([])
const selectedDoctorId = ref('')
const loading = ref(true)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')

    const [doctorsRes, apptRes] = await Promise.all([
      axios.get('https://emr-backend-h03z.onrender.com/api/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get('https://emr-backend-h03z.onrender.com/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])

    doctors.value = doctorsRes.data
    appointments.value = apptRes.data
  } catch (err) {
    error.value = err.response?.data?.message || err.message
  } finally {
    loading.value = false
  }
}

const filteredAppointments = computed(() => {
  if (!selectedDoctorId.value) return []
  return appointments.value.filter(a => {
    const docId = a.doctorId?._id || a.doctorId
    return docId === selectedDoctorId.value
  })
})

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleString()
}

onMounted(fetchData)
</script>


<style scoped>
.home-screen {
  padding: 2rem;
  font-family: 'Geist Sans', sans-serif;
  background: #f8f9fb;
  min-height: 100vh;
}

h2 {
  font-size: 2.4rem;
  font-weight: 700;
  color: #2e3a59;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #d8dbe0;
  padding-bottom: 0.5rem;
}

.select-field {
  margin-bottom: 1.5rem;
  max-width: 500px;
}

.label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #444;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.appointment-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.05);
  padding: 1.25rem 1.5rem;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.appointment-card:hover {
  transform: translateY(-3px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.card-body p {
  margin: 0.3rem 0;
  color: #555;
  font-size: 0.95rem;
}

.tag {
  font-size: 0.85rem;
  border-radius: 8px;
  padding: 0.35rem 0.75rem;
  font-weight: 600;
}

.no-appointments {
  font-style: italic;
  color: #888;
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
}
</style>
