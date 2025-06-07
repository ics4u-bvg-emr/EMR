<template>
  <section class="section">
    <div class="container">
        <div class="section-header">
            <h1>Create New Patient</h1>
            <hr />
        </div>

      <!-- Step Navigation -->
      <div class="tabs is-boxed is-fullwidth mb-4">
        <ul>
          <li v-for="(s, i) in steps" :key="i" :class="{ 'is-active': step === i }">
            <a @click.prevent="goToStep(i)">
              <span>{{ s }}</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Step Content -->
      <form @submit.prevent="submitForm">
        <div v-if="step === 0">
          <!-- Step 1: Personal Info -->
          <div class="box">
            <h2 class="subtitle">Personal Information</h2>

            <div class="field">
              <label class="label">First Name *</label>
              <input class="input" v-model="patient.firstName" />
              <p v-if="!patient.firstName && attemptedSubmit" class="help is-danger">Required</p>
            </div>

            <div class="field">
              <label class="label">Last Name *</label>
              <input class="input" v-model="patient.lastName" />
              <p v-if="!patient.lastName && attemptedSubmit" class="help is-danger">Required</p>
            </div>

            <div class="field">
              <label class="label">Date of Birth</label>
              <input class="input" type="date" v-model="patient.dateOfBirth" />
            </div>

            <div class="field">
              <label class="label">Sex</label>
              <div class="select">
                <select v-model="patient.sex">
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div class="field">
                <label class="label">Profile Picture</label>
                <div class="control">
                    <input class="input" type="file" @change="handleFileChange" accept="image/*" />
                </div>
                <figure class="image is-128x128 mt-2" v-if="previewUrl">
                    <img :src="previewUrl" alt="Preview" class="is-rounded" />
                </figure>
            </div>
          </div>
        </div>

        <div v-else-if="step === 1">
          <!-- Step 2: Contact + Medical -->
          <div class="box">
            <h2 class="subtitle">Contact Information</h2>

            <div class="field">
              <label class="label">Phone Number</label>
              <input class="input" v-model="patient.contactInfo.phoneNumber" />
            </div>

            <div class="field">
              <label class="label">Email</label>
              <input class="input" type="email" v-model="patient.contactInfo.email" />
            </div>

            <div class="field">
              <label class="label">Address</label>
              <input class="input" v-model="patient.contactInfo.address" />
            </div>
          </div>

          <div class="box">
            <h2 class="subtitle">Basic Medical Info</h2>

            <div class="field">
              <label class="label">Weight (kg)</label>
              <input class="input" type="number" v-model.number="patient.weight" />
            </div>

            <div class="field">
              <label class="label">Height (cm)</label>
              <input class="input" type="number" v-model.number="patient.height" />
            </div>

            <div class="field">
              <label class="label">Allergies (comma separated)</label>
              <textarea class="textarea" v-model="allergyInput" />
            </div>
          </div>
        </div>

        <div v-else-if="step === 2">
          <!-- Step 3: Medical History -->
          <div class="box">
            <h2 class="subtitle">Medical History</h2>

            <div class="field">
              <label class="label">Past Conditions</label>
              <textarea class="textarea" v-model="pastConditions" />
            </div>

            <div class="field">
              <label class="label">Current Prescriptions</label>
              <textarea class="textarea" v-model="currentPrescriptions" />
            </div>

            <div class="field">
              <label class="label">Family History</label>
              <textarea class="textarea" v-model="familyHistory" />
            </div>

            <div class="field">
              <label class="label">Notes</label>
              <textarea class="textarea" v-model="patient.medicalHistory.notes" />
            </div>
          </div>

          <div class="has-text-success mb-2" v-if="success">Patient successfully created!</div>
          <div class="has-text-danger mb-2" v-if="error">{{ error }}</div>
        </div>

        <!-- Navigation Buttons -->
        <div class="buttons mt-4">
          <button class="button is-light" type="button" @click="prevStep" :disabled="step === 0">Back</button>
          <button
            class="button is-primary"
            type="button"
            @click="nextStep"
            v-if="step < steps.length - 1"
          >
            Next
          </button>
          <button class="button is-success" type="submit" v-if="step === steps.length - 1">
            Submit
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const steps = ['Personal Info', 'Contact & Medical Info', 'History & Review']
const step = ref(0)
const previewUrl = ref(null)

const patient = ref({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  sex: '',
  contactInfo: { phoneNumber: '', email: '', address: '' },
  weight: null,
  height: null,
  allergies: [],
  medicalHistory: {
    pastConditions: [],
    currentPrescriptions: [],
    familyHistory: [],
    notes: ''
  },
  profilePicture: ''
})

const profilePicture = ref(null)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file || !file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = () => {
    patient.value.profilePicture = reader.result // base64 string
    previewUrl.value = reader.result
  }
  reader.readAsDataURL(file)
}

const allergyInput = ref('')
const pastConditions = ref('')
const currentPrescriptions = ref('')
const familyHistory = ref('')

const attemptedSubmit = ref(false)
const error = ref('')
const success = ref(false)

const goToStep = (i) => {
  step.value = i
}

const nextStep = () => {
  attemptedSubmit.value = true
  if (step.value === 0 && (!patient.value.firstName || !patient.value.lastName)) return
  step.value++
}

const prevStep = () => {
  if (step.value > 0) step.value--
}

const submitForm = async () => {
  attemptedSubmit.value = true
  success.value = false
  error.value = ''

  // Parse comma-separated fields
  patient.value.allergies = allergyInput.value.split(',').map(s => s.trim()).filter(Boolean)
  patient.value.medicalHistory.pastConditions = pastConditions.value.split(',').map(s => s.trim()).filter(Boolean)
  patient.value.medicalHistory.currentPrescriptions = currentPrescriptions.value.split(',').map(s => s.trim()).filter(Boolean)
  patient.value.medicalHistory.familyHistory = familyHistory.value.split(',').map(s => s.trim()).filter(Boolean)

  try {
    await axios.post('/api/patients', patient.value, {
        headers: { 'Content-Type': 'application/json' }
    })
    success.value = true
    step.value = 0

    // Reset
    Object.assign(patient.value, {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      contactInfo: { phoneNumber: '', email: '', address: '' },
      weight: null,
      height: null,
      allergies: [],
      medicalHistory: { pastConditions: [], currentPrescriptions: [], familyHistory: [], notes: '' }
    })

    allergyInput.value = ''
    pastConditions.value = ''
    currentPrescriptions.value = ''
    familyHistory.value = ''
    attemptedSubmit.value = false
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create patient.'
  }
}
</script>

<style scoped>
.section-header h1 {
  font-family: 'Nunito', sans-serif; /* or match your existing font */
  font-weight: 700;
  font-size: 2.5rem;
  color: #474c59;
  margin-bottom: 0.5rem;
}

.section-header hr {
  border: none;
  height: 3px;
  background-color: #2d2f3a;
  width: 100%;
  margin: 0;
}
.tabs a {
  cursor: pointer;
}
</style>
