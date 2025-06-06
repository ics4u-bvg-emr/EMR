<template>
  <section class="section">
    <div class="container" style="max-width: 480px">
      <div class="box has-text-centered px-5 py-6">
        <h1 class="title is-4 mb-3">Receptionist Registration</h1>
        <div class="field">
          <label class="label">First Name</label>
          <input class="input" v-model="form.firstName" />
        </div>
        <div class="field">
          <label class="label">Last Name</label>
          <input class="input" v-model="form.lastName" />
        </div>
        <div class="field">
          <label class="label">Username</label>
          <input class="input" v-model="form.username" />
        </div>
        <div class="field">
          <label class="label">Email</label>
          <input class="input" v-model="form.email" />
        </div>
        <div class="field">
          <label class="label">Password</label>
          <input class="input" type="password" v-model="form.password" />
        </div>
        <button class="button is-success is-fullwidth mt-4" :class="{ 'is-loading': loading }" @click="submit">
          Register
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
})

const submit = async () => {
  loading.value = true
  try {
    await axios.post('/api/auth/register', {
      ...form.value,
      role: 'receptionist',
    })
    alert('Receptionist registered!')
    router.push('/login')
  } catch (err) {
    alert('Registration failed.')
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
