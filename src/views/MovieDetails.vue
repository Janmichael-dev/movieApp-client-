<template>
  <div v-if="movie" class="movie-detail-container">
    <h2>> DATA_FILE: {{ movie.title }}</h2>
    
    <div style="border: 2px solid var(--neon-blue); padding: 20px; background: #000;">
      <p><span style="color: var(--neon-pink)">DIRECTOR:</span> {{ movie.director }}</p>
      <p><span style="color: var(--neon-pink)">YEAR:</span> {{ movie.year }}</p>
      <p><span style="color: var(--neon-pink)">DESC:</span> {{ movie.description }}</p>
      
      <div style="margin-top: 40px; border-top: 1px dashed var(--neon-yellow); padding-top: 20px;">
        <h3>USER_COMMENTS</h3>
        
        <div v-if="movie.comments && movie.comments.length > 0">
          <div v-for="c in movie.comments" :key="c._id" style="margin-bottom: 10px; color: var(--neon-blue);">
            >> {{ c.comment }}
          </div>
        </div>
        <div v-else style="margin-bottom: 10px; color: #666;">
          NO_COMMENTS_FOUND...
        </div>
        
        <div style="margin-top: 20px;">
          <input 
            v-model="newComment" 
            placeholder="Write a comment..." 
            @keyup.enter="postComment"
          />
          <button id="addComment" @click="postComment">ADD COMMENT</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else style="text-align: center; padding: 50px;">
    <h2>LOADING_SYSTEM_RESOURCES...</h2>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const movie = ref(null);
const newComment = ref('');

const loadMovie = async () => {
  try {
    const res = await api.get(`/movies/getMovie/${route.params.id}`);
    movie.value = res.data.movie || res.data;
  } catch (err) {
    console.error("Critical error: Could not fetch movie details", err);
  }
};

const postComment = async () => {
  if (!newComment.value.trim()) return;
  try {
    await api.post(`/movies/addComment/${route.params.id}`, { 
      comment: newComment.value 
    });
    newComment.value = '';
    await loadMovie(); 
  } catch (err) {
    console.error("Comment failed:", err.response?.data);
  }
};

onMounted(loadMovie);
</script>