<template>
    <section class="section has-text-centered is-fullheight">
      <div class="container">
        <div class="box mx-auto" style="max-width: 400px">
          <h1 class="title is-4">🔐 Login</h1>

          <form @submit.prevent="handleLogin">
            <!-- Username -->
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  v-model="username"
                  class="input"
                  type="text"
                  placeholder="Enter username"
                  required
                />
              </div>
              <p v-if="usernameError" class="help is-danger">{{ usernameError }}</p>
            </div>

            <!-- Password -->
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  v-model="password"
                  class="input"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </div>
              <p v-if="passwordError" class="help is-danger">{{ passwordError }}</p>
            </div>

            <!-- Submit -->
            <div class="field mt-4">
              <button class="button is-primary is-fullwidth" type="submit">Login</button>
            </div>

            <p class="mt-3 has-text-grey">
              Don’t have an account?
              <RouterLink to="/register">Register here</RouterLink>
            </p>

            <p v-if="showRecoveryPrompt" class="has-text-danger mt-3">
              Trouble logging in?
              <RouterLink to="/request-password-reset">Reset your password</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </section>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { setUserRole } from '@/stores/user.js'

  axios.defaults.baseURL = 'http://localhost:3000'

  const router = useRouter();
  const username = ref('');
  const password = ref('');
  const usernameError = ref('');
  const passwordError = ref('');
  const loginAttempts = ref(parseInt(localStorage.getItem('loginAttempts')) || 0);
  const showRecoveryPrompt = ref(loginAttempts.value >= 3);

  const handleLogin = async () => {
    try {
      console.log(`🔐 Logging in as: ${username.value}`);

      const response = await axios.post('/api/auth/login', {
        username: username.value.trim(),
        password: password.value.trim()
      });

      console.log('✅ Login success:', response.data);

      const { token, role, username: returnedUsername, doctorId } = response.data;

      if (!token || !role) {
        throw new Error('Login failed: missing token or role.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', returnedUsername || username.value);
      localStorage.setItem('loginAttempts', '0');

      if (role === 'doctor') {
        localStorage.setItem('doctorId', doctorId);
      } else {
        localStorage.removeItem('doctorId');
      }

      localStorage.setItem('role', role);
      
      setUserRole(role); // <-- Make sure this is before router.push

      if (role === 'doctor') {
        router.push('/dashboard');
      } else if (role === 'receptionist') {
        router.push('/appointments');
      }
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err.message);

      loginAttempts.value++;
      localStorage.setItem('loginAttempts', loginAttempts.value);
      passwordError.value = 'Invalid credentials. Please try again.';

      if (loginAttempts.value >= 3) {
        showRecoveryPrompt.value = true;
      }
    }
  };

  onMounted(() => {
    loginAttempts.value = parseInt(localStorage.getItem('loginAttempts')) || 0;
    showRecoveryPrompt.value = loginAttempts.value >= 3;
  });
  </script>
