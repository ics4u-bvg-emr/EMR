<script setup>
import { ref, computed } from 'vue'
import { useDiagnosisStore } from './DiagnosisStore'
import { useRouter } from 'vue-router'

const store = useDiagnosisStore()
const router = useRouter()
const needsFollowUp = ref(false)
const followUpDate = ref('')
const followUpNotes = ref('')

const completeDiagnosis = () => {
  if (needsFollowUp.value) {
    store.diagnosis.followUp = {
      date: followUpDate.value,
      notes: followUpNotes.value
    }
  }
  store.completeDiagnosis()
  router.push(`/patients/${store.patientId}`)
}

const prevStep = () => store.prevStep()
const saveDraft = () => store.saveDraft()
</script>

<template>
  <div class="diagnosis-step">
    <h3>Treatment Plan</h3>
    
    <div class="plan-section">
      <h4>Plan Details</h4>
      <textarea
        v-model="store.diagnosis.plan"
        class="plan-textarea"
        placeholder="Outline the treatment plan, follow-up instructions, and any referrals needed"
      ></textarea>

      <div class="plan-options">
        <label class="plan-option">
          <input type="checkbox" v-model="needsFollowUp" />
          <span>Schedule Follow-up</span>
        </label>
        
        <div v-if="needsFollowUp" class="followup-details">
          <label>Follow-up Date</label>
          <input type="date" v-model="followUpDate" class="input" />
          
          <label>Follow-up Notes</label>
          <input v-model="followUpNotes" placeholder="Reason for follow-up" class="input" />
        </div>
      </div>
    </div>

    <div class="step-actions">
        <div class="left-actions">
            <button class="btn-outline" @click="prevStep">← Back</button>
            <button class="btn-outline" @click="saveDraft">Save Draft</button>
        </div>
        <button class="btn-primary" @click="completeDiagnosis">
            Complete Diagnosis
        </button>
    </div>
  </div>
</template>

<style scoped>
.plan-section {
  margin: 1.5rem 0;
}

.plan-textarea {
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.plan-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plan-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.followup-details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.8rem;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.left-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-outline,
.btn-primary {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-outline {
  background-color: white;
  border: 1px solid #ccc;
  color: #333;
}

.btn-outline:hover {
  background-color: #f0f0f0;
}

.btn-primary {
  background-color: #3273dc;
  border: none;
  color: white;
}

.btn-primary:disabled {
  background-color: #a1c5f2;
  cursor: not-allowed;
}

</style>