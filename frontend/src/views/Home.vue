<template>
  <section class="section">
    <div class="container">
      <div class="dashboard-header mb-5">
        <h1 class="dashboard-title">Dashboard</h1>
      </div>

      <div class="columns is-multiline">
        <div class="column is-8">
          <div class="box is-flex is-align-items-center">
            <span class="icon is-large has-text-danger mr-4">
              <i class="fas fa-heart fa-2x"></i>
            </span>
            <div>
              <h2 class="title is-4 mb-1">Welcome, Dr. {{ doctorName }}</h2>
            </div>
          </div>
        </div>
        <div class="column is-2">
          <div class="box has-text-centered">
            <p class="heading">New Patients</p>
            <p class="title is-3">{{ newPatients }}</p>
          </div>
        </div>
        <div class="column is-2">
          <div class="box has-text-centered">
            <p class="heading">All Patients</p>
            <p class="title is-3">{{ totalPatients }}</p>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-7">
          <div class="box">
            <p class="title is-6 mb-3">Appointments for {{ formattedDate }}</p>
            <table class="table is-fullwidth is-hoverable is-size-7">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient Name</th>
                  <th>Phone</th>
                  <th>Pain complaint</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appt in todaysAppointments" :key="appt._id">
                  <td>{{ new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</td>
                  <td>{{ appt.patientId?.firstName }} {{ appt.patientId?.lastName }}</td>
                  <td>{{ appt.patientId?.phone || 'N/A' }}</td>
                  <td>{{ appt.reason }}</td>
                </tr>
              </tbody>
            </table>
            <router-link class="is-size-7" to="/appointments">View all</router-link>
          </div>
        </div>
        <div class="column is-5">
          <div class="box">
            <p class="title is-6 mb-3">At a glance</p>
            <ul class="mb-3" style="list-style: disc inside;">
              <li v-for="note in notifications" :key="note">{{ note }}</li>
            </ul>
            <router-link class="is-size-7" to="/reports">View all</router-link>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-7">
          <div class="box">
            <p class="title is-6 mb-3">Patient statistics</p>
            <div class="has-background-light p-5 mb-2 has-text-grey has-text-centered">
              <span class="icon-text is-size-4">
                <span class="icon"><i class="fas fa-chart-line"></i></span>
                <span>(Graph Placeholder)</span>
              </span>
            </div>
            <p>Total Patients: <b>{{ totalPatients }}</b></p>
          </div>
        </div>
        <div class="column is-5">
          <div class="box">
            <p class="title is-6 mb-3">News & Updates</p>
            <ul>
              <li v-for="update in recentUpdates" :key="update.id">
                <strong>{{ update.patientName }}</strong> –
                <em>{{ update.updateName }}</em>
                <span class="has-text-grey ml-2">
                  ({{ new Date(update.updatedAt).toLocaleDateString() }})
                </span>
              </li>
            </ul>
            <router-link class="is-size-7" to="/reports">View all</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { usePatientUpdates } from '@/composables/usePatientUpdates'
import { useRouter } from 'vue-router'

const router = useRouter()
const doctorName = ref('Doctor')
const patients = ref([])
const medicalRecords = ref([])

const { recentUpdates } = usePatientUpdates(patients, medicalRecords)

const now = ref(new Date())
const appointments = ref([])
const totalPatients = ref(0)
const newPatients = ref(0)
const newMessages = ref(0)
const newNotifications = ref(0)
const notifications = ref([])

const formattedDate = computed(() =>
  now.value.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)

const todaysAppointments = computed(() =>
  appointments.value.filter(appt => {
    const date = new Date(appt.start)
    return date.toDateString() === now.value.toDateString()
  })
)

onMounted(async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/login')
    return
  }

  let decoded
  try {
    decoded = JSON.parse(atob(token.split('.')[1]))
  } catch {
    router.push('/login')
    return
  }

  const { id, role } = decoded
  if (!id || role !== 'doctor') {
    router.push('/login')
    return
  }

  try {
    const res = await axios.get(`/api/doctors/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = res.data
    doctorName.value = `${data.firstName} ${data.lastName}`
  } catch (err) {
    console.error('Failed to fetch doctor:', err)
  }

  const [apptRes, patientRes, recordsRes] = await Promise.all([
    axios.get('/api/appointments/my', { headers: { Authorization: `Bearer ${token}` } }),
    axios.get('/api/patients', { headers: { Authorization: `Bearer ${token}` } }),
    axios.get('/api/medical-records', { headers: { Authorization: `Bearer ${token}` } })
  ])

  appointments.value = Array.isArray(apptRes.data) ? apptRes.data : []
  patients.value = Array.isArray(patientRes.data) ? patientRes.data : []
  medicalRecords.value = Array.isArray(recordsRes.data) ? recordsRes.data : []

  totalPatients.value = patients.value.length

  newPatients.value = patients.value.filter(p => {
    const created = new Date(p.createdAt)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return created > oneWeekAgo
  }).length

  newMessages.value = 11

  // Move notification logic here, after data is loaded
  const todayCount = (todaysAppointments?.value || []).length
  const updateCount = (recentUpdates?.value || []).length

  notifications.value = [] // clear previous notifications

  if (todayCount >= 6) {
    notifications.value.push(`Busy day: ${todayCount} appointments scheduled`)
  } else if (todayCount >= 3) {
    notifications.value.push(`Moderate day: ${todayCount} appointments`)
  } else if (todayCount > 0) {
    notifications.value.push(`Calm day: just ${todayCount} appointment(s)`)
  } else {
    notifications.value.push('No appointments today')
  }

  if (updateCount > 0) {
    notifications.value.push(`${updateCount} recent medical update${updateCount > 1 ? 's' : ''} logged`)
  }

  newNotifications.value = notifications.value.length
})
</script>

<style scoped>
.container,
.container * {
  font-family: "Geist Sans", "Inter", "Segoe UI", Arial, sans-serif;
  color: #585b65 !important;
  letter-spacing: 0;
  font-weight: 400;
}

.dashboard-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-top: 0.1rem;
}

.section {
  padding-top: 1rem !important;
}

.dashboard-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #585b65;
  letter-spacing: -0.5px;
  margin: 0;
}

h1,
h2,
h3,
h4,
.title,
.subtitle {
  font-weight: 600 !important;
  letter-spacing: -0.01em;
  color: #585b65 !important;
}

.box {
  border-radius: 1rem;
  border: 1.5px solid #e2e5ed;
  box-shadow: 0 2px 6px rgba(40, 44, 63, 0.07);
  background: #fff;
}

.table th,
.table td {
  vertical-align: middle;
  color: #585b65 !important;
}

a,
a:visited,
.router-link-active {
  color: #2685fa;
}

a:hover,
.router-link-active {
  text-decoration: underline;
}

ul {
  color: #585b65;
}
</style>
