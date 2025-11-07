import axios from "axios";

// ✅ Vite uses import.meta.env instead of process.env
// VITE_API_URL is set during build time in Render environment variables
const baseURL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? "https://your-backend-url.onrender.com/api" // ⚠️ Replace with your actual backend URL
    : "http://localhost:5050/api");

const API = axios.create({
  baseURL: baseURL
});

// Log the API URL for debugging
console.log("🔗 API Base URL:", API.defaults.baseURL);

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
