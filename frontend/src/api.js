import axios from "axios";

// ✅ Vite uses import.meta.env instead of process.env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050/api"
});

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
