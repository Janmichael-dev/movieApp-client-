import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Movies from '../views/Movies.vue'
import MovieDetails from '../views/MovieDetails.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
  { path: '/', redirect: '/movies' },
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  { path: '/movies', name: 'Movies', component: Movies },
  { 
    path: '/movies/:id', 
    name: 'MovieDetails', 
    component: MovieDetails,
    meta: { requiresAuth: true }  // Add authentication requirement
  },
  { 
    path: '/admin', 
    name: 'AdminDashboard',
    component: AdminDashboard, 
    meta: { requiresAdmin: true } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
  
  console.log('Router guard - to:', to.path);
  console.log('Router guard - token:', token ? 'exists' : 'none');
  console.log('Router guard - isAdmin:', isAdmin);
  
  // Check if route requires admin access
  if (to.meta.requiresAdmin) {
    if (!token) {
      console.log('No token, redirecting to login');
      next('/login');
    } else if (isAdmin === 'true') {
      console.log('Admin access granted');
      next();
    } else {
      console.log('Not admin, redirecting to movies');
      next('/movies');
    }
  } 
  // Check if route requires authentication (for regular users and admins)
  else if (to.meta.requiresAuth) {
    if (!token) {
      console.log('Authentication required, redirecting to login');
      next('/login');
    } else {
      console.log('User authenticated, access granted');
      next();
    }
  } 
  // Public routes
  else {
    next();
  }
});

export default router