import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('cyber-session-token');
  if (token) {
    config.headers['x-session-token'] = token;
  }
  return config;
});

export default client;

