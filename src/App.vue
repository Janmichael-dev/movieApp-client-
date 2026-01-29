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
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const token = ref(localStorage.getItem('token'));
const isAdmin = ref(localStorage.getItem('isAdmin'));

// This re-checks your status every time you navigate to a new page
watch(() => route.path, () => {
  token.value = localStorage.getItem('token');
  isAdmin.value = localStorage.getItem('isAdmin');
});

const logout = () => {
  localStorage.clear();
  token.value = null;
  isAdmin.value = null;
  window.location.href = '/login';
};
</script>