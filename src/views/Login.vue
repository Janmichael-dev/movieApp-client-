<template>
  <div class="retro-window login-box">
    <div class="window-header">User Login</div>
    <form @submit.prevent="handleLogin" style="padding: 20px;">
      <label>Email:</label>
      <input type="email" v-model="email" required />
      <label>Password:</label>
      <input type="password" v-model="password" required />
      <button type="submit">Login</button>
      <p v-if="errorMsg" style="color: var(--neon-pink); margin-top: 10px;">{{ errorMsg }}</p>
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
const errorMsg = ref('');

const handleLogin = async () => {
  try {
    errorMsg.value = '';
    
    console.log('=== LOGIN DEBUG ===');
    console.log('API Base URL:', import.meta.env.VITE_MOVIE_APP_API);
    console.log('Attempting login for:', email.value);
    
    const res = await api.post('/users/login', {
      email: email.value,
      password: password.value
    });
    
    console.log('Login response:', res.data);
    
    if (!res.data.access) {
      throw new Error('No token received from server');
    }
    
    // Save the token
    localStorage.setItem('token', res.data.access);
    
    // Decode JWT token to get isAdmin
    try {
      const tokenPayload = JSON.parse(atob(res.data.access.split('.')[1]));
      console.log('Token payload:', tokenPayload);
      
      // Save isAdmin as string
      const isAdminValue = tokenPayload.isAdmin === true || tokenPayload.isAdmin === 'true';
      localStorage.setItem('isAdmin', String(isAdminValue));
      
      console.log('isAdmin saved as:', localStorage.getItem('isAdmin'));
      
      // Small delay to ensure localStorage is saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect based on admin status
      if (isAdminValue) {
        console.log('Redirecting to admin panel...');
        router.push('/admin');
      } else {
        console.log('Redirecting to movies...');
        router.push('/movies');
      }
    } catch (decodeError) {
      console.error('Token decode error:', decodeError);
      errorMsg.value = 'Invalid token format';
    }
    
  } catch (err) {
    console.error('=== LOGIN ERROR ===');
    console.error('Full error:', err);
    console.error('Error response:', err.response?.data);
    console.error('Error status:', err.response?.status);
    
    if (err.response?.status === 401) {
      errorMsg.value = 'Invalid email or password';
    } else if (err.response?.status === 404) {
      errorMsg.value = 'Login endpoint not found - check backend';
    } else if (err.code === 'ERR_NETWORK') {
      errorMsg.value = 'Cannot connect to server - check API URL';
    } else {
      errorMsg.value = err.response?.data?.message || 'Login failed';
    }
  }
};
</script>