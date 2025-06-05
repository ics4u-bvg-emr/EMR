<template>
  <main class="patient-edit-screen" ref="pdfRef">
    <div class="header-row">
      <div class="avatar"></div>
      <div>
        <h2 class="patient-name">{{ patient.name }}</h2>
        <div class="patient-meta">
          {{ patient.gender }} &middot; {{ patient.age }} years ({{ patient.dob }})
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-primary btn-save" @click="savePatient">Save</button>
        <button class="btn-outline" @click="cancelEdit">Cancel</button>
        <button class="btn-outline" @click="exportReferralPdf()">Download Referral</button>
        <button class="btn-outline" @click="exportPrescriptionPdf()">Download Prescription</button>
      </div>
    </div>

    <div class="tabs-row">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-btn', { active: currentTab === tab }]"
        @click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <section v-if="currentTab === 'Summary'" class="edit-grid" ref="pdfRef">
      <!-- Diseases -->
      <div class="edit-card">
        <div class="card-header">
          <span>Diseases</span>
        </div>
        <ul>
          <li v-for="(disease, i) in patient.diseases" :key="i">
            <input v-model="patient.diseases[i]" class="input" />
            <button class="remove-btn" @click="removeDisease(i)">×</button>
          </li>
        </ul>
        <button class="add-btn" @click="addDisease">+ Add Disease</button>
      </div>

      <!-- Vitals -->
      <div class="edit-card">
        <div class="card-header">
          <span>Recent Vitals</span>
        </div>
        <div class="vitals-list">
          <label>Height: <input v-model="patient.vitals.height" class="input" /></label>
          <label>Weight: <input v-model="patient.vitals.weight" class="input" /></label>
          <label>Temp: <input v-model="patient.vitals.temp" class="input" /></label>
          <label>BMI: <input v-model="patient.vitals.bmi" class="input" /></label>
          <label>BP: <input v-model="patient.vitals.bp" class="input" /></label>
          <label>Pulse: <input v-model="patient.vitals.pulse" class="input" /></label>
          <label>O2 Sat: <input v-model="patient.vitals.o2sat" class="input" /></label>
        </div>
      </div>

      <!-- Allergies -->
      <div class="edit-card">
        <div class="card-header">
          <span>Allergies</span>
        </div>
        <ul>
          <li v-for="(allergy, i) in patient.allergies" :key="i">
            <input v-model="patient.allergies[i]" class="input" />
            <button class="remove-btn" @click="removeAllergy(i)">×</button>
          </li>
        </ul>
        <button class="add-btn" @click="addAllergy">+ Add Allergy</button>
      </div>

      <!-- Medications -->
      <div class="edit-card">
        <div class="card-header">
          <span>Medications</span>
        </div>
        <ul>
          <li v-for="(med, i) in patient.medications" :key="i" class="med-row">
            <input v-model="med.name" class="input" placeholder="Name" />
            <input v-model="med.dose" class="input" placeholder="Dose" />
            <button class="remove-btn" @click="removeMedication(i)">×</button>
          </li>
        </ul>
        <button class="add-btn" @click="addMedication">+ Add Medication</button>
      </div>

      <!-- History -->
      <div class="edit-card">
        <div class="card-header">
          <span>Other History</span>
        </div>
        <ul>
          <li v-for="(event, i) in patient.history" :key="i">
            <input v-model="patient.history[i]" class="input" />
            <button class="remove-btn" @click="removeHistory(i)">×</button>
          </li>
        </ul>
        <button class="add-btn" @click="addHistory">+ Add Event</button>
      </div>

      <!-- Encounters -->
      <div class="edit-card">
        <div class="card-header">
          <span>Encounters</span>
        </div>
        <ul>
          <li v-for="(enc, i) in patient.encounters" :key="i" class="enc-row">
            <input v-model="enc.date" class="input" placeholder="Date" />
            <input v-model="enc.status" class="input" placeholder="Status" />
            <button class="remove-btn" @click="removeEncounter(i)">×</button>
          </li>
        </ul>
        <button class="add-btn" @click="addEncounter">+ Add Encounter</button>
      </div>
    </section>

    <section v-if="currentTab === 'Diagnose'">
      <div class="horizontal-timeline">
        <div
          v-for="(step, idx) in diagnoseSteps"
          :key="step.label"
          class="timeline-step-horizontal"
        >
          <div
            class="timeline-circle-horizontal"
            :class="{
              active: currentStep === idx,
              completed: idx < currentStep
            }"
          >
            {{ idx + 1 }}
          </div>
          <div class="timeline-label" v-html="step.label.replace(/\n/g, '<br>')"></div>
          <div v-if="currentStep === idx" class="timeline-step-indicator">Current Step</div>
        </div>
      </div>
      <div class="timeline-fields">
        <!-- Step 1: Symptoms -->
        <div v-if="currentStep === 0">
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
                v-model="diagnoseFields.symptoms"
              />
              {{ symptom }}
            </label>
            <label class="symptom-checkbox">
              <input
                type="checkbox"
                value="Other"
                v-model="diagnoseFields.symptoms"
                @change="showOtherSymptom = !showOtherSymptom"
              />
              Other
            </label>
            <input
              v-if="showOtherSymptom"
              v-model="diagnoseFields.otherSymptom"
              class="input"
              placeholder="Describe other symptom"
            />
          </div>
          <button
            class="btn-primary"
            :disabled="!canProceedSymptoms"
            @click="nextStep"
          >
            Next
          </button>
        </div>
        <!-- Step 2: Examination -->
        <div v-else-if="currentStep === 1">
          <h3>Examination</h3>
          <div class="exam-section">
            <div class="exam-group">
              <div class="exam-title">General</div>
              <div class="exam-row">
                <div class="exam-field">
                  <label>Temperature</label>
                  <input v-model="diagnoseFields.examinationFields.temperature" type="text" placeholder="°C" />
                </div>
                <div class="exam-field">
                  <label>Pulse rate</label>
                  <input v-model="diagnoseFields.examinationFields.pulse" type="text" placeholder="bpm" />
                </div>
                <div class="exam-field">
                  <label>Blood pressure</label>
                  <input v-model="diagnoseFields.examinationFields.bp" type="text" placeholder="mmHg" />
                </div>
                <div class="exam-field">
                  <label>Respiratory rate</label>
                  <input v-model="diagnoseFields.examinationFields.resp" type="text" placeholder="bpm" />
                </div>
                <div class="exam-field">
                  <label>SPO2</label>
                  <input v-model="diagnoseFields.examinationFields.spo2" type="text" placeholder="%" />
                </div>
              </div>
              <div class="exam-row">
                <div class="exam-field">
                  <label>Weight</label>
                  <input v-model="diagnoseFields.examinationFields.weight" type="text" placeholder="kg" />
                </div>
                <div class="exam-field">
                  <label>Height</label>
                  <input v-model="diagnoseFields.examinationFields.height" type="text" placeholder="cm" />
                </div>
                <div class="exam-field">
                  <label>Waist circumference</label>
                  <input v-model="diagnoseFields.examinationFields.waist" type="text" placeholder="cm" />
                </div>
                <div class="exam-field">
                  <label>BMI</label>
                  <input v-model="diagnoseFields.examinationFields.bmi" type="text" placeholder="" />
                </div>
              </div>
            </div>
            <div class="exam-group exam-accordion">
              <div class="exam-accordion-title" @click="toggleExamAccordion('cholesterol')">
                Cholestrol &amp; heart function
              </div>
              <div v-if="examAccordion.cholesterol" class="exam-accordion-content">
                <div class="exam-row">
                  <div class="exam-field">
                    <label>LDL</label>
                    <input v-model="diagnoseFields.examinationFields.ldl" type="text" placeholder="mg/dL" />
                  </div>
                  <div class="exam-field">
                    <label>HDL</label>
                    <input v-model="diagnoseFields.examinationFields.hdl" type="text" placeholder="mg/dL" />
                  </div>
                  <div class="exam-field">
                    <label>Triglycerides</label>
                    <input v-model="diagnoseFields.examinationFields.triglycerides" type="text" placeholder="mg/dL" />
                  </div>
                </div>
              </div>
              <div class="exam-accordion-title" @click="toggleExamAccordion('dipstick')">
                Dipstick tests
              </div>
              <div v-if="examAccordion.dipstick" class="exam-accordion-content">
                <div class="exam-row">
                  <div class="exam-field">
                    <label>Protein</label>
                    <input v-model="diagnoseFields.examinationFields.protein" type="text" />
                  </div>
                  <div class="exam-field">
                    <label>Glucose</label>
                    <input v-model="diagnoseFields.examinationFields.dipstickGlucose" type="text" />
                  </div>
                  <div class="exam-field">
                    <label>Blood</label>
                    <input v-model="diagnoseFields.examinationFields.blood" type="text" />
                  </div>
                </div>
              </div>
              <div class="exam-accordion-title" @click="toggleExamAccordion('glucose')">
                Glucose &amp; diabetes
              </div>
              <div v-if="examAccordion.glucose" class="exam-accordion-content">
                <div class="exam-row">
                  <div class="exam-field">
                    <label>Fasting glucose</label>
                    <input v-model="diagnoseFields.examinationFields.fastingGlucose" type="text" placeholder="mg/dL" />
                  </div>
                  <div class="exam-field">
                    <label>HbA1c</label>
                    <input v-model="diagnoseFields.examinationFields.hba1c" type="text" placeholder="%" />
                  </div>
                </div>
              </div>
              <div class="exam-accordion-title" @click="toggleExamAccordion('other')">
                Other
              </div>
              <div v-if="examAccordion.other" class="exam-accordion-content">
                <textarea v-model="diagnoseFields.examinationFields.other" class="timeline-textarea" placeholder="Other findings"></textarea>
              </div>
            </div>
          </div>
          <button
            class="btn-primary"
            :disabled="!canProceedExamination"
            @click="nextStep"
          >
            Next
          </button>
        </div>
        <!-- Step 3: Diagnose & Prescribe -->
        <div v-else-if="currentStep === 2">
          <h3>Diagnose &amp; Prescribe</h3>
          <textarea
            v-model="diagnoseFields.diagnosis"
            class="timeline-textarea"
            placeholder="Enter diagnosis"
          ></textarea>
          <textarea
            v-model="diagnoseFields.prescription"
            class="timeline-textarea"
            placeholder="Enter prescriptions"
          ></textarea>
          <button
            class="btn-primary"
            :disabled="!diagnoseFields.diagnosis.trim() || !diagnoseFields.prescription.trim()"
            @click="nextStep"
          >
            Next
          </button>
        </div>
        <!-- Step 4: Plan -->
        <div v-else-if="currentStep === 3">
          <h3>Plan</h3>
          <textarea
            v-model="diagnoseFields.plan"
            class="timeline-textarea"
            placeholder="Outline the treatment plan"
          ></textarea>
          <button
            class="btn-primary"
            :disabled="!diagnoseFields.plan.trim()"
            @click="finishDiagnose"
          >
            Finish
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import axios from 'axios'

const router = useRouter()
const pdfInput = ref()
const tabs = ref(['Summary', 'Diagnose'])
const currentTab = ref('Summary')

const patient = ref({
  name: 'Jessica Rose',
  gender: 'Female',
  age: 36,
  dob: '07.02.1987',
  diseases: ['Meningitis', 'Migraines', 'Asthma'],
  vitals: {
    height: '68 in',
    weight: '157 lbs',
    temp: '98.6 F oral',
    bmi: '28.4',
    bp: '126/79',
    pulse: '73',
    o2sat: '98% RA'
  },
  allergies: ['Penicillin'],
  medications: [
    { name: 'Flexeril', dose: '5gm oral tablet' },
    { name: 'Lisinopril', dose: '500mg oral tablet' },
    { name: 'Naproxen', dose: '500mg 2x day' }
  ],
  history: ['Appendectomy'],
  encounters: [
    { date: 'Feb 16, 2023', status: 'Scheduled' },
    { date: 'Sep 27, 2023', status: 'Not recorded' }
  ]
})

const doctor = { //fits backend schema btw
  firstName: 'Eric',
  lastName: 'Tan',
  specialization: 'General Practitioner',
  contact: {
    phoneNumber: '911',
    email: 'etan@bvgcare.co.za',
    address: 'Young Street'
  }
}

const pdfRef = ref(null);

const exportReferralPdf = () => {
  const doc = new jsPDF()
  let y = 20

  doc.setFillColor(34, 45, 65)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.rect(0, 0, 210, 20, 'F')
  doc.text('Patient Referral Summary', 105, 14, { align: 'center' })

  y = 30
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(33, 37, 41)

  const drawSection = (title, lines) => {
    doc.setFontSize(13)
    doc.setTextColor(33, 150, 243)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 20, y)
    y += 5
    doc.setDrawColor(33, 150, 243)
    doc.setLineWidth(0.5)
    doc.line(20, y, 190, y)
    y += 6
    doc.setTextColor(50, 50, 50)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    lines.forEach(line => {
      if (y > 280) { doc.addPage(); y = 20 }
      doc.text(line, 25, y)
      y += 7
    })
    y += 4
  }

  drawSection('Referring Doctor', [
    `Dr ${doctor.firstName} ${doctor.lastName}`,
    `Specialization: ${doctor.specialization}`,
    `Phone: ${doctor.contact.phoneNumber}`,
    `Email: ${doctor.contact.email}`,
    `Address: ${doctor.contact.address}`
  ])

  drawSection('Notes for Referred Physician', [
    'jeff was here ',
    'make some notes thingy and yaaa'
  ])


  const vitals = patient.value.vitals
  drawSection('Patient Info', [
    `Name: ${patient.value.name}`,
    `Gender: ${patient.value.gender}`,
    `Age: ${patient.value.age}`,
    `DOB: ${patient.value.dob}`
  ])

  drawSection('Diseases', patient.value.diseases.map(d => `- ${d}`))
  drawSection('Vitals', Object.entries(vitals).map(([k, v]) => `${k}: ${v}`))
  drawSection('Allergies', patient.value.allergies.length ? patient.value.allergies.map(a => `- ${a}`) : ['None'])
  drawSection('Medications', patient.value.medications.map(m => `- ${m.name} (${m.dose})`))
  drawSection('Surgical & Medical History', patient.value.history.map(h => `- ${h}`))
  drawSection('Recent Encounters', patient.value.encounters.map(e => `- ${e.date}: ${e.status}`))

  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text('Generated by BVGCare', 105, 290, { align: 'center' })

  doc.save(`${patient.value.name.replace(/\s/g, '_')}_Referral.pdf`)
}

function exportPrescriptionPdf() {
  const doc = new jsPDF()

  doc.setFillColor(34, 45, 65)
  doc.rect(0, 0, 210, 20, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Prescription', 105, 14, { align: 'center' })

  let y = 30
  doc.setFontSize(13)
  doc.setTextColor(33, 37, 41)
  doc.setFont('helvetica', 'bold')
  doc.text(`Dr ${doctor.firstName} ${doctor.lastName}`, 20, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  y += 7
  doc.text(`${doctor.specialization}`, 20, y)
  y += 6
  doc.text(`Phone: ${doctor.contact.phoneNumber}`, 20, y)
  y += 6
  doc.text(`Email: ${doctor.contact.email}`, 20, y)
  y += 6
  doc.text(`Address: ${doctor.contact.address}`, 20, y)

  y = 30
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`Patient: ${patient.value.name}`, 140, y)
  y += 7
  doc.text(`Age: ${patient.value.age} (${patient.value.gender})`, 140, y)
  y += 7
  doc.text(`DOB: ${patient.value.dob}`, 140, y)
  y += 7
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, y)

  y = 80
  doc.setDrawColor(33, 150, 243)
  doc.setLineWidth(0.6)
  doc.line(20, y, 190, y)
  y += 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(33, 150, 243)
  doc.text('Medications', 20, y)
  y += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  patient.value.medications.forEach(med => {
    doc.text(`• ${med.name} (${med.dose})`, 25, y)
    y += 7
  })

  y += 15
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(11)
  doc.text('Signature: ______________________', 20, y)

  doc.setFontSize(9)
  doc.setTextColor(130, 130, 130)
  doc.text('Generated by BVGCare', 105, 290, { align: 'center' })//this is aura

  doc.save(`${patient.value.name.replace(/\s/g, '_')}_Prescription.pdf`)
}

function addDisease() {
  patient.value.diseases.push('')
}
function removeDisease(i) {
  patient.value.diseases.splice(i, 1)
}
function addAllergy() {
  patient.value.allergies.push('')
}
function removeAllergy(i) {
  patient.value.allergies.splice(i, 1)
}
function addMedication() {
  patient.value.medications.push({ name: '', dose: '' })
}
function removeMedication(i) {
  patient.value.medications.splice(i, 1)
}
function addHistory() {
  patient.value.history.push('')
}
function removeHistory(i) {
  patient.value.history.splice(i, 1)
}
function addEncounter() {
  patient.value.encounters.push({ date: '', status: '' })
}
function removeEncounter(i) {
  patient.value.encounters.splice(i, 1)
}
function savePatient() {
  // Save logic here (API call, etc)
  alert('Patient saved!')
}
function cancelEdit() {
  router.back()
}

const diagnoseSteps = [
  { label: 'SYMPTOMS' },
  { label: 'EXAMINE' },
  { label: 'DIAGNOSE' },
  { label: 'PLAN' }
]
const currentStep = ref(0)
const showOtherSymptom = ref(false)
const diagnoseFields = ref({
  symptoms: [],
  otherSymptom: '',
  examinationFields: {
    temperature: '',
    pulse: '',
    bp: '',
    resp: '',
    spo2: '',
    weight: '',
    height: '',
    waist: '',
    bmi: '',
    ldl: '',
    hdl: '',
    triglycerides: '',
    protein: '',
    dipstickGlucose: '',
    blood: '',
    fastingGlucose: '',
    hba1c: '',
    other: ''
  },
  diagnosis: '',
  prescription: '',
  plan: ''
})

const examAccordion = ref({
  cholesterol: false,
  dipstick: false,
  glucose: false,
  other: false
})

function toggleExamAccordion(section) {
  examAccordion.value[section] = !examAccordion.value[section]
}

const commonSymptoms = [
  'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Vomiting', 'Diarrhea', 'Shortness of breath', 'Chest pain', 'Abdominal pain',
  'Back pain', 'Joint pain', 'Muscle pain', 'Sore throat', 'Runny nose', 'Sneezing', 'Rash', 'Dizziness', 'Palpitations', 'Swelling',
  'Weight loss', 'Weight gain', 'Night sweats', 'Chills', 'Loss of appetite', 'Blurred vision', 'Hearing loss', 'Ear pain', 'Nasal congestion', 'Itching',
  'Burning sensation', 'Frequent urination', 'Painful urination', 'Blood in urine', 'Constipation', 'Heartburn', 'Indigestion', 'Loss of taste', 'Loss of smell', 'Difficulty swallowing',
  'Hoarseness', 'Cramps', 'Tingling', 'Numbness', 'Memory loss', 'Confusion', 'Anxiety', 'Depression', 'Insomnia', 'Bruising'
]

const canProceedSymptoms = computed(() => {
  return (
    diagnoseFields.value.symptoms.length > 0 &&
    (!diagnoseFields.value.symptoms.includes('Other') || diagnoseFields.value.otherSymptom.trim())
  )
})

const canProceedExamination = computed(() => {
  // At least one field filled in general section
  const fields = diagnoseFields.value.examinationFields
  return (
    fields.temperature ||
    fields.pulse ||
    fields.bp ||
    fields.resp ||
    fields.spo2 ||
    fields.weight ||
    fields.height ||
    fields.waist ||
    fields.bmi
  )
})

function nextStep() {
  if (currentStep.value < diagnoseSteps.length - 1) {
    currentStep.value++
  }
}
function finishDiagnose() {
  // Finalize logic here
  alert('Diagnosis completed!')
}
</script>

<style scoped>
.patient-edit-screen {
  font-family: 'Geist Sans', sans-serif;
  min-height: 100vh;
  padding: 0;
}
.header-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.avatar {
  width: 70px;
  height: 70px;
  background: #d1d7e0;
  border-radius: 50%;
  margin-right: 1rem;
}
.patient-name {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: #2b2e3b;
}
.patient-meta {
  color: #7a7e8a;
  font-size: 1.1rem;
}
.header-actions {
  margin-left: auto;
  display: flex;
  gap: 1rem;
}
.btn-primary {
  background: #304ffe; /* blue for Save */
  color: #fff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(33,50,80,0.10);
}
.btn-primary:hover {
  background: #1a32b7; /* darker blue on hover */
}
.btn-primary:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}
.btn-outline {
  background: #fff;
  color: #757575; /* grey */
  border: 2px solid #757575; /* grey */
  padding: 0.7rem 1.5rem;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-outline:hover {
  background: #f5f5f5;
}
.tabs-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.tab-btn {
  background: #eaf2fa;
  border: none;
  padding: 0.8rem 2.2rem;
  font-size: 1.08rem;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  color: #24304a;
  font-weight: 500;
  opacity: 0.7;
  transition: background 0.2s, opacity 0.2s;
}
.tab-btn.active {
  background: #fff;
  opacity: 1;
  border-bottom: 2px solid #2196f3;
}
.edit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.edit-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(40, 44, 63, 0.13), 0 2px 8px rgba(33, 150, 243, 0.10);
  padding: 1.5rem 1.2rem;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  border: 1.5px solid #e2e5ed;
  transition: box-shadow 0.2s, border 0.2s;
}

.card-header {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #2b2e3b;
}

.edit-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem 0;
}

.edit-card li {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.input {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 5px 10px;
  margin-right: 0.5rem;
  width: 100%;
  font-size: 1rem;
  color: #262a33;
  background: #fff;
}

.add-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
  font-size: 0.97em;
  align-self: flex-start;
  transition: background 0.2s;
  box-shadow: 0 1px 4px 0 rgba(33,150,243,0.10);
}

.add-btn:hover {
  background: #1769aa;
}

.remove-btn {
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  padding: 0;
  box-shadow: 0 1px 4px 0 rgba(244,67,54,0.10);
}

.remove-btn:hover {
  background: #b71c1c;
}

.vitals-list label {
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  font-size: 1rem;
  color: #444;
}
.med-row, .enc-row {
  gap: 0.5rem;
}
@media (max-width: 1100px) {
  .edit-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 700px) {
  .edit-grid {
    grid-template-columns: 1fr;
  }
  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .header-actions {
    margin-left: 0;
  }
}
.timeline {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 2rem 0 0 2rem;
  position: relative;
}
.timeline-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  position: relative;
}
.timeline-circle {
  width: 36px;
  height: 36px;
  background: #2196f3;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.3rem;
  margin-right: 1.2rem;
  box-shadow: 0 2px 8px rgba(33,150,243,0.10);
  z-index: 1;
}
.timeline-content {
  background: #f7fafd;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  min-width: 220px;
  box-shadow: 0 1px 4px 0 rgba(33,150,243,0.06);
}
.timeline-line {
  width: 3px;
  height: 32px;
  background: #b3e0fc;
  margin: 0 17px;
  position: relative;
  left: 16px;
}
.horizontal-timeline {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 2.5rem 0 2rem 0;
  position: relative;
  min-height: 120px;
  width: 100%;
  gap: 0;
}
.timeline-step-horizontal {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  min-width: 120px;
  margin: 0;
  z-index: 2;
}
.timeline-circle-horizontal {
  width: 80px;
  height: 80px;
  background: #e0e0e0;
  color: #757575;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 2.5rem;
  margin-bottom: 0.3rem;
  border: none;
  box-shadow: 0 4px 16px 0 rgba(40, 44, 63, 0.18), 0 2px 8px rgba(33, 50, 80, 0.13);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.timeline-circle-horizontal.active {
  background: #304ffe;
  color: #fff;
}
.timeline-circle-horizontal.completed {
  background: #304ffe;
  color: #fff;
  opacity: 0.7;
}
.timeline-label {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.1rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
  margin-top: 0.05rem;
  line-height: 1.1;
  max-width: 110px;
  word-break: break-word;
  white-space: pre-line;
}
.timeline-bar-horizontal {
  display: none !important;
}
.timeline-step-indicator {
  margin-top: 0.2rem;
  font-size: 0.85rem;
  color: #304ffe;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: center;
}
/* Center the timeline and make it 1/4 width on large screens */
@media (min-width: 900px) {
  .horizontal-timeline {
    width: 35%;
    margin-left: auto;
    margin-right: auto;
  }
}
.timeline-fields {
  margin: 2rem auto 0 auto;
  max-width: 1100px;
  width: 100%;
  box-shadow: 0 4px 24px 0 rgba(40, 44, 63, 0.13), 0 2px 8px rgba(33, 50, 80, 0.10);
  border-radius: 18px;
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
}
.timeline-textarea {
  width: 100%;
  min-height: 80px;
  margin-bottom: 1.2rem;
  border: 1.5px solid #1a237e;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  font-size: 1.08rem;
  background: #f5f7fa;
  color: #222;
  resize: vertical;
  box-sizing: border-box;
  transition: border 0.2s;
  box-shadow: 0 1px 4px 0 rgba(33,50,80,0.08);
}
.timeline-textarea:focus {
  border: 1.5px solid #0d1333;
  outline: none;
}
.symptoms-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1.2rem;
  margin-bottom: 1.5rem;
  max-height: 260px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  background: #fafbfc;
}
.symptom-checkbox {
  display: flex;
  align-items: center;
  font-size: 1rem;
  gap: 0.4rem;
  min-width: 160px;
}
.exam-section {
  background: #fafbfc;
  border-radius: 12px;
  box-shadow: 0 1px 4px 0 rgba(33,150,243,0.06);
  padding: 2rem 2rem 1.5rem 2rem;
  margin-bottom: 2rem;
}
.exam-group {
  margin-bottom: 1.5rem;
}
.exam-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: #444;
}
.exam-row {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}
.exam-field {
  display: flex;
  flex-direction: column;
  min-width: 180px;
  flex: 1;
}
.exam-field label {
  font-size: 1rem;
  color: #888;
  margin-bottom: 0.3rem;
}
.exam-field input {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 1rem;
  color: #262a33;
  background: #fff;
}
.exam-accordion {
  background: #f3f3f3;
  border-radius: 10px;
  box-shadow: 0 1px 4px 0 rgba(33,150,243,0.03);
  padding: 0.5rem 1rem 1rem 1rem;
}
.exam-accordion-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #7a7e8a;
  margin: 1.1rem 0 0.5rem 0;
  cursor: pointer;
  transition: color 0.2s;
  user-select: none;
}
.exam-accordion-title:hover {
  color: #2196f3;
}
.exam-accordion-content {
  margin-bottom: 0.7rem;
  padding-left: 0.5rem;
}
.btn-save {
  background: #304ffe;
  color: #fff;
}
.btn-save:hover {
  background: #1a32b7;
}
.btn-primary {
  background: #304ffe; /* blue for Save */
  color: #fff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(33,50,80,0.10);
}
.btn-primary:hover {
  background: #1a32b7; /* darker blue on hover */
}
.btn-primary:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}
</style>
