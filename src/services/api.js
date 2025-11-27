import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stunning-potato-v6vrwwg9pqpvhxqxg-8081.app.github.dev',
});

// INTERCEPTOR: O "Middleware" do Frontend
api.interceptors.request.use(async (config) => {
  // Tenta pegar o token salvo no navegador
  const token = localStorage.getItem('@CallQuality:token');

  // Se tiver token, adiciona no cabeçalho Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
