<template>
  <main class="edit-screen">
    <h2>Edit Patient</h2>
    <div class="edit-card">
      <form v-if="patient" @submit.prevent="save">
        <div class="form-group">
          <label>Name:</label>
          <input v-model="patient.name" type="text" />
        </div>
        <div class="form-group">
          <label>Age:</label>
          <input v-model="patient.age" type="number" />
        </div>
        <div class="form-group">
          <label>Condition:</label>
          <input v-model="patient.condition" type="text" />
        </div>
        <div class="form-group">
          <label>Provider:</label>
          <input v-model="patient.provider" type="text" />
        </div>
        <button type="submit">Save</button>
      </form>
      <div v-else>Loading...</div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const patient = ref(null)

function save() {
  alert('Patient saved! (Demo only)')
  router.push({ name: 'Records' })
}

onMounted(() => {
  // Mock data for demo
  const mockPatients = [
    { id: 1, name: 'Alice Smith', age: 28, condition: 'Asthma', provider: 'Dr. Rodriguez' },
    { id: 2, name: 'Bob Johnson', age: 34, condition: 'Diabetes', provider: 'Dr. Jones' },
    { id: 3, name: 'Carmen Lee', age: 41, condition: 'Hypertension', provider: 'Dr. Brooks' },
    { id: 4, name: 'David Kim', age: 50, condition: 'Heart Disease', provider: 'Dr. Green' }
  ]
  const id = Number(route.params.id)
  patient.value = mockPatients.find(p => p.id === id) || null
})
</script>

<style scoped>
.edit-screen {
  padding: 2rem;
  background: #fff;
  min-height: 100vh;
  font-family: 'Geist Sans', sans-serif;
}
.edit-screen h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.edit-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 18px rgba(34, 42, 66, 0.08);
  padding: 2rem;
  max-width: 480px;
  margin: auto;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  background: #fafbfc;
}
button[type="submit"] {
  background: #2fcfcf;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.18s;
}
button[type="submit"]:hover {
  background: #1bbaba;
}
</style>
