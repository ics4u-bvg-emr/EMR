<template>
    <section class="section is-fullheight">
      <div class="container" style="max-width: 400px;">
        <h1 class="title is-4">Forgot Your Password?</h1>
        <form @submit.prevent="submitEmail" class="box">
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input v-model="email" type="email" class="input" placeholder="Enter your email" required />
            </div>

          </div>

          <div class="field">
            <button class="button is-link is-fullwidth" :disabled="loading">
              {{ loading ? 'Sending...' : 'Send Reset Link' }}
            </button>
            <p class="has-text-centered mt-4">
              Changed your mind?
              <RouterLink to="/login">Back to Login</RouterLink>
            </p>

          </div>

          <p v-if="message" class="has-text-success">{{ message }}</p>
          <p v-if="error" class="has-text-danger">{{ error }}</p>
        </form>
      </div>
    </section>
  </template>

  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  axios.defaults.baseURL = "http://localhost:3000"

  const email = ref('');
  const loading = ref(false);
  const message = ref('');
  const error = ref('');

  const submitEmail = async () => {
    loading.value = true;
    message.value = '';
    error.value = '';

    try {
      const res = await axios.post('/api/auth/request-password-reset', {
        email: email.value.trim(),
      });
      message.value = '✅ Password reset email sent.';
    } catch (err) {
      error.value = err.response?.data?.message || 'Something went wrong.';
    } finally {
      loading.value = false;
    }
  };
  </script>

