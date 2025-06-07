<template>
    <section class="section has-text-centered register-page">
      <div class="container">
        <div class="box register-box">
          <h1 class="title is-3 has-text-dark mb-2">Create Your Account</h1>
          <p class="subtitle is-5 has-text-grey mb-5">Choose your registration type:</p>

          <div class="buttons is-centered">
            <router-link to="/register-doctor">
              <button class="button is-primary is-medium is-rounded">
                👨‍⚕️ Doctor
              </button>
            </router-link>
            <router-link to="/register-receptionist">
              <button class="button is-warning is-medium is-rounded">
                🧑‍💼 Receptionist
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </template>

  <style scoped>
  .register-page {
    background-color: #f4f7fa;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .register-box {
    max-width: 500px;
    margin: auto;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    background-color: white;
  }
  </style>

  <script setup>
  // no logic needed for this static view
  </script>
