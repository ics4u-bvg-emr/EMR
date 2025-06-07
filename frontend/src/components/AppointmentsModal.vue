<template>
    <div class="modal-backdrop">
        <div class="modal-content">
          <h3 v-if="isViewing && !isEditing">Appointment Details</h3>
          <h3 v-else-if="isEditing">Edit Appointment</h3>
          <h3 v-else>New Appointment</h3>
            <!-- add -->
            <form v-if="!isViewing && !props.isDoctor" @submit.prevent="addAppt">
                <label>Doctor:</label>
                <select v-model="selectedDoctor" required>
                    <option disabled value="">Select a doctor</option>
                    <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.name }}</option>
                </select>

                <label>Patient:</label>
                <select v-model="selectedPatient" required>
                    <option disabled value="">Select a patient</option>
                    <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
                </select>

                <label>Start:</label>
                <input type="datetime-local" v-model="start" required />

                <label>End:</label>
                <input type="datetime-local" v-model="end" required />

                <label>Reason:</label>
                <input v-model="reason" />

                <label>Notes:</label>
                <textarea v-model="notes" />

                <div class="actions">
                    <button type="submit">Create</button>
                    <button type="button" @click="$emit('close')">Cancel</button>
                </div>
          </form>
          <!-- edit -->
          <div v-else>
            <div v-if="isEditing">
              <div class="form-group">
                <label>Start:</label>
                <input type="datetime-local" v-model="start" required />
              </div>
              
              <div class="form-group">
                <label>End:</label>
                <input type="datetime-local" v-model="end" required />
              </div>
              
              <div class="form-group">
                <label>Reason:</label>
                <input v-model="reason" />
              </div>

              <div class="form-group">
                <label>Notes:</label>
                <textarea v-model="notes" />
              </div>

              <div class="actions">
                <button @click="updateAppt">Save</button>
                <button type="button" @click="isEditing = false">Cancel</button>
              </div>
            </div>
            <!-- view -->
            <div v-else>
              <p><b>Title:</b> {{ props.event.title }}</p>
              <p v-if="!props.isDoctor"><b>Doctor:</b> {{ props.event.extendedProps.doctorName }}</p>
              <p><b>Patient:</b> {{ props.event.extendedProps.patientName || 'N/A' }}</p>
              <p><b>Start:</b> {{ formatDateTime(props.event.start) }}</p>
              <p><b>End:</b> {{ formatDateTime(props.event.end) }}</p>
              <p><b>Status:</b> {{ props.event.extendedProps.status }}</p>
              <p><b>Notes:</b> {{ notes }}</p>

              <div class="actions">
                <button v-if="!props.isDoctor" @click="isEditing = true">Edit</button>
                <button v-if="!props.isDoctor" @click="deleteAppt">Delete</button>
                <button type="button" @click="$emit('close')">Close</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted} from 'vue'
    import axios from 'axios'

    const emit = defineEmits(['close', 'submitted'])
    const props = defineProps({
        // date: String,
        event: Object,
        isDoctor: Boolean,
        doctorId: String,
    });

    const selectedDoctor = ref('')
    const selectedPatient = ref('')
    const start = ref('')
    const end = ref('')
    const reason = ref('')
    const notes = ref('')
    const doctors = ref([])
    const patients = ref([])

    const isViewing = computed(() => !!props.event);
    const isEditing = ref(false);

    const addAppt = async () => {
        if (!start.value || !end.value || !selectedPatient.value) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const res = await axios.post('https://emr-backend-h03z.onrender.com/api/appointments', {
                doctorId: selectedDoctor.value,
                patientId: selectedPatient.value,
                start: new Date(start.value).toISOString(),
                end: new Date(end.value).toISOString(),
                reason: reason.value.trim(),
                notes: notes.value.trim(),
                status: 'pending',
            })

            emit('submitted', res.data)
        } catch (err) {
            console.error('Failed to create appointment:', err)
            alert('Failed to create appointment, please try again.')
        }
    }

    const updateAppt = async () => {
      try {
        const res = await axios.put(`https://emr-backend-h03z.onrender.com/api/appointments/${props.event.id}`, {
          start: new Date(start.value).toISOString(),
          end: new Date(end.value).toISOString(),
          reason: reason.value.trim(),
          notes: notes.value.trim(),
        });

        emit('submitted', res.data);
        emit('close');
      } catch (err) {
        console.error('Failed to update appointment:', err);
        alert('Failed to update appointment.');
      }
    };

    const deleteAppt = async () => {
      const confirmDelete = confirm('Are you sure you want to delete this appointment?');
      if (!confirmDelete) return;

      try {
        await axios.delete(`https://emr-backend-h03z.onrender.com/api/appointments/${props.event.id}`);
        emit('submitted');
        emit('close');
      } catch (err) {
        console.error('Failed to delete appointment:', err);
        alert('Failed to delete appointment.');
      }
    };

    function formatDateTime(datetime) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(datetime).toLocaleString(undefined, options);
    }

    function toLocalDateTime(dateStr) {
      const d = new Date(dateStr);
      return d.toISOString().slice(0, 16);
    }


    watch(() => props.event, (newVal) => {
      if (!newVal) {
        selectedDoctor.value = '';
        selectedPatient.value = '';
        start.value = '';
        end.value = '';
        reason.value = '';
        notes.value = '';
        isEditing.value = false;
      } else {
        start.value = toLocalDateTime(newVal.start);
        end.value = toLocalDateTime(newVal.end);
        reason.value = newVal.title || '';
        notes.value = newVal.extendedProps?.notes || '';
      }
    });

    onMounted(async () => {
        try {
            const patientRes = await axios.get('https://emr-backend-h03z.onrender.com/api/patients');
            patients.value = patientRes.data.map(p => ({
                id: p._id,
                name: `${p.firstName} ${p.lastName}`,
            }));

            const doctorRes = await axios.get('https://emr-backend-h03z.onrender.com/api/doctors');
            doctors.value = doctorRes.data.map(d => ({
                id: d._id,
                name: `${d.firstName} ${d.lastName}`,
            }));
        } catch (err) {
            console.error('Error loading:', err);
        }
    });
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 420px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI", sans-serif;
  color: #333;
}

.modal-content h3 {
  margin-top: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #222;
}

.modal-content form {
  display: flex;
  flex-direction: column;
}

.modal-content label {
  margin-top: 12px;
  font-weight: 500;
  color: #555;
}

.modal-content input,
.modal-content select,
.modal-content textarea {
  padding: 10px;
  margin-top: 6px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1rem;
}

.actions button {
  padding: 8px 14px;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

.actions button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

.actions button[type="submit"]:hover {
  background-color: #45a049;
}

.actions button[type="button"] {
  background-color: #eee;
  color: #333;
}

.actions button[type="button"]:hover {
  background-color: #ddd;
}

.actions button:active {
  transform: scale(0.98);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
</style>
