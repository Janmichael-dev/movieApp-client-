<template>
  <div class="retro-window login-box">
    <div class="window-header">User Login</div>
    <form @submit.prevent="handleLogin" style="padding: 20px;">
      <label>Email:</label>
      <input type="email" v-model="email" required />
      <label>Password:</label>
      <input type="password" v-model="password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    const res = await api.post('/users/login', {
      email: email.value,
      password: password.value
    });
    
    console.log('Login response:', res.data); // Debug log
    
    // Save the token
    localStorage.setItem('token', res.data.access);
    
    // CRITICAL FIX: The backend needs to return isAdmin in the token or response
    // We need to decode the JWT token to get isAdmin
    const tokenPayload = JSON.parse(atob(res.data.access.split('.')[1]));
    console.log('Token payload:', tokenPayload); // Debug log
    
    // Save isAdmin as string
    const isAdminValue = tokenPayload.isAdmin === true || tokenPayload.isAdmin === 'true';
    localStorage.setItem('isAdmin', String(isAdminValue));
    
    console.log('isAdmin saved as:', localStorage.getItem('isAdmin')); // Debug log
    
    // Redirect based on admin status
    if (isAdminValue) {
      router.push('/admin');
    } else {
      router.push('/movies');
    }
  } catch (err) {
    console.error('Login error:', err);
  }
};
</script>