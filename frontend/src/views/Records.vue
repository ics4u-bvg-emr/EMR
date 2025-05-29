<template>
  <main class="home-screen">
    <h2>Records</h2>

    <!-- Search Field -->
    <div class="field mb-4">
      <label class="label" for="search">Search by patient name:</label>
      <div class="control">
        <input
          id="search"
          type="text"
          class="input"
          placeholder="Type a name..."
          v-model="searchQuery"
        />
      </div>
    </div>

    <div class="card">
      <table class="patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>ID</th>
            <th>Condition</th>
            <th>Provider</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="patient in filteredPatients"
            :key="patient.id"
            class="clickable-row"
            @click="goToPatient(patient.id)"
          >
            <td>{{ patient.name }}</td>
            <td>{{ patient.age }}</td>
            <td>{{ patient.id }}</td>
            <td>{{ patient.condition }}</td>
            <td>{{ patient.provider }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Records',
  data() {
    return {
      searchQuery: '',
      patients: [
        { id: 1, name: 'Alice Smith', age: 28, condition: 'Asthma', provider: 'Dr. Rodriguez' },
        { id: 2, name: 'Bob Johnson', age: 34, condition: 'Diabetes', provider: 'Dr. Jones' },
        { id: 3, name: 'Carmen Lee', age: 41, condition: 'Hypertension', provider: 'Dr. Brooks' },
        { id: 4, name: 'David Kim', age: 50, condition: 'Heart Disease', provider: 'Dr. Green' }
      ]
    };
  },
  computed: {
    filteredPatients() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) return this.patients;
      return this.patients.filter(patient =>
        patient.name.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    goToPatient(patientId) {
      this.$router.push({ name: 'PatientEdit', params: { id: patientId } });
    }
  }
};
</script>

<style scoped>
.home-screen {
  padding: 2rem;
  font-family: 'Geist Sans', sans-serif;
  background: #fff;
  min-height: 100vh;
}

.home-screen h2 {
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: bold;
  border-bottom: 2px solid #2b2e3b;
  padding-bottom: 0.5rem;
}

.card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 18px rgba(34, 42, 66, 0.08);
  padding: 2rem;
  margin-top: 2rem;
  max-width: 100%;
  overflow-x: auto;
}

.patients-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.08rem;
  color: #262a33;
}

.patients-table th, .patients-table td {
  padding: 1rem;
  text-align: left;
}

.patients-table th {
  font-weight: 600;
  color: #9ea1b3;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #f0f0f0;
  background: #fff;
}

.patients-table tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.clickable-row {
  cursor: pointer;
  transition: background 0.2s;
}

.clickable-row:hover {
  background: #f9fafc;
}

.patients-table td {
  color: #262a33;
}

.field {
  margin-bottom: 1.5rem;
}

.input {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #dcdde1;
}
</style>
