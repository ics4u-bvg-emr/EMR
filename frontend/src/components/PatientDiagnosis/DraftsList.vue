<template>
  <div class="drafts-container">
    <h2>Saved Draft Diagnoses</h2>
    <div v-if="loading" class="loading">Loading drafts...</div>
    <div v-else-if="drafts.length === 0" class="empty-state">
      No draft diagnoses found
    </div>
    <ul v-else class="drafts-list">
      <li v-for="draft in drafts" :key="draft._id" class="draft-item">
        <div class="draft-header">
          <span class="patient-name">
            {{ draft.patientId?.firstName }} {{ draft.patientId?.lastName }}
          </span>
          <span class="last-updated">
            Last updated: {{ formatDate(draft.updatedAt) }}
          </span>
        </div>
        <div class="draft-actions">
          <button
            @click="continueDraft(draft.patientId?._id)"
            class="btn-continue"
          >
            Continue Draft
          </button>
          <button
            @click="deleteDraft(draft._id)"
            class="btn-delete"
            v-if="draft._id"
          >
            Delete Draft
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDiagnosisStore } from './DiagnosisStore'
import { useRouter } from 'vue-router'
import axios from 'axios';

const router = useRouter()
const store = useDiagnosisStore()
const drafts = ref([])
const loading = ref(false)

onMounted(async () => {
    loading.value = true
    try {
        // Replace with actual doctor ID from your auth system
        const doctorId = '6838adf12a17b3053d853cf7'
        await store.fetchDoctorDrafts(doctorId)
        drafts.value = store.draftDiagnoses || [] // Ensure it's always an array
    } catch (error) {
        console.error('Failed to load drafts:', error)
    } finally {
        loading.value = false
    }
})

// const continueDraft = (draft) => {
//     console.log("hi"+ draft.patientId)
//     console.log(draft.patientId._id)
//     router.push({
//         name: 'Patient',
//         params: { id: draft.patientId._id },
//         query: { tab: 'Diagnose' }
//     })

//     // Load the draft data into the store
//     store.loadDraft(draft.patientId._id)
// }

const continueDraft = async (patientId) => {
    if (!patientId)
        return

    try {
        await store.loadDraft(patientId)
        router.push({
            name: 'PatientEdit',
            params: { id: patientId }
        })
    } catch (error) {
        console.error('Failed to load draft:', error)
    }
}

const deleteDraft = async (diagnosisId) => {
    if (!diagnosisId) return

    if (confirm('Are you sure you want to delete this draft?')) {
        try {
        await axios.delete(`https://emr-backend-h03z.onrender.com/api/diagnosis/${diagnosisId}`)
        drafts.value = drafts.value.filter(d => d._id !== diagnosisId)
        store.draftDiagnoses = store.draftDiagnoses.filter(d => d._id !== diagnosisId)
        } catch (error) {
        console.error('Failed to delete draft:', error)
        }
    }
}

const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : 'Unknown date'
}
</script>

<style scoped>
.drafts-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.drafts-list {
  list-style: none;
  padding: 0;
}

.draft-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.draft-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.patient-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.last-updated {
  color: #666;
  font-size: 0.9rem;
}

.draft-actions {
  display: flex;
  gap: 1rem;
}

.btn-continue {
  background: #304ffe;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete {
  background: #ff4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.loading, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
