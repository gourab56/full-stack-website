// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1/users', // ✅ matches backend route
  withCredentials: true,     // ✅ enables cookies
});

export default api;
