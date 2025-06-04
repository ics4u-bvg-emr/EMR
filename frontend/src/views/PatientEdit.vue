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
        <button class="btn-primary" @click="savePatient">Save</button>
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
    <!-- Timeline/Profile tabs can be added here -->
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import axios from 'axios'

const router = useRouter()
const pdfInput = ref()
const tabs = ref(['Summary', 'Timeline', 'Profile'])
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
</script>

<style scoped>
.patient-edit-screen {
  font-family: 'Geist Sans', sans-serif;
  background: #fff;
  min-height: 100vh;
  padding: 0; /* Removed padding */
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
  background: #ff9800;
  color: #fff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #e68900;
}
.btn-outline {
  background: #fff;
  color: #ff9800;
  border: 2px solid #ff9800;
  padding: 0.7rem 1.5rem;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-outline:hover {
  background: #fff3e0;
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
</style>
