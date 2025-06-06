<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDiagnosisStore } from './DiagnosisStore'
import DiagnosisSymptoms from './DiagnosisSymptoms.vue'
import DiagnosisExamine from './DiagnosisExamine.vue'
import DiagnosisPrescribe from './DiagnosisPrescribe.vue'
import DiagnosisPlan from './DiagnosisPlan.vue'

const route = useRoute()
const store = useDiagnosisStore()

const steps = [
  { label: 'SYMPTOMS', component: DiagnosisSymptoms },
  { label: 'EXAMINE', component: DiagnosisExamine },
  { label: 'PRESCRIBE', component: DiagnosisPrescribe },
  { label: 'PLAN', component: DiagnosisPlan }
]

const currentComponent = computed(() => steps[store.currentStep].component)

// Initialize with patient ID
onMounted(() => {
  store.setPatientId(route.params.id)
  // Load any existing diagnosis data here if needed
})

const completeDiagnosis = () => {
  store.completeDiagnosis()
  // You might want to emit an event or redirect here
}
</script>

<template>
  <div class="diagnosis-flow-container">
    <div class="horizontal-timeline">
      <div
        v-for="(step, idx) in steps"
        :key="step.label"
        class="timeline-step-horizontal"
      >
        <div
          class="timeline-circle-horizontal"
          :class="{
            active: store.currentStep === idx,
            completed: idx < store.currentStep
          }"
        >
          {{ idx + 1 }}
        </div>
        <div class="timeline-label">{{ step.label }}</div>
        <div v-if="store.currentStep === idx" class="timeline-step-indicator">
          Current Step
        </div>
      </div>
    </div>

    <component 
      :is="currentComponent" 
      @next="store.nextStep" 
      @prev="store.prevStep" 
      @save="store.saveDraft"
      @complete="completeDiagnosis"
    />
  </div>
</template>

<style scoped>
.diagnosis-flow-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.horizontal-timeline {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-step-horizontal {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.timeline-circle-horizontal {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #757575;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.timeline-circle-horizontal.active {
  background: #304ffe;
  color: white;
  transform: scale(1.1);
}

.timeline-circle-horizontal.completed {
  background: #304ffe;
  color: white;
  opacity: 0.8;
}

.timeline-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timeline-step-indicator {
  font-size: 0.8rem;
  color: #304ffe;
  font-weight: 600;
  margin-top: 4px;
}
</style>