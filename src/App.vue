<template>
  <div class="retro-app-wrapper">
    <header>
      <h1>// MOVIE_NET_2026 //</h1>
          <nav>
            <router-link to="/movies" class="btn">CATALOG</router-link>
            <template v-if="!token">
              <router-link to="/login" class="btn">LOGIN</router-link>
              <router-link to="/register" class="btn">REGISTER</router-link>
            </template>
            <template v-else>
              <router-link v-if="isAdmin === 'true'" to="/admin" class="btn">ADMIN_PANEL</router-link>
              <button @click="logout" class="btn">EXIT</button>
            </template>
    </nav>
    </header>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const token = ref(localStorage.getItem('token'));
const isAdmin = ref(localStorage.getItem('isAdmin'));

// This re-checks your status every time you navigate to a new page
watch(() => route.path, () => {
  token.value = localStorage.getItem('token');
  isAdmin.value = localStorage.getItem('isAdmin');
});

const logout = () => {
  // Clear localStorage
  localStorage.clear();
  
  // Update reactive refs
  token.value = null;
  isAdmin.value = null;
  
  // Use Vue Router instead of window.location
  router.push('/login').catch(err => {
    // Handle navigation errors gracefully
    console.error('Navigation error:', err);
  });
};
</script>