
<template>
  <div class="card flex justify-center">
      <Slider v-model="value" class="w-56" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Slider from 'primevue/slider';

const value = ref(null);
</script>
