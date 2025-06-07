<template>
    <section class="section is-fullheight">
      <div class="container">
        <div class="box mx-auto" style="max-width: 400px">
          <h1 class="title is-4">🔒 Reset Password</h1>

          <form @submit.prevent="submitNewPassword">
            <div class="field">
              <label class="label">New Password</label>
              <div class="control">
                <input
                  v-model="newPassword"
                  type="password"
                  class="input"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Confirm Password</label>
              <div class="control">
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="input"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <p v-if="error" class="help is-danger">{{ error }}</p>
            </div>

            <button type="submit" class="button is-primary is-fullwidth">Update Password</button>

            <p v-if="success" class="has-text-success mt-3">{{ success }}</p>
          </form>
        </div>
      </div>
    </section>
  </template>

  <script setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  axios.defaults.baseURL = "https://emr-backend-h03z.onrender.com"


  const route = useRoute();
  const router = useRouter();

  const token = route.params.token;
  const newPassword = ref('');
  const confirmPassword = ref('');
  const error = ref('');
  const success = ref('');

  const submitNewPassword = async () => {
    error.value = '';
    success.value = '';

    if (newPassword.value.trim() !== confirmPassword.value.trim()) {
      error.value = "Passwords don't match.";
      return;
    }

    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, {
        password: newPassword.value.trim(),
      });

      success.value = res.data.message;
      setTimeout(() => router.push('/login'), 3000); // Auto redirect so its easier to login once ur done reseting password
    } catch (err) {
      error.value = err.response?.data?.error || 'Reset failed. Try again.';
    }
  };
  </script>
