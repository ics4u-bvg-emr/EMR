<script setup>
import { ref, computed } from 'vue'
import { useDiagnosisStore } from './DiagnosisStore'

const store = useDiagnosisStore()
const showOtherSymptom = ref(false)

const commonSymptoms = [
  'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Vomiting', 'Diarrhea',
  'Shortness of breath', 'Chest pain', 'Abdominal pain', 'Dizziness'
]

const canProceed = computed(() => {
  return (
    store.diagnosis.symptoms.length > 0 &&
    (!store.diagnosis.symptoms.includes('Other') || store.diagnosis.otherSymptom.trim())
  )
})

const nextStep = () => store.nextStep()
const saveDraft = () => {
  store.saveDraft()
  // You can add toast notification here
}
</script>

<template>
  <div class="diagnosis-step">
    <h3>Symptoms</h3>
    
    <div class="symptoms-list">
      <label
        v-for="symptom in commonSymptoms"
        :key="symptom"
        class="symptom-checkbox"
      >
        <input
          type="checkbox"
          :value="symptom"
          v-model="store.diagnosis.symptoms"
        />
        {{ symptom }}
      </label>
      <label class="symptom-checkbox">
        <input
          type="checkbox"
          value="Other"
          v-model="store.diagnosis.symptoms"
          @change="showOtherSymptom = !showOtherSymptom"
        />
        Other
      </label>
      <input
        v-if="showOtherSymptom"
        v-model="store.diagnosis.otherSymptom"
        class="input"
        placeholder="Describe other symptom"
      />
    </div>

    <div class="step-actions">
        <div class="left-actions">
            <button class="btn-outline" @click="saveDraft">Save Draft</button>
        </div>
        <button 
            class="btn-primary" 
            :disabled="!canProceed"
            @click="nextStep"
        >
            Next: Examination →
        </button>
    </div>
  </div>
</template>

<style scoped>
.diagnosis-step {
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.symptoms-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.8rem;
  margin: 1.5rem 0;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
}

.symptom-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.symptom-checkbox:hover {
  background: #f5f7fa;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.step-actions .left-actions {
  display: flex;
  gap: 1rem;
}

.btn-outline {
  padding: 0.5rem 1rem;
  border: 1px solid #aaa;
  background-color: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
}

.btn-outline:hover {
  background-color: #f0f0f0;
}

.btn-primary {
  padding: 0.5rem 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary:disabled {
  background-color: #999;
  cursor: not-allowed;
}

</style>