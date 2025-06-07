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
  import { useTabsStore } from '@/stores/tabs'

  axios.defaults.baseURL = 'https://emr-backend-h03z.onrender.com'

  const router = useRouter();
  const username = ref('');
  const password = ref('');
  const usernameError = ref('');
  const passwordError = ref('');
  const loginAttempts = ref(parseInt(localStorage.getItem('loginAttempts')) || 0);
  const showRecoveryPrompt = ref(loginAttempts.value >= 3);
  const tabsStore = useTabsStore()

  const handleLogin = async () => {
    try {
      console.log(`🔐 Logging in as: ${username.value}`);

      const response = await axios.post('/api/auth/login', {
        username: username.value.trim(),
        password: password.value.trim()
      });

      console.log('✅ Login success:', response.data);

      // Rename destructured fields to avoid conflict with refs
      const { token, role, user, username: respUsername, id: respId, doctorId } = response.data;

      if (!token || !role) {
        throw new Error('Login failed: missing token or role.');
      }

      // Defensive: use user.username or respUsername, user.id or respId
      const usernameToStore = user?.username || respUsername || username.value.trim();
      const userIdToStore = user?.id || respId || '';

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', usernameToStore);
      localStorage.setItem('userId', userIdToStore);
      localStorage.setItem('loginAttempts', '0');

      if (role === 'doctor') {
        localStorage.setItem('doctorId', user?.doctorId || doctorId || '');
      } else {
        localStorage.removeItem('doctorId');
      }

      setUserRole(role);

      tabsStore.restoreTabs();

      const currentRoute = router.currentRoute.value;
      const isPatientTab = currentRoute.name === 'PatientEdit' && currentRoute.params.id;
      const currentTabKey = isPatientTab ? `patient-${currentRoute.params.id}` : null;

      // If the current route is a patient tab and it's not in the restored tabs, add it
      if (
        isPatientTab &&
        !tabsStore.tabs.find(tab => tab.key === currentTabKey)
      ) {
        tabsStore.openTab({
          key: currentTabKey,
          title: `Patient ${currentRoute.params.id}`,
          route: { name: 'PatientEdit', params: { id: currentRoute.params.id } },
          closeable: true
        });
        tabsStore.setActiveTab(currentTabKey);
      } else if (
        isPatientTab &&
        tabsStore.tabs.find(tab => tab.key === currentTabKey)
      ) {
        // If it is already in the tabs, make sure it's the active tab
        tabsStore.setActiveTab(currentTabKey);
      }

      // Always push the active tab's route (from restored tabs)
      const activeTab = tabsStore.tabs.find(tab => tab.key === tabsStore.activeTabKey);
      if (
        activeTab &&
        activeTab.route &&
        (router.currentRoute.value.fullPath !== router.resolve(activeTab.route).fullPath)
      ) {
        router.push(activeTab.route);
      } else if (role === 'doctor') {
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
