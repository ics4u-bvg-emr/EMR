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
import multiMonthPlugin from '@fullcalendar/multimonth';
import axios from 'axios';
import AppointmentsModal from '../components/AppointmentsModal.vue';

const calendarRef = ref(null);
const showModal = ref(false);
const selectedDate = ref('');

// Calendar options
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin, multiMonthPlugin],
  headerToolbar: {
    left: 'prev,next,today',
    center: 'title',
    right: 'multiMonthYear,dayGridMonth,dayGridWeek'
  },
  initialView: 'dayGridMonth',
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

const toISO = (dateStr) => {
  // Try to parse and convert to ISO string, fallback to original if invalid
  const d = new Date(dateStr);
  return !isNaN(d) ? d.toISOString() : '';
};

const fetchAppointments = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/appointments');
    const validEvents = res.data
      .map(appt => {
        const startISO = toISO(appt.start);
        const endISO = toISO(appt.end);
        if (!startISO || !endISO) return null;
        return {
          id: appt._id,
          title: appt.reason || 'Appointment',
          start: startISO,
          end: endISO,
          allDay: false,
          extendedProps: {
            notes: appt.notes || '',
            status: appt.status
          }
        };
      })
      .filter(Boolean); // Remove any nulls
    calendarOptions.value.events = validEvents;
  } catch (err) {
    console.error('Failed to fetch appointments:', err);
  }
};

const handleSubmitted = (newAppointment) => {
  showModal.value = false;
  addAppointmentToCalendar(newAppointment);
};

const addAppointmentToCalendar = (appointment) => {
  if (!isValidDateString(appointment.start) || !isValidDateString(appointment.end)) {
    console.warn('Invalid appointment dates on add:', appointment);
    return;
  }
  calendarOptions.value.events.push({
    id: appointment._id,
    title: appointment.reason || 'Appointment',
    start: appointment.start,
    end: appointment.end,
    allDay: false,
    extendedProps: {
      notes: appointment.notes || '',
      status: appointment.status
    }
  });
};

function isValidDateString(dateStr) {
  return dateStr && !isNaN(Date.parse(dateStr));
}

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