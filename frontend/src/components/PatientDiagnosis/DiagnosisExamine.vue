<script setup>
import { ref, computed } from 'vue'
import { useDiagnosisStore } from './DiagnosisStore'
import ExamField from './ExamField.vue'
import ExamAccordion from './ExamAccordion.vue'

const store = useDiagnosisStore()
const openAccordion = ref(null)

const toggleAccordion = (section) => {
  openAccordion.value = openAccordion.value === section ? '' : section
}

const canProceed = computed(() => {
  const fields = store.diagnosis.examinationFields
  return fields.temperature || fields.pulse || fields.bp || fields.resp || fields.spo2
})

const nextStep = () => store.nextStep()
const prevStep = () => store.prevStep()
const saveDraft = () => store.saveDraft()
</script>

<template>
  <div class="diagnosis-step">
    <h3>Examination</h3>

    <div class="exam-section">
      <div class="exam-group">
        <div class="exam-title">General</div>
        <div class="exam-row">
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.temperature" 
            @update:modelValue="value => store.diagnosis.examinationFields.temperature = value"
            label="Temperature" 
            placeholder="°C" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.pulse" 
            @update:modelValue="value => store.diagnosis.examinationFields.pulse = value"
            label="Pulse rate" 
            placeholder="bpm" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.bp" 
            @update:modelValue="value => store.diagnosis.examinationFields.bp = value"
            label="Blood pressure" 
            placeholder="mmHg" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.resp" 
            @update:modelValue="value => store.diagnosis.examinationFields.resp = value"
            label="Respiratory rate" 
            placeholder="bpm" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.spo2" 
            @update:modelValue="value => store.diagnosis.examinationFields.spo2 = value"
            label="SPO2" 
            placeholder="%" 
          />
        </div>
        <div class="exam-row">
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.weight" 
            @update:modelValue="value => store.diagnosis.examinationFields.weight = value"
            label="Weight" 
            placeholder="kg" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.height" 
            @update:modelValue="value => store.diagnosis.examinationFields.height = value"
            label="Height" 
            placeholder="cm" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.waist" 
            @update:modelValue="value => store.diagnosis.examinationFields.waist = value"
            label="Waist circumference" 
            placeholder="cm" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.bmi" 
            @update:modelValue="value => store.diagnosis.examinationFields.bmi = value"
            label="BMI" 
          />
        </div>
      </div>

      <ExamAccordion title="Cholesterol & heart function" :open="openAccordion === 'cholesterol'" @toggle="toggleAccordion('cholesterol')">
        <div class="exam-row">
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.ldl" 
            @update:modelValue="value => store.diagnosis.examinationFields.ldl = value"
            label="LDL" 
            placeholder="mg/dL" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.hdl" 
            @update:modelValue="value => store.diagnosis.examinationFields.hdl = value"
            label="HDL" 
            placeholder="mg/dL" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.triglycerides" 
            @update:modelValue="value => store.diagnosis.examinationFields.triglycerides = value"
            label="Triglycerides" 
            placeholder="mg/dL" 
          />
        </div>
      </ExamAccordion>

      <ExamAccordion title="Dipstick tests" :open="openAccordion === 'dipstick'" @toggle="toggleAccordion('dipstick')">
        <div class="exam-row">
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.protein" 
            @update:modelValue="value => store.diagnosis.examinationFields.protein = value"
            label="Protein" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.dipstickGlucose" 
            @update:modelValue="value => store.diagnosis.examinationFields.dipstickGlucose = value"
            label="Glucose" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.blood" 
            @update:modelValue="value => store.diagnosis.examinationFields.blood = value"
            label="Blood" 
          />
        </div>
      </ExamAccordion>

      <ExamAccordion title="Glucose & diabetes" :open="openAccordion === 'glucose'" @toggle="toggleAccordion('glucose')">
        <div class="exam-row">
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.fastingGlucose" 
            @update:modelValue="value => store.diagnosis.examinationFields.fastingGlucose = value"
            label="Fasting glucose" 
            placeholder="mg/dL" 
          />
          <ExamField 
            :modelValue="store.diagnosis.examinationFields.hba1c" 
            @update:modelValue="value => store.diagnosis.examinationFields.hba1c = value"
            label="HbA1c" 
            placeholder="%" 
          />
        </div>
      </ExamAccordion>

      <ExamAccordion title="Other findings" :open="openAccordion === 'other'" @toggle="toggleAccordion('other')">
        <textarea 
          :value="store.diagnosis.examinationFields.other" 
          @input="store.diagnosis.examinationFields.other = $event.target.value"
          class="exam-textarea" 
          placeholder="Other examination findings"
        ></textarea>
      </ExamAccordion>
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
            Next: Diagnosis →
        </button>
    </div>
  </div>
</template>

<style scoped>
.exam-section {
  margin: 1.5rem 0;
}

.exam-group {
  margin-bottom: 1.5rem;
}

.exam-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #444;
}

.exam-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.exam-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
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