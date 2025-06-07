<template>
  <main class="home-screen">
    <h2>Appointments</h2>
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
    <AppointmentsModal
      v-if="showModal"
      :is-doctor="isDoctor"
      :doctor-id="doctorId"
      :date="selectedDate"
      :event="selectedEvent"
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
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import AppointmentsModal from '../components/AppointmentsModal.vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const isDoctor = localStorage.getItem('role') === 'doctor';
const doctorId = localStorage.getItem('doctorId');

const calendarRef = ref(null);
const showModal = ref(false);
const selectedDate = ref('');
const selectedEvent = ref(null);

    const id = ref(null);
    const role = ref(null);

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin, multiMonthPlugin, timeGridPlugin],
  headerToolbar: {
    left: 'prev,next,today',
    center: 'title',
    right: 'multiMonthYear,dayGridMonth,timeGridWeek',
  },
  eventLimit: true,
  initialView: 'dayGridMonth',
  displayEventEnd: true,
  dateClick(info) {
    selectedDate.value = info.dateStr;
    selectedEvent.value = null;
    showModal.value = true;
  },
  eventClick(info) {
  selectedEvent.value = info.event ? info.event : null;
  selectedDate.value = info.event ? info.event.startStr : '';
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
  },
});

const toISO = (dateStr) => {
  const d = new Date(dateStr);
  return !isNaN(d) ? d.toISOString() : '';
};

// const fetchAppointments = async () => {
//     try {
//     let url = 'http://localhost:3000/api/appointments';

//     if (isDoctor && doctorId) {
//       url += `?doctorId=${doctorId}`;
//     }

//     const res = await axios.get(url);

//     const dres = await axios.get(`http://localhost:3000/api/doctors/${id}`, {
//       headers: {authorization: `Bearer ${token}`}
//     })
//     const data = dres.data
//     const validEvents = res.data
//       .map((appt) => {
//         if (role === 'doctor' && id !== appt.doctorId._id) {
//           return false;
//         }

//         const startISO = toISO(appt.start);
//         const endISO = toISO(appt.end);
//         if (!startISO || !endISO) return null;

//         const doctorName = `${data.firstName} ${data.lastName}`;
// console.log('Doctor object in appointment:', appt.doctorId);


//         const patientName = appt.patientId ? `${appt.patientId.firstName} ${appt.patientId.lastName}`: 'Unknown Patient';

//         return {
//           id: appt._id,
//           title: `${appt.reason || 'Appointment'}`,
//           start: startISO,
//           end: endISO,
//           allDay: false,
//           extendedProps: {
//             notes: appt.notes || '',
//             status: appt.status,
//             doctorName,
//             patientName
//           },
//         };
//       })
//       .filter(Boolean);

//     calendarOptions.value.events = validEvents;
//   } catch (err) {
//     console.error('Failed to fetch appointments:', err);
//   }
// };

const fetchAppointments = async () => {
  try {
    const token = localStorage.getItem('token');
    const url = 'http://localhost:3000/api/appointments';

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const validEvents = res.data
      .filter((appt) => {
        if (role.value === 'doctor') {
          return String(appt.doctorId?._id || appt.doctorId) === id.value;
        }
        return true;
      })
      .map((appt) => {
        const startISO = toISO(appt.start);
        const endISO = toISO(appt.end);
        if (!startISO || !endISO) return null;

        const doctorName = appt.doctorId?.firstName
          ? `${appt.doctorId.firstName} ${appt.doctorId.lastName}`
          : 'Unknown Doctor';

        const patientName = appt.patientId
          ? `${appt.patientId.firstName} ${appt.patientId.lastName}`
          : 'Unknown Patient';

        return {
          id: appt._id,
          title: appt.reason || 'Appointment',
          start: startISO,
          end: endISO,
          allDay: false,
          extendedProps: {
            notes: appt.notes || '',
            status: appt.status,
            doctorName,
            patientName,
          },
        };
      })
      .filter(Boolean);

    calendarOptions.value.events = validEvents;
  } catch (err) {
    console.error('Failed to fetch appointments:', err);
  }
};



const handleSubmitted = async () => {
  showModal.value = false;
  await fetchAppointments();
};

// const addAppointmentToCalendar = (appointment) => {
//   if (!isValidDateString(appointment.start) || !isValidDateString(appointment.end)) {
//     console.warn('Invalid appointment dates on add:', appointment);
//     return;
//   }
//   calendarOptions.value.events.push({
//     id: appointment._id,
//     title: appointment.reason || 'Appointment',
//     start: appointment.start,
//     end: appointment.end,
//     allDay: false,
//     extendedProps: {
//       notes: appointment.notes || '',
//       status: appointment.status,
//     },
//   });
// };

// function isValidDateString(dateStr) {
//   return dateStr && !isNaN(Date.parse(dateStr));
// }

// onMounted(fetchAppointments);

onMounted(async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/login')
    return
  }

  let decoded
  try {
    decoded = JSON.parse(atob(token.split('.')[1]))
  } catch {
    console.log('hi')
    router.push('/login')
    return
  }

  id.value = decoded.id;
  role.value = decoded.role;
  // if (!id !== 'doctor') {
  //   console.log('hiii')
  //   router.push('/login')
  //   return
  // }

  // console.log(id)

  await fetchAppointments()
})

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
