<template>
  <main class="home-screen">
    <h2>Appointments</h2>
    <FullCalendar :options="calendarOptions" />
  </main>
</template>

<script setup>
  import { ref } from 'vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';

  let name = 'Appointments';

  const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: function() {
      alert('a day has been clicked!')
    },
    dayCellDidMount: (info) => {
      info.el.addEventListener('mouseenter', () => {
        info.el.style.backgroundColor = '#f0f8ff'
        info.el.style.cursor = 'pointer'
      })
      info.el.addEventListener('mouseleave', () => {
        info.el.style.backgroundColor = ''
      })
    }
  })

  let dateClick = () => {
    
  }
</script>

<style scoped>
.home-screen {
  padding: 2rem;
  font-family: 'Geist Sans', sans-serif;
}
.home-screen h2 {
  margin-bottom: 1rem;
  font-size: 2.5rem;  /* Larger font size */
  font-weight: bold;  /* Make it bold */
  border-bottom: 2px solid #2b2e3b;  /* Add a line underneath */
  padding-bottom: 0.5rem;  /* Space between text and line */
}
</style>
