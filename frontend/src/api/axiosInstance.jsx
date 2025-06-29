import axios from 'axios';

const api = axios.create({
  // depends on frontend address
  baseURL: `${import.meta.env.VITE_IP_ADDRESS}:8000/api`,
  // baseURL: `http://192.168.1.3:8000/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;