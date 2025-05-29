<template>
  <main class="home-screen">
    <h2>Appointments</h2>
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
    <AppointmentsModal
      v-if="showModal"
      :date="selectedDate"
      @close="showModal = false"
      @submitted="handleSubmitted"
    />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import AppointmentsModal from '../components/AppointmentsModal.vue';

const appointments = ref([]);
const showModal = ref(false);
const selectedDate = ref('');
const calendarRef = ref(null);

const buildCalendarOptions = (eventsArray) => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: eventsArray,
  dateClick(info) {
    selectedDate.value = info.dateStr;
    showModal.value = true;
  },
  dayCellDidMount(info) {
    info.el.addEventListener('mouseenter', () => {
      info.el.style.backgroundColor = '#f0f8ff';
      info.el.style.cursor = 'pointer';
    });
    info.el.addEventListener('mouseleave', () => {
      info.el.style.backgroundColor = '';
    });
  }
});

const calendarOptions = ref(buildCalendarOptions([]));

const fetchAppointments = async () => {
  try {
    const res = await axios.get('https://emr-backend-h03z.onrender.com/api/appointments');

    appointments.value = res.data.map(appt => ({
      id: appt._id,
      title: appt.reason || 'Appointment',
      start: new Date(appt.start).toISOString(),
      end: new Date(appt.end).toISOString(),
      allDay: false,
      extendedProps: {
        notes: appt.notes || ''
      }
    }));

    calendarOptions.value = buildCalendarOptions(appointments.value);
  } catch (err) {
    console.error('Failed to fetch appointments:', err);
  }
};

const addAppointmentToCalendar = (appointment) => {
  const calendarApi = calendarRef.value.getApi();
  calendarApi.addEvent({
    id: appointment._id,
    title: appointment.reason || 'Appointment',
    start: new Date(appointment.start).toISOString(),
    end: new Date(appointment.end).toISOString(),
    allDay: false,
    extendedProps: {
      notes: appointment.notes || ''
    }
  });
};

const handleSubmitted = (newAppointment) => {
  showModal.value = false;
  addAppointmentToCalendar(newAppointment);
};

onMounted(fetchAppointments);
</script>

<style scoped>
.home-screen {
  padding: 2rem;
  font-family: 'Geist Sans', sans-serif;
}
.home-screen h2 {
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: bold;
  border-bottom: 2px solid #2b2e3b;
  padding-bottom: 0.5rem;
}
</style>
