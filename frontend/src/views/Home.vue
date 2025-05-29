<template>
  <!-- Geist Sans from Vercel Fonts (official CDN) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vercel/fonts@1.0.2/geist/Geist-Sans.min.css">

  <section class="section">
    <div class="container">

      <!-- Top: Dashboard Title Bar -->
      <div class="dashboard-header mb-5">
        <h1 class="dashboard-title">Dashboard</h1>
      </div>

      <!-- Top Stats Row (no gender card) -->
      <div class="columns is-multiline">
        <!-- Welcome Card -->
        <div class="column is-8">
          <div class="box is-flex is-align-items-center">
            <span class="icon is-large has-text-danger mr-4">
              <i class="fas fa-heart fa-2x"></i>
            </span>
            <div>
              <h2 class="title is-4 mb-1">Welcome, Doctor</h2>
              <p class="subtitle is-6 mb-0">You have <b>11</b> new messages and <b>5</b> notifications</p>
            </div>
          </div>
        </div>
        <!-- New Patients -->
        <div class="column is-2">
          <div class="box has-text-centered">
            <p class="heading">New Patients</p>
            <p class="title is-3">16</p>
          </div>
        </div>
        <!-- All Patients -->
        <div class="column is-2">
          <div class="box has-text-centered">
            <p class="heading">All Patients</p>
            <p class="title is-3">58</p>
          </div>
        </div>
      </div>

      <!-- Agenda & News Row -->
      <div class="columns">
        <!-- Agenda Table -->
        <div class="column is-7">
          <div class="box">
            <p class="title is-6 mb-3">
              Appointments for {{ formattedDate }}
            </p>
            <table class="table is-fullwidth is-hoverable is-size-7">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient Name</th>
                  <th>Phone</th>
                  <th>Pain complaint</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10:00 am</td>
                  <td>Dillon Gentry</td>
                  <td>(629) 555-0129</td>
                  <td>Headache</td>
                </tr>
                <tr>
                  <td>10:45 am</td>
                  <td>Elise Mclellan</td>
                  <td>(480) 555-0103</td>
                  <td>Sore throat</td>
                </tr>
                <tr>
                  <td>12:30 am</td>
                  <td>Harvie Ratcliffe</td>
                  <td>(671) 555-0110</td>
                  <td>Stomach ache</td>
                </tr>
                <tr>
                  <td>02:15 pm</td>
                  <td>Eshan Terrell</td>
                  <td>(201) 555-0124</td>
                  <td>Headache</td>
                </tr>
              </tbody>
            </table>
            <router-link class="is-size-7" to="/appointments">View all</router-link>
          </div>
        </div>
        <!-- News & Updates -->
        <div class="column is-5">
          <div class="box">
            <p class="title is-6 mb-3">News & Updates</p>
            <ul style="list-style: disc inside;" class="mb-3">
              <li>Dillon Gentry bloodwork ready</li>
              <li>Elise Mclellan allergy update</li>
              <li>Harvie Ratcliffe X-ray uploaded</li>
              <li>Eshan Terrell needs refill</li>
              <li>Maya Hawkins physical done</li>
              <li>Felix Calderon referral received</li>
              <li>Maria Villegas immunization update</li>
              <li>Insurance form pre-approved</li>
            </ul>
            <router-link class="is-size-7" to="/reports">View all</router-link>
          </div>
        </div>
      </div>

      <!-- Stats & At a Glance Row -->
      <div class="columns">
        <!-- Patient Statistics Placeholder -->
        <div class="column is-7">
          <div class="box">
            <p class="title is-6 mb-3">Patient statistics</p>
            <div class="has-background-light p-5 mb-2 has-text-grey has-text-centered">
              <span class="icon-text is-size-4">
                <span class="icon"><i class="fas fa-chart-line"></i></span>
                <span>(Graph Placeholder)</span>
              </span>
            </div>
            <p>Total Patients: <b>58</b></p>
          </div>
        </div>
        <!-- At a Glance -->
        <div class="column is-5">
          <div class="box">
            <p class="title is-6 mb-3">At a Glance</p>
            <ul>
              <li>Pending Patient Intakes <b>12</b></li>
              <li>Incomplete Patient Records <b>3</b></li>
              <li>Fax Alerts <b>18</b></li>
            </ul>
            <router-link class="is-size-7" to="/records">View all</router-link>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import circleUserSvg from '@/components/icons/circleuser.svg'

export default {
  name: "EMRDashboardBulma",
  data() {
    return {
      circleUserSvg,
      now: new Date()
    }
  },
  computed: {
    formattedDate() {
      return this.now.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    formattedTime() {
      return this.now.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  mounted() {
    // Update the time every minute
    this.timer = setInterval(() => {
      this.now = new Date();
    }, 1000 * 60);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
}
</script>

<style scoped>
.container,
.container * {
  font-family: "Geist Sans", "Inter", "Segoe UI", Arial, sans-serif;
  color: #585b65 !important;
  letter-spacing: 0;
  font-weight: 400;
}

/* Dashboard top bar */
.dashboard-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-top: 0.1rem;
}

.section {
  padding-top: 1rem !important;
}

.dashboard-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #585b65;
  letter-spacing: -0.5px;
  margin: 0;
}

h1,
h2,
h3,
h4,
.title,
.subtitle {
  font-weight: 600 !important;
  letter-spacing: -0.01em;
  color: #585b65 !important;
}

.box {
  border-radius: 1rem;
  border: 1.5px solid #e2e5ed;
  box-shadow: 0 2px 6px rgba(40, 44, 63, 0.07);
  background: #fff;
}

.table th,
.table td {
  vertical-align: middle;
  color: #585b65 !important;
}

a,
a:visited,
.router-link-active {
  color: #2685fa;
}

a:hover,
.router-link-active {
  text-decoration: underline;
}

ul {
  color: #585b65;
}
</style>
