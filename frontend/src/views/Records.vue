<template>
  <main class="home-screen">
    <h2>Records</h2>

    <!-- Search Input -->
  <div class="field mb-4">
    <label class="label has-text-black" for="patient-search">Search by name:</label>
    <div class="control">
      <input
        id="patient-search"
        class="input"
        type="text"
        placeholder="Type patient name"
        v-model="searchQuery"
      />
    </div>
  </div>


    <!-- Loading/Error -->
    <div v-if="loading" class="notification is-info">Loading patients...</div>
    <div v-else-if="error" class="notification is-danger">{{ error }}</div>

    <!-- Patient Table -->
    <div class="card" v-else>
      <table class="patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Sex</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="patient in filteredPatients"
            :key="patient._id"
            class="clickable-row"
            @click="goToPatient(patient._id)"
          >
            <td>{{ patient.firstName }} {{ patient.lastName }}</td>
            <td>{{ calculateAge(patient.dateOfBirth) }}</td>
            <td>{{ patient.height + ' cm'|| '—' }}</td>
            <td>{{ patient.weight + 'kg' || '—' }}</td>
            <td>{{ patient.sex ? patient.sex.charAt(0).toUpperCase() : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const patients = ref([])
const searchQuery = ref('')
const loading = ref(true)
const error = ref(null)
const router = useRouter()

const fetchPatients = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('https://emr-backend-h03z.onrender.com/api/patients')
    if (!res.ok) throw new Error('Failed to fetch patient data')
    patients.value = await res.json()
  } catch (err) {
    error.value = 'Error loading patients: ' + err.message
  } finally {
    loading.value = false
  }
}

const filteredPatients = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return patients.value
  return patients.value.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(query)
  )
})

function calculateAge(dateString) {
  if (!dateString) return '—'
  const birthDate = new Date(dateString)
  const ageDifMs = Date.now() - birthDate.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

function goToPatient(patientId) {
  router.push({ name: 'PatientEdit', params: { id: patientId } })
}

onMounted(fetchPatients)
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
  max-width: 100%;
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
  letter-spacing: 0.05em;
  border-bottom: 2px solid #f0f0f0;
  background: #fff;
}

.patients-table tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.clickable-row {
  cursor: pointer;
  transition: background 0.2s;
}

.clickable-row:hover {
  background: #f9fafc;
}

.patients-table td {
  color: #262a33;
}

input#patient-search {
  background-color: #fff !important;
  color: #000 !important;
  border: 1px solid #ccc !important;
}

/* Make placeholder text darker */
.input::placeholder {
  color: #555 !important;
}
</style>
