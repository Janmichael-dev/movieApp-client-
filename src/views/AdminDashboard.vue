<template>
  <div class="admin-container">
    <h2>// SYSTEM_ADMIN_ACCESS //</h2>
    
    <!-- Form Section -->
    <div style="border: 2px solid var(--neon-pink); padding: 20px; margin-bottom: 40px; background: rgba(0, 0, 0, 0.5);">
      <h3 style="margin-top: 0;">> ADD_NEW_ENTRY</h3>
      <input v-model="form.title" placeholder="MOVIE_TITLE" />
      <input v-model="form.director" placeholder="DIRECTOR" />
      <input v-model="form.year" type="number" placeholder="RELEASE_YEAR" />
      <textarea v-model="form.description" placeholder="DESCRIPTION" rows="4"></textarea>
      <input v-model="form.genre" placeholder="GENRE" />
      <div style="margin-top: 20px;">
        <button id="addMovie" @click="save">{{ isEditing ? 'UPDATE_ENTRY' : 'UPLOAD_TO_CORE' }}</button>
        <button v-if="isEditing" @click="cancelEdit" style="background: var(--neon-pink);">CANCEL</button>
      </div>
    </div>
    
    <!-- Table Section -->
    <div style="border: 2px solid var(--neon-blue); padding: 20px; overflow-x: auto; background: rgba(0, 0, 0, 0.5);">
      <h3 style="margin-top: 0;">> DATABASE_ENTRIES</h3>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; min-width: 700px;">
          <thead style="color: var(--neon-yellow);">
            <tr>
              <th style="border-bottom: 2px solid #fff; text-align: left; padding: 12px; width: 30%;">TITLE</th>
              <th style="border-bottom: 2px solid #fff; text-align: left; padding: 12px; width: 25%;">DIRECTOR</th>
              <th style="border-bottom: 2px solid #fff; text-align: left; padding: 12px; width: 15%;">YEAR</th>
              <th style="border-bottom: 2px solid #fff; text-align: left; padding: 12px; width: 30%;">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in movies" :key="m._id" :style="{ background: isEditing && editingId === m._id ? 'rgba(255, 0, 255, 0.2)' : 'transparent' }">
              <td style="padding: 12px; border-bottom: 1px solid #333;">{{ m.title }}</td>
              <td style="padding: 12px; border-bottom: 1px solid #333;">{{ m.director }}</td>
              <td style="padding: 12px; border-bottom: 1px solid #333;">{{ m.year }}</td>
              <td style="padding: 12px; border-bottom: 1px solid #333;">
                <button @click="edit(m)" style="font-size: 1rem; padding: 8px 15px; margin-right: 5px;">UPDATE</button>
                <button @click="del(m._id)" style="font-size: 1rem; padding: 8px 15px;">DELETE</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
const isEditing = ref(false);
const editingId = ref(null);

const fetchMovies = async () => {
  try {
    const res = await api.get('/movies/getMovies');
    movies.value = res.data.movies || res.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

const save = async () => {
  try {
    if (isEditing.value) {
      // Update existing movie
      await api.put(`/movies/updateMovie/${editingId.value}`, form.value);
      alert('Movie updated successfully!');
    } else {
      // Add new movie
      await api.post('/movies/addMovie', form.value);
      alert('Movie added successfully!');
    }
    
    // Reset form
    form.value = { 
      title: '', 
      director: '', 
      year: '', 
      description: '', 
      genre: '' 
    };
    isEditing.value = false;
    editingId.value = null;
    
    fetchMovies();
  } catch (error) {
    alert('Error saving movie: ' + (error.response?.data?.message || error.message));
  }
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
  isEditing.value = true;
  editingId.value = movie._id;
  
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  form.value = { 
    title: '', 
    director: '', 
    year: '', 
    description: '', 
    genre: '' 
  };
  isEditing.value = false;
  editingId.value = null;
};

const del = async (id) => {
  if (confirm('DELETE THIS ENTRY FROM DATABASE?')) {
    try {
      await api.delete(`/movies/deleteMovie/${id}`);
      alert('Movie deleted successfully!');
      fetchMovies();
    } catch (error) {
      alert('Error deleting movie: ' + (error.response?.data?.message || error.message));
    }
  }
};

onMounted(fetchMovies);
</script>

<style scoped>
.admin-container {
  padding: 20px;
}

input, textarea {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  box-sizing: border-box;
}

table {
  color: #fff;
  table-layout: fixed;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

/* Ensure no overlap */
.admin-container > div {
  clear: both;
}
</style>