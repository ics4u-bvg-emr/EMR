<template>
  <main class="patient-edit-screen">
    <div v-if="loading" class="notification is-info">Loading patient data...</div>
    <div v-else-if="error" class="notification is-danger">{{ error }}</div>
    <div v-else>
      <!-- Header -->
      <div class="header-row">
        <div class="avatar"></div>
        <div>
          <h2 class="patient-name">{{ patient.firstName }} {{ patient.lastName }}</h2>
          <div class="patient-meta">
            {{ patient.sex }} &middot; {{ age }} years ({{ formatDate(patient.dateOfBirth) }})
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-primary" @click="savePatient">Save</button>
          <button class="btn-outline" @click="cancelEdit">Cancel</button>
        </div>
      </div>

      <!-- Tabs -->
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

      <!-- Summary Tab -->
      <section v-if="currentTab === 'Summary'" class="section" style="padding: 0; margin: 0;">
        <div class="columns is-multiline is-variable is-5">

          <!-- BASIC INFO -->
          <div class="column is-half">
            <div class="box">
              <div class="level is-mobile">
                <span class="title is-6">Basic Info</span>
                <button class="button is-small is-light ml-auto" @click="editing.basic = !editing.basic">
                  {{ editing.basic ? 'Done' : 'Edit' }}
                </button>
              </div>
              <div v-if="editing.basic">
                <div class="field"><label class="label">Sex</label><input v-model="patient.sex" class="input" /></div>
                <div class="field"><label class="label">Date of Birth</label><input v-model="patient.dateOfBirth" class="input" type="date" /></div>
                <div class="field"><label class="label">Height (cm)</label><input v-model="patient.height" class="input" type="number" /></div>
                <div class="field"><label class="label">Weight (kg)</label><input v-model="patient.weight" class="input" type="number" /></div>
              </div>
              <div v-else>
                <p>Sex: {{ patient.sex }}</p>
                <p>Date of Birth: {{ formatDate(patient.dateOfBirth) }}</p>
                <p>Height: {{ patient.height }} cm</p>
                <p>Weight: {{ patient.weight }} kg</p>
              </div>
            </div>
          </div>

          <!-- CONTACT INFO -->
          <div class="column is-half">
            <div class="box">
              <div class="level is-mobile">
                <span class="title is-6">Contact Info</span>
                <button class="button is-small is-light ml-auto" @click="editing.contact = !editing.contact">
                  {{ editing.contact ? 'Done' : 'Edit' }}
                </button>
              </div>
              <div v-if="editing.contact">
                <div class="field"><label class="label">Phone</label><input v-model="patient.contactInfo.phoneNumber" class="input" /></div>
                <div class="field"><label class="label">Email</label><input v-model="patient.contactInfo.email" class="input" /></div>
                <div class="field"><label class="label">Address</label><input v-model="patient.contactInfo.address" class="input" /></div>
              </div>
              <div v-else>
                <p>Phone: {{ patient.contactInfo.phoneNumber }}</p>
                <p>Email: {{ patient.contactInfo.email }}</p>
                <p>Address: {{ patient.contactInfo.address }}</p>
              </div>
            </div>
          </div>

          <!-- ALLERGIES + UPCOMING APPT -->
          <div class="column is-half">
            <div class="box">
              <div class="level is-mobile">
                <span class="title is-6">Allergies</span>
                <button class="button is-small is-light ml-auto" @click="editing.allergies = !editing.allergies">
                  {{ editing.allergies ? 'Done' : 'Edit' }}
                </button>
              </div>
              <div v-if="editing.allergies">
                <ul>
                  <li v-for="(item, i) in patient.allergies" :key="i" class="mb-2 is-flex is-align-items-center">
                    <input v-model="patient.allergies[i]" class="input mr-2" />
                    <button class="remove-btn" @click="patient.allergies.splice(i, 1)">x</button>
                  </li>
                </ul>
                <button class="add-btn" @click="patient.allergies.push('')">+ Add Allergy</button>
              </div>
              <div v-else>
                <p>{{ patient.allergies.join(', ') || 'None' }}</p>
              </div>
            </div>

            <!-- PAST APPTS -->
            <div class="box mt-4">
              <p class="title is-6 clickable" @click="togglePastAppointments">
                Past Appointments
                <span v-if="showPastAppointments">▲</span>
                <span v-else>▼</span>
              </p>
              <ul v-show="showPastAppointments">
                <li v-for="appt in pastAppointments" :key="appt._id" class="mb-3">
                  <p><strong>{{ formatDateTime(appt.start) }}</strong></p>
                  <p>Notes: {{ appt.notes || 'N/A' }}</p>
                </li>
              </ul>
            </div>
          </div>

          <!-- MEDICAL HISTORY + PAST APPTS -->
          <div class="column is-half">
            <div class="box">
              <div class="level is-mobile">
                <span class="title is-6">Medical History</span>
                <button class="button is-small is-light ml-auto" @click="editing.medicalHistory = !editing.medicalHistory">
                  {{ editing.medicalHistory ? 'Done' : 'Edit' }}
                </button>
              </div>
              <div v-if="editing.medicalHistory">
                <label class="label">Past Conditions</label>
                <ul>
                  <li v-for="(item, i) in patient.medicalHistory.pastConditions" :key="i" class="mb-2 is-flex">
                    <input v-model="patient.medicalHistory.pastConditions[i]" class="input mr-2" />
                    <button class="remove-btn" @click="patient.medicalHistory.pastConditions.splice(i, 1)">x</button>
                  </li>
                </ul>
                <button class="add-btn" @click="patient.medicalHistory.pastConditions.push('')">+ Add Condition</button>

                <label class="label">Current Prescriptions</label>
                <ul>
                  <li v-for="(item, i) in patient.medicalHistory.currentPrescriptions" :key="i" class="mb-2 is-flex">
                    <input v-model="patient.medicalHistory.currentPrescriptions[i]" class="input mr-2" />
                    <button class="remove-btn" @click="patient.medicalHistory.currentPrescriptions.splice(i, 1)">x</button>
                  </li>
                </ul>
                <button class="add-btn" @click="patient.medicalHistory.currentPrescriptions.push('')">+ Add Presciption</button>

                <label class="label">Family History</label>
                <ul>
                  <li v-for="(item, i) in patient.medicalHistory.familyHistory" :key="i" class="mb-2 is-flex">
                    <input v-model="patient.medicalHistory.familyHistory[i]" class="input mr-2" />
                    <button class="remove-btn" @click="patient.medicalHistory.familyHistory.splice(i, 1)">x</button>
                  </li>
                </ul>
                <button class="add-btn" @click="patient.medicalHistory.familyHistory.push('')">+ Add Family History</button>

                <label class="label">Notes</label>
                <textarea v-model="patient.medicalHistory.notes" class="textarea"></textarea>
              </div>
              <div v-else>
                <p><strong>Past Conditions:</strong> {{ patient.medicalHistory.pastConditions.join(', ') || 'None' }}</p>
                <p><strong>Current Prescriptions:</strong> {{ patient.medicalHistory.currentPrescriptions.join(', ') || 'None' }}</p>
                <p><strong>Family History:</strong> {{ patient.medicalHistory.familyHistory.join(', ') || 'None' }}</p>
                <p><strong>Notes:</strong> {{ patient.medicalHistory.notes || 'None' }}</p>
              </div>
            </div>
            <!-- UPCOMING APPT -->
            <div class="box mt-4">
              <p class="title is-6">Upcoming Appointment</p>
              <div v-if="upcomingAppointment">
                <p><strong>{{ formatDateTime(upcomingAppointment.start) }}</strong></p>
                <p>{{ upcomingAppointment.reason }}</p>
                <p>Status: {{ upcomingAppointment.status }}</p>
              </div>
              <div v-else>
                <p>No upcoming appointments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Diagnose Tab -->
      <section v-if="currentTab === 'Diagnose'">
        <DiagnosisFlow />
      </section>
    </div>
  </main>
</template>

<script setup>
import DiagnosisFlow from '@/components/PatientDiagnosis/DiagnosisFlow.vue'
import { ref, computed, onMounted, watch} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import axios from 'axios';
import dayjs from 'dayjs';

const router = useRouter()
const route = useRoute()
const patientId = route.params.id;

const pdfInput = ref()
const tabs = ref(['Summary', 'Diagnose'])
const currentTab = ref('Summary')

const appointments = ref([]);
const showPastAppointments = ref(true);
const loading = ref(false)
const error = ref(null)

const patient = ref({
  firstName: '',
  lastName: '',
  sex: '',
  dateOfBirth: '',
  height: 0,
  weight: 0,
  contactInfo: {
    phoneNumber: '',
    email: '',
    address: '',
  },
  allergies: [],
  medicalHistory: {
    pastConditions: [],
    currentPrescriptions: [],
    familyHistory: [],
    notes: '',
  },
});

// Track which sections are in edit mode
const editing = ref({
  medicalHistory: false,
  allergies: false
});

// Calculate age from DOB
const age = computed(() => {
  if (!patient.value.dateOfBirth) return 0
  const birthDate = new Date(patient.value.dateOfBirth)
  const ageDifMs = Date.now() - birthDate.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
})

// Fetch patient data
const fetchPatient = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get(`https://emr-backend-h03z.onrender.com/api/patients/${patientId}`)
    patient.value = response.data
  } catch (err) {
    error.value = 'Error loading patient: ' + err.message
  } finally {
    loading.value = false
  }
}

const fetchAppointments = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await axios.get(`https://emr-backend-h03z.onrender.com/api/appointments?patientId=${patientId}`);
    appointments.value = data;
  } catch (err) {
    error.value = 'Error loading appointments: ' + err.message
  } finally {
    loading.value = false
  }
};

// Save patient data
const savePatient = async () => {
  try {
    if (patientId) {
      await axios.put(`https://emr-backend-h03z.onrender.com/api/patients/${patientId}`, patient.value)
    } else {
      const response = await axios.post('https://emr-backend-h03z.onrender.com/api/patients', patient.value)
      router.push(`/patients/${response.data._id}`)
    }
    alert('Patient saved successfully!')
  } catch (error) {
    console.error('Error saving patient:', error)
    alert('Failed to save patient')
  }
}

// Load patient data when component mounts
onMounted(async () => {
  fetchPatient(), fetchAppointments();
  loading.value = false;
});

// Date formatting helpers
const formatDate = (dateStr) => {
  return dayjs(dateStr).format('MMM D, YYYY');
};

const formatDateTime = (datetimeStr) => {
  return dayjs(datetimeStr).format('MMM D, YYYY h:mm A');
};

// Sorted appointments
const sortedAppointments = computed(() => {
  return [...appointments.value].sort((a, b) => new Date(a.start) - new Date(b.start));
});

const upcomingAppointment = computed(() => {
  const now = new Date();
  return sortedAppointments.value.find(appt => new Date(appt.start) > now);
});

const pastAppointments = computed(() => {
  const now = new Date();
  return sortedAppointments.value
    .filter(appt => new Date(appt.start) <= now)
    .sort((a, b) => new Date(b.start) - new Date(a.start));
});


// Cancel edit
const cancelEdit = () => {
  editing.value = {
    medicalHistory: false,
    allergies: false
  };
  fetchPatient(); // reload from server
};

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    currentTab.value = newTab
  }
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
</script>

<style scoped>
.notification {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.notification.is-info {
  background-color: #e7f5ff;
  color: #1862ab;
}
.notification.is-danger {
  background-color: #fff5f5;
  color: #c92a2a;
}
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
  margin-bottom: 1rem;
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
  font-size: 1rem;
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

.edit-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.box {
  border-radius: 12px;
  padding: 1.5rem;
}

.card-header {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.edit-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card-content {
  padding: 1rem;
}

.ml-auto {
  margin-left: auto;
}
.clickable {
  cursor: pointer;
  user-select: none;
}
</style>
