<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import axios from 'axios'
import { useDiagnosisStore } from './DiagnosisStore'

const store = useDiagnosisStore()
const medications = ref([{ name: '', dose: '', frequency: '' }])
const interactions = ref([])
const shownInteractions = ref(new Set())

const commonDiagnoses = [
  'Hypertension', 'Type 2 Diabetes', 'Upper Respiratory Infection',
  'Migraine', 'Acute Bronchitis', 'Gastroenteritis'
]

const addDiagnosis = (text) => {
  if (store.diagnosis.diagnosis) {
    store.diagnosis.diagnosis += `, ${text}`
  } else {
    store.diagnosis.diagnosis = text
  }
}

const addMedication = () => {
  medications.value.push({ name: '', dose: '', frequency: '' })
}

const removeMedication = (index) => {
  if (medications.value.length > 1) {
    medications.value.splice(index, 1)
  }
}

const canProceed = computed(() => {
  return (
    store.diagnosis.diagnosis.trim() &&
    medications.value.some(med => med.name.trim())
  )
})

const nextStep = () => {
  store.diagnosis.prescription = JSON.stringify(medications.value)
  store.nextStep()
}

const prevStep = () => store.prevStep()

const saveDraft = () => {
  store.diagnosis.prescription = JSON.stringify(medications.value)
  store.saveDraft()
}

watch(medications, async () => {
  const meds = medications.value.map(m => m.name.trim()).filter(Boolean)
  const newInteractions = []

  for (let i = 0; i < meds.length; i++) {
    for (let j = i + 1; j < meds.length; j++) {
      const key = `${meds[i]}|${meds[j]}`
      if (shownInteractions.value.has(key)) continue

      try {
        const res = await axios.get('/api/drugs/interaction-check', {
          params: { drug1: meds[i], drug2: meds[j] }
        })

        if (res.data.interactions) {
          shownInteractions.value.add(key)
          newInteractions.push({
            drugA: meds[i],
            drugB: meds[j],
            description: res.data.interactions
          })
        }
      } catch (err) {
          if (axios.isAxiosError(err)) {
            const a = meds[i], b = meds[j]
            console.warn(`Could not check interaction between ${a} and ${b}`)
          }
      }
    }
  }

  if (newInteractions.length) {
    interactions.value.push(...newInteractions)
    await nextTick()
  }
}, { deep: true })

const resetInteractions = () => {
  interactions.value = []
  shownInteractions.value.clear()
}
</script>

<template>
  <div class="diagnosis-step">
    <h3>Diagnose & Prescribe</h3>
    
    <div class="prescribe-grid">
      <div class="prescribe-section">
        <h4>Diagnosis</h4>
        <textarea
          v-model="store.diagnosis.diagnosis"
          class="prescribe-textarea"
          placeholder="Enter primary diagnosis and any secondary diagnoses"
        ></textarea>
        
        <div class="diagnosis-actions">
          <button 
            v-for="item in commonDiagnoses"
            :key="item"
            class="diagnosis-chip"
            @click="addDiagnosis(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <div class="prescribe-section">
        <h4>Prescription</h4>
        <div class="medication-list">
          <div v-for="(med, index) in medications" :key="index" class="medication-item">
            <input v-model="med.name" placeholder="Medication name" class="input" />
            <input v-model="med.dose" placeholder="Dosage" class="input" />
            <input v-model="med.frequency" placeholder="Frequency" class="input" />
            <button @click="removeMedication(index)" class="remove-btn">×</button>
          </div>
          <button @click="addMedication" class="add-med-btn">+ Add Medication</button>
        </div>
      </div>
    </div>

    <div class="step-actions">
        <div class="left-actions">
            <button class="btn-outline" @click="prevStep">← Back</button>
            <button class="btn-outline" @click="saveDraft">Save Draft</button>
        </div>
        <button 
            class="btn-primary next-button" 
            :disabled="!canProceed"
            @click="nextStep"
        >
            Next: Treatmeant Plan →
        </button>
    </div>

    <div v-if="interactions.length" class="interaction-popup">
      <h4>⚠ Drug Interactions Detected</h4>
      <ul>
        <li v-for="(i, idx) in interactions" :key="idx">
          <strong>{{ i.drugA }} + {{ i.drugB }}:</strong> {{ i.description }}
        </li>
      </ul>
      <button class="dismiss-btn" @click="resetInteractions">Dismiss</button>
    </div>

  </div>
</template>

<style scoped>
.prescribe-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 1.5rem 0;
}

.prescribe-section {
  background: #f9fafc;
  padding: 1.5rem;
  border-radius: 8px;
}

.prescribe-textarea {
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.diagnosis-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.diagnosis-chip {
  background: #e3f2fd;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.diagnosis-chip:hover {
  background: #bbdefb;
}

.medication-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.medication-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

.add-med-btn {
  background: #e3f2fd;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
}

.remove-btn {
  background: #ffebee;
  color: #c62828;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
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

.interaction-popup {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0,0,0,0.15);
  z-index: 1000;
  max-width: 400px;
}

.interaction-popup h4 {
  margin: 0 0 0.5rem;
}

.interaction-popup ul {
  margin: 0;
  padding-left: 1rem;
}

.dismiss-btn {
  margin-top: 1rem;
  background: #856404;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
}

</style>