import axios from 'axios';

const api = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "http://192.168.1.3:8000/api",// depends on frontend address
  // baseURL: "http://172.20.10.2:8000/api",// depends on frontend address
  // baseURL: "http://0.0.0.0:8000/api",// depends on frontend address
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;