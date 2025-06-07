<template>
  <section class="updates-center section">
    <h2 class="title is-3 has-text-dark mb-4">Patient Updates</h2>

    <!-- Filter Input -->
    <div class="field mb-4">
      <label class="label has-text-black" for="patient-search">Filter By Patient:</label>
      <div class="control">
        <input
          id="patient-search"
          class="input"
          type="text"
          placeholder="Type patient name to filter"
          v-model="patientSearch"
          @change="handlePatientSelection"
          list="patients-list"
          autocomplete="off"
        />
        <datalist id="patients-list">
          <option
            v-for="patient in patients"
            :key="patient._id"
            :value="patient.firstName + ' ' + patient.lastName"
          />
        </datalist>
      </div>
    </div>

    <div v-if="selectedPatientName" class="notification is-link is-light mb-3">
      Filtering updates for: <strong>{{ selectedPatientName }}</strong>
      <button class="button is-small is-light ml-3" @click="clearFilter">Clear filter</button>
    </div>

    <!-- Loading/Error -->
    <div v-if="loading" class="notification is-info">Loading updates...</div>
    <div v-else-if="error" class="notification is-danger">{{ error }}</div>

    <!-- Updates -->
    <div v-else>
      <div v-if="filteredUpdates.length === 0" class="notification is-warning">
        No updates available.
      </div>

      <div v-for="update in filteredUpdates" :key="update.id" class="box mb-3">
        <article class="media">
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ update.patientName }}</strong>
                <span class="tag is-info is-light ml-2">{{ update.type }}</span>
                <small class="has-text-grey ml-3">{{ formatDate(update.updatedAt) }}</small>
              </p>
              <p><em>{{ update.updateName }}</em></p>
              <p>{{ update.details }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { usePatientUpdates } from '@/composables/usePatientUpdates'

const patients = ref([])
const medicalRecords = ref([])

const loading = ref(true)
const error = ref(null)

const patientSearch = ref('')
const selectedPatientId = ref(null)
const filteredUpdates = ref([])

const selectedPatientName = computed(() => {
  const patient = patients.value.find(p => p._id === selectedPatientId.value)
  return patient ? `${patient.firstName} ${patient.lastName}` : ''
})

const { updates } = usePatientUpdates(patients, medicalRecords)

watch(updates, filterUpdates, { immediate: true })

async function fetchData() {
  loading.value = true
  error.value = null

  try {
    const [patientsRes, recordsRes] = await Promise.all([
      fetch('http://localhost:3000/api/patients'),
      fetch('http://localhost:3000/api/medical-records'),
    ])

    if (!patientsRes.ok || !recordsRes.ok) {
      throw new Error('Failed to fetch data from server')
    }

    patients.value = await patientsRes.json()
    medicalRecords.value = await recordsRes.json()
    filterUpdates()
  } catch (err) {
    error.value = 'Error loading updates: ' + err.message
  } finally {
    loading.value = false
  }
}

function handlePatientSelection() {
  const selected = patients.value.find(
    p => `${p.firstName} ${p.lastName}`.trim().toLowerCase() === patientSearch.value.trim().toLowerCase()
  )
  if (selected) {
    selectedPatientId.value = selected._id
    patientSearch.value = ''
  }
  filterUpdates()
}

function clearFilter() {
  selectedPatientId.value = null
  patientSearch.value = ''
  filterUpdates()
}

function filterUpdates() {
  if (!selectedPatientId.value) {
    filteredUpdates.value = updates.value
    return
  }
  filteredUpdates.value = updates.value.filter(
    update => update.patientId === selectedPatientId.value
  )
}

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(fetchData)
</script>

<style scoped>
.updates-center {
  max-width: 900px;
  margin: auto;
  font-family: 'Geist Sans', sans-serif;
  color: #585b65;
}

.box {
  border-radius: 1rem;
  border: 1.5px solid #e2e5ed;
  box-shadow: 0 2px 6px rgba(40, 44, 63, 0.07);
  background: #fff;
}

.media-content p {
  margin-bottom: 0.5rem;
}

.tag {
  font-size: 0.75rem;
}

em {
  color: #444;
}

input#patient-search {
  background-color: #fff !important;
  color: #000 !important;
  border: 1px solid #ccc !important;
}

.input::placeholder {
  color: #555 !important;
}

strong {
  color: #000 !important;
}
</style>
