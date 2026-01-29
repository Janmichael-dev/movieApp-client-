<template>
  <div class="admin-container">
    <h2>// SYSTEM_ADMIN_ACCESS //</h2>
    
    <div style="border: 2px solid var(--neon-pink); padding: 20px; margin-bottom: 20px;">
      <h3>> ADD_NEW_ENTRY</h3>
      <input v-model="form.title" placeholder="MOVIE_TITLE" />
      <input v-model="form.director" placeholder="DIRECTOR" />
      <input v-model="form.year" type="number" placeholder="RELEASE_YEAR" />
      <input v-model="form.description" placeholder="DESCRIPTION" />
      <input v-model="form.genre" placeholder="GENRE" />
      <button id="addMovie" @click="save">UPLOAD_TO_CORE</button>
    </div>

    <div style="border: 2px solid var(--neon-blue); padding: 10px; overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
        <thead style="color: var(--neon-yellow);">
          <tr>
            <th style="border-bottom: 2px solid #fff; text-align: left; padding: 10px;">TITLE</th>
            <th style="border-bottom: 2px solid #fff; text-align: left; padding: 10px;">DIRECTOR</th>
            <th style="border-bottom: 2px solid #fff; text-align: left; padding: 10px;">YEAR</th>
            <th style="border-bottom: 2px solid #fff; text-align: left; padding: 10px;">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in movies" :key="m._id">
            <td style="padding: 10px; border-bottom: 1px solid #333;">{{ m.title }}</td>
            <td style="padding: 10px; border-bottom: 1px solid #333;">{{ m.director }}</td>
            <td style="padding: 10px; border-bottom: 1px solid #333;">{{ m.year }}</td>
            <td style="padding: 10px; border-bottom: 1px solid #333;">
              <button @click="edit(m)" style="font-size: 0.8rem; padding: 5px 10px; margin-right: 5px;">UPDATE</button>
              <button @click="del(m._id)" style="font-size: 0.8rem; padding: 5px 10px;">DELETE</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const movies = ref([]);
const form = ref({ 
  title: '', 
  director: '', 
  year: '', 
  description: '', 
  genre: '' 
});

const fetchMovies = async () => {
  const res = await api.get('/movies/getMovies');
  movies.value = res.data.movies || res.data;
};

const save = async () => {
  await api.post('/movies/addMovie', form.value);
  form.value = { 
    title: '', 
    director: '', 
    year: '', 
    description: '', 
    genre: '' 
  };
  fetchMovies();
};

const edit = (movie) => {
  // Populate form with movie data for editing
  form.value = {
    title: movie.title,
    director: movie.director,
    year: movie.year,
    description: movie.description,
    genre: movie.genre
  };
  // You can add logic to switch to "update mode" here
};

const del = async (id) => {
  if (confirm('Delete this movie?')) {
    await api.delete(`/movies/deleteMovie/${id}`);
    fetchMovies();
  }
};

onMounted(fetchMovies);
</script>

<style scoped>
.admin-container {
  padding: 20px;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 15px;
}

table {
  color: #fff;
}
</style>