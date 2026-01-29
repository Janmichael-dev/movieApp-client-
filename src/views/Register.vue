<template>
  <div class="retro-window">
    <h2>// JOIN_THE_NETWORK //</h2>
    <form @submit.prevent="handleRegister" style="padding: 20px; border: 2px solid var(--neon-pink);">
      <label>EMAIL:</label>
      <input type="email" v-model="email" required />
      
      <label>PASSWORD:</label>
      <input type="password" v-model="password" required />
      
      <button type="submit">CREATE_ACCOUNT</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const email = ref('');
const password = ref('');
const name = ref('');
const router = useRouter();

const handleRegister = async () => {
  try {
    const res = await fetch('https://movieapp2-0.onrender.com/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value, name: name.value }) // Adjust keys based on API
    });
    
    if (res.ok) {
      Swal.fire('Success', 'Registered successfully!', 'success');
      router.push('/login');
    } else {
      Swal.fire('Error', 'Registration failed', 'error');
    }
  } catch (error) {
    console.error(error);
  }
};
</script>