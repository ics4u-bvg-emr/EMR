<template>
  <main class="home-screen">
    <h2>Doctor Agendas</h2>

    <!-- Doctor Selection -->
    <div class="field mb-4">
      <label class="label has-text-black" for="doctor-select">Select Doctor:</label>
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
    <div v-if="loading" class="notification is-info">Loading agenda...</div>
    <div v-else-if="error" class="notification is-danger">{{ error }}</div>

    <!-- Appointments Table -->
    <div class="card" v-else>
      <table class="patients-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Start</th>
            <th>End</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appt in filteredAppointments" :key="appt._id">
            <td>{{ appt.patientId.firstName }} {{ appt.patientId.lastName }}</td>
            <td>{{ formatDate(appt.start) }}</td>
            <td>{{ formatDate(appt.end) }}</td>
            <td>{{ appt.reason }}</td>
            <td>{{ appt.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const loading = ref(true)
const error = ref(null)
const selectedDoctorId = ref('')

// Static list of doctors (replace IDs with real ones as needed)
const doctors = ref([
  {
    _id: '666a0d2732b6a3aa084f1831',
    firstName: 'Alice',
    lastName: 'Nguyen',
    specialization: 'Cardiology'
  },
  {
    _id: '666a0d2732b6a3aa084f1832',
    firstName: 'Brian',
    lastName: 'Smith',
    specialization: 'Dermatology'
  },
  {
    _id: '666a0d2732b6a3aa084f1833',
    firstName: 'Clara',
    lastName: 'Zhou',
    specialization: 'Pediatrics'
  }
])

const appointments = ref([])

const fetchAppointments = async () => {
  loading.value = true
  try {
    const res = await fetch('https://emr-backend-h03z.onrender.com/api/appointments')
    if (!res.ok) throw new Error('Failed to fetch appointments')
    appointments.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const filteredAppointments = computed(() => {
  if (!selectedDoctorId.value) return []
  return appointments.value.filter(a => a.doctorId === selectedDoctorId.value)
})

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleString()
}

onMounted(fetchAppointments)
</script>

<style scoped>
.home-screen {
  padding: 2rem;
  font-family: 'Geist Sans', sans-serif;
  background: #fff;
  min-height: 100vh;
}

.home-screen h2 {
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: bold;
  border-bottom: 2px solid #2b2e3b;
  padding-bottom: 0.5rem;
}

.card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 18px rgba(34, 42, 66, 0.08);
  padding: 2rem;
  margin-top: 2rem;
  overflow-x: auto;
}

.patients-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.08rem;
  color: #262a33;
}

.patients-table th,
.patients-table td {
  padding: 1rem;
  text-align: left;
}

.patients-table th {
  font-weight: 600;
  color: #9ea1b3;
  border-bottom: 2px solid #f0f0f0;
}

.patients-table tr {
  border-bottom: 1px solid #f0f0f0;
}

.input::placeholder {
  color: #555 !important;
}
</style>
