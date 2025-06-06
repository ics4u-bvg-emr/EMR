<template>
    <section class="section">
      <div class="container" style="max-width: 480px">
        <div class="box has-text-centered px-5 py-6">
          <h1 class="title is-4 mb-3">Doctor Registration</h1>
          <p class="subtitle is-6 has-text-grey mb-4">Step {{ step }} of 3</p>
  
          <!-- Step 1: Basic Info -->
          <transition name="fade" mode="out-in">
            <div v-if="step === 1" key="step1">
              <div class="field">
                <label class="label">First Name</label>
                <input class="input" v-model="form.firstName" />
              </div>
  
              <div class="field">
                <label class="label">Last Name</label>
                <input class="input" v-model="form.lastName" />
              </div>
  
              <div class="field">
                <label class="label">Suffix (optional)</label>
                <input class="input" v-model="form.suffix" />
              </div>
  
              <div class="field">
                <label class="label">Gender</label>
                <div class="select is-fullwidth">
                  <select v-model="form.gender">
                    <option disabled value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
  
              <div class="field">
                <label class="label">Date of Birth</label>
                <input class="input" type="date" v-model="form.dob" />
              </div>
            </div>
  
            <!-- Step 2: Professional Info -->
            <div v-else-if="step === 2" key="step2">
              <div class="field">
                <label class="label">Email</label>
                <input class="input" v-model="form.email" />
              </div>
  
              <div class="field">
                <label class="label">Phone Number</label>
                <input class="input" v-model="form.phone" />
              </div>
  
              <div class="field">
                <label class="label">Work Address</label>
                <input class="input" v-model="form.address" />
              </div>
  
              <div class="field">
                <label class="label">Specialty</label>
                <input class="input" v-model="form.specialty" />
              </div>
  
              <div class="field">
                <label class="label">Years of Experience</label>
                <input class="input" type="number" v-model="form.experience" />
              </div>
  
              <div class="field">
                <label class="label">Bio (optional)</label>
                <textarea class="textarea" v-model="form.bio" />
              </div>
            </div>
  
            <!-- Step 3: Account Security -->
            <div v-else-if="step === 3" key="step3">
              <div class="field">
                <label class="label">Username</label>
                <input class="input" v-model="form.username" />
              </div>
  
              <div class="field">
                <label class="label">Password</label>
                <input class="input" type="password" v-model="form.password" />
              </div>
            </div>
          </transition>
  
          <!-- Navigation Buttons -->
          <div class="buttons mt-5 is-flex is-justify-content-space-between">
            <button class="button is-light" v-if="step > 1" @click="step--">Back</button>
            <button
              class="button is-primary is-fullwidth"
              v-if="step < 3"
              @click="step++"
            >
              Next
            </button>
            <button
              class="button is-success is-fullwidth"
              :class="{ 'is-loading': loading }"
              v-if="step === 3"
              @click="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const step = ref(1)
  const loading = ref(false)
  
  const form = ref({
    firstName: '',
    lastName: '',
    suffix: '',
    username: '',
    password: '',
    gender: '',
    dob: '',
    bio: '',
    email: '',
    phone: '',
    address: '',
    specialty: '',
    experience: '',
  })
  
  const submit = async () => {
    loading.value = true
    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        ...form.value,
        role: 'doctor',
      })
      alert('Doctor registered!')
      router.push('/login')
    } catch (err) {
      alert('Registration failed.')
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }
  </style>
  