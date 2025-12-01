import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stunning-potato-v6vrwwg9pqpvhxqxg-8081.app.github.dev/',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('@CallQuality:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
