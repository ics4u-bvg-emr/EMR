<template>
  <section class="profile-page section">
    <div class="level">
      <div class="level-left">
        <h1 class="title">Profile</h1>
      </div>
      <div class="level-right">
        <button class="button is-info" @click="handleEditToggle">
          {{ isEditing ? 'Save' : 'Edit Profile' }}
        </button>
      </div>
    </div>

    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-one-third">
          <div class="box has-text-centered">
            <figure class="image is-128x128 is-inline-block">
              <img :src="user.profilePhoto" alt="Profile Photo" />
            </figure>
            <div v-if="isEditing" class="file has-name is-fullwidth mt-4">
              <label class="file-label">
                <input class="file-input" type="file" @change="onImageChange" />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">Choose a file…</span>
                </span>
                <span class="file-name" v-if="fileName">{{ fileName }}</span>
              </label>
            </div>
            <h2 class="title is-4 mt-4">{{ user.fullName }}</h2>
            <p class="subtitle is-6">@{{ user.username }}</p>
            <button @click="logout" class="button is-light mt-4">Log out</button>
          </div>
        </div>

        <div class="column is-two-thirds">
          <div class="box">
            <h3 class="title is-5">Personal Details</h3>
            <div class="field">
              <label class="label">Full Name</label>
              <div class="control">
                <input v-if="isEditing" class="input" type="text" v-model="user.fullName" />
                <p v-else class="is-size-5">{{ user.fullName }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">Username / ID</label>
              <div class="control">
                <input v-if="isEditing" class="input" type="text" v-model="user.username" />
                <p v-else class="is-size-5">{{ user.username }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">Gender</label>
              <div class="control">
                <div v-if="isEditing" class="select">
                  <select v-model="user.gender">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <p v-else class="is-size-5">{{ user.gender }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">Date of Birth</label>
              <div class="control">
                <input v-if="isEditing" class="input" type="date" v-model="user.dob" />
                <p v-else class="is-size-5">{{ user.dob }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">Bio</label>
              <div class="control">
                <textarea v-if="isEditing" class="textarea" v-model="user.bio"></textarea>
                <p v-else class="is-size-5">{{ user.bio }}</p>
              </div>
            </div>
          </div>

          <div class="box">
            <h3 class="title is-5">Contact & Location</h3>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input v-if="isEditing" class="input" type="email" v-model="user.email" />
                <p v-else class="is-size-5">{{ user.email }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">Phone Number</label>
              <div class="control">
                <input v-if="isEditing" class="input" type="tel" v-model="user.phone" />
                <p v-else class="is-size-5">{{ user.phone }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">Work Address / Clinic Location</label>
              <div class="control">
                <input v-if="isEditing" class="input" type="text" v-model="user.address" />
                <p v-else class="is-size-5">{{ user.address }}</p>
              </div>
            </div>
          </div>

          <div class="box">
            <h3 class="title is-5">Professional Details</h3>
            <div class="field">
              <label class="label">Specialty</label>
              <div class="control">
                <input v-if="isEditing" class="input" type="text" v-model="user.specialty" />
                <p v-else class="is-size-5">{{ user.specialty }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">Years of Experience</label>
              <div class="control">
                <input v-if="isEditing" class="input" type="number" v-model.number="user.experience" />
                <p v-else class="is-size-5">{{ user.experience }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">Certifications</label>
              <div class="control">
                <textarea v-if="isEditing" class="textarea" v-model="user.certifications"></textarea>
                <p v-else class="is-size-5">{{ user.certifications }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">On-call Status</label>
              <div class="control">
                <label class="checkbox" v-if="isEditing">
                  <input v-if="isEditing" type="checkbox" v-model="user.onCall" />
                  {{ user.onCall ? 'On Call' : 'Off Call' }}
                </label>
                <p v-else class="is-size-5">{{ user.onCall ? 'On Call' : 'Off Call' }}</p>
              </div>
            </div>
          </div>

          <div class="box">
            <h3 class="title is-5">Schedule</h3>
            <div class="field">
              <label class="label">Clinic Hours / Work Days</label>
              <div class="control">
                <input v-if="isEditing" class="input" type="text" v-model="user.hours" />
                <p v-else class="is-size-5">{{ user.hours }}</p>
              </div>
            </div>
            <div class="field">
              <label class="label">Patient Load / Slots per Day</label>
              <div class="control">
                <input v-if="isEditing" class="input" type="number" v-model.number="user.patientLoad" />
                <p v-else class="is-size-5">{{ user.patientLoad }}</p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <router-link to="/appointments">View Appointments</router-link>
              </div>
            </div>
          </div>

          <div class="box has-text-centered">
            <router-link class="button is-light is-fullwidth" to="/changepassword">Change Username/Password</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { setUserRole } from '@/stores/user.js'

const router = useRouter();
const isEditing = ref(false);
const fileName = ref('');
const user = reactive({
  fullName: '',
  username: '',
  profilePhoto: 'https://bulma.io/images/placeholders/128x128.png',
  gender: '',
  dob: '',
  email: '',
  phone: '',
  bio: '',
  address: '',
  specialty: '',
  experience: 0,
  certifications: '',
  onCall: false,
  hours: '',
  patientLoad: 0
});

const token = localStorage.getItem('token');
const decoded = token ? JSON.parse(atob(token.split('.')[1])) : {};
let doctorId = null;

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  let decoded;
  try {
    decoded = JSON.parse(atob(token.split('.')[1]));
  } catch {
    router.push('/login');
    return;
  }

  const role = decoded.role;
  const userId = decoded.id;

  if (!userId || !role) {
    router.push('/login');
    return;
  }

  try {
    let res, data;
    if (role === 'doctor') {
      res = await axios.get(`/api/doctors/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      data = res.data;
      Object.assign(user, {
        fullName: `${data.firstName} ${data.lastName}`,
        username: data.username,
        profilePhoto: data.profilePhoto || user.profilePhoto,
        gender: data.gender || '',
        dob: data.dob ? data.dob.split('T')[0] : '',
        email: data.email,
        phone: data.phone || '',
        bio: data.bio || '',
        address: data.address || '',
        specialty: data.specialization || '',
        experience: data.experience || 0,
        certifications: data.certifications || '',
        onCall: data.onCall || false,
        hours: data.hours || '',
        patientLoad: data.patientLoad || 0
      });
    } else if (role === 'receptionist') {
      res = await axios.get(`/api/receptionists/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      data = res.data;
      Object.assign(user, {
        fullName: `${data.firstName} ${data.lastName}`,
        username: data.username,
        profilePhoto: data.profilePhoto || user.profilePhoto,
        email: data.email,
        phone: data.phone || '',
        bio: data.bio || '',
        address: data.address || '',
        // Add any other receptionist fields here
      });
    } else {
      router.push('/login');
      return;
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      router.push('/login');
    } else {
      console.error('Failed to load profile:', err);
    }
  }
});

async function onImageChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  fileName.value = file.name;

  const localPreviewUrl = URL.createObjectURL(file);
  user.profilePhoto = localPreviewUrl;

  const formData = new FormData();
  formData.append('photo', file);

  try {
    const res = await axios.put(`/api/doctors/${doctorId}/profile-photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    user.profilePhoto = res.data.profilePhoto;
  } catch (err) {
    console.error('Failed to upload profile photo:', err);
  }
}

function handleEditToggle() {
  if (isEditing.value) {
    saveProfile();
  }
  isEditing.value = !isEditing.value;
}

async function saveProfile() {
  try {
    const [firstName, ...lastNameParts] = user.fullName.split(' ')
    const lastName = lastNameParts.join(' ')

    const updatedData = {
      firstName,
      lastName,
      username: user.username,
      gender: user.gender,
      dob: user.dob,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      address: user.address,
      specialization: user.specialty,
      experience: user.experience,
      certifications: user.certifications,
      onCall: user.onCall,
      hours: user.hours,
      patientLoad: user.patientLoad
    }

    await axios.put(`/api/doctors/${doctorId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log('Profile saved.')
  } catch (err) {
    console.error('Failed to save profile:', err)
  }
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('loginAttempts')
  setUserRole(null)
  router.push('/login')
}
</script>

<style scoped>
.profile-page {
  font-family: 'Inter', 'Geist Sans', sans-serif;
  background-color: #f5f7fa;
  padding-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e1e1e;
}

.subtitle {
  font-size: 1rem;
  color: #6b7280;
}

.level {
  margin-bottom: 2rem;
}

.box {
  border-radius: 1rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  padding: 1.75rem;
  background: white;
  margin-bottom: 2rem;
  transition: box-shadow 0.2s ease;
}

.box:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.field {
  margin-bottom: 1.5rem;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.input,
.textarea,
.select select {
  font-size: 0.95rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

p.is-size-5 {
  font-size: 0.95rem;
  color: #4b5563;
  margin-top: 0.25rem;
}

.image img {
  border-radius: 50%;
  border: 3px solid #00b89c;
  object-fit: cover;
  max-width: 128px;
  max-height: 128px;
}

.file-label {
  cursor: pointer;
}

.mt-4 {
  margin-top: 1rem;
}

.button.is-info {
  font-size: 0.95rem;
  padding: 0.6em 1.2em;
  border-radius: 8px;
  background-color: #3b82f6;
  border: none;
  color: white;
  font-weight: 600;
}

.button.is-light {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: #f3f4f6;
  color: #374151;
}

.router-link {
  font-weight: 500;
  font-size: 0.95rem;
  color: #3b82f6;
  text-decoration: none;
}

.router-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .box {
    padding: 1.25rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .field {
    margin-bottom: 1rem;
  }
}
</style>

