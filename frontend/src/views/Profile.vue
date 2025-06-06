<template>
  <section class="profile-page section">
    // general profile stuff now with editing support HUZZAH
    <div class="level">
      <div class="level-left">
        <h1 class="title">Profile</h1>
      </div>
      <div class="level-right">
        <button class="button is-info" @click="isEditing = !isEditing">
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();


// edit mode toggle
const isEditing = ref(false);

// placeholder user data until i know where tf doctor data is from sob emoji
const user = reactive({
  fullName: 'Dr. Jane Doe',
  username: 'janedoe123',
  profilePhoto: 'https://bulma.io/images/placeholders/128x128.png',
  gender: 'Female',
  dob: '1985-07-10',
  email: 'jane.doe@example.com',
  phone: '(555) 123-4567',
  bio: 'Experienced pediatrician with a passion for child health.',
  address: '123 Health St, Wellness City',
  specialty: 'Pediatrics',
  experience: 8,
  certifications: 'Board Certified in Pediatrics',
  onCall: true,
  hours: 'Mon-Fri, 9am-5pm',
  patientLoad: 15
});

const fileName = ref('');

// handle profile photo change kinda...?
function onImageChange(event) {
  const file = event.target.files[0];
  if (file) {
    fileName.value = file.name;
    user.profilePhoto = URL.createObjectURL(file);
  }
}

function logout(){
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.profile-page {
  font-family: 'Geist Sans', sans-serif;
}
.box {
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
}
/* Additional spacing and font-size adjustments */
.mt-4 {
  margin-top: 1rem;
}
</style>
