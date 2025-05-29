<template>
  <main class="patient-edit-screen">
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

    <section v-if="currentTab === 'Summary'" class="edit-grid">
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

<script>
export default {
  name: 'PatientEdit',
  data() {
    return {
      tabs: ['Summary', 'Timeline', 'Profile'],
      currentTab: 'Summary',
      patient: {
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
      }
    }
  },
  methods: {
    addDisease() {
      this.patient.diseases.push('');
    },
    removeDisease(i) {
      this.patient.diseases.splice(i, 1);
    },
    addAllergy() {
      this.patient.allergies.push('');
    },
    removeAllergy(i) {
      this.patient.allergies.splice(i, 1);
    },
    addMedication() {
      this.patient.medications.push({ name: '', dose: '' });
    },
    removeMedication(i) {
      this.patient.medications.splice(i, 1);
    },
    addHistory() {
      this.patient.history.push('');
    },
    removeHistory(i) {
      this.patient.history.splice(i, 1);
    },
    addEncounter() {
      this.patient.encounters.push({ date: '', status: '' });
    },
    removeEncounter(i) {
      this.patient.encounters.splice(i, 1);
    },
    savePatient() {
      // Save logic here (API call, etc)
      alert('Patient saved!');
    },
    cancelEdit() {
      this.$router.back();
    }
  }
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