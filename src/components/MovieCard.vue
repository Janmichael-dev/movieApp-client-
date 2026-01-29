<template>
  <div class="movie-card">
    <h3>{{ movie.title }}</h3>
    <p>{{ movie.genre }} • {{ movie.year }}</p>
    <router-link
      class="btn full"
      :to="`/movies/${movie._id}`"
    >
      View Movie
    </router-link>
  </div>
</template>

<script setup>
defineProps({ movie: Object });
</script>