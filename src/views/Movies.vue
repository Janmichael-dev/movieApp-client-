<template>
  <div>
    <h2>Available_Titles</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
      <div v-for="movie in movies" :key="movie._id" class="movie-card">
        <h3 style="margin-top: 0;">{{ movie.title }}</h3>
        <p>DIR: {{ movie.director }}</p>
        <p>GENRE: {{ movie.genre }}</p>
        <button @click="viewMovie(movie._id)">View Movie</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const movies = ref([]);
const router = useRouter();

onMounted(async () => {
  const res = await api.get('/movies/getMovies');
  movies.value = res.data.movies || res.data;
});

const viewMovie = (movieId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Please login to view movie details');
    router.push('/login');
    return;
  }
  
  router.push(`/movies/${movieId}`);
};
</script>