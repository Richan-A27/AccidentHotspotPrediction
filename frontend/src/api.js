import axios from "axios";

// ✅ Vite uses import.meta.env instead of process.env
// VITE_API_URL is set during build time in Render environment variables
const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL;
  
  // If VITE_API_URL is not set, use defaults
  if (!url) {
    url = import.meta.env.PROD 
      ? "https://accidenthotspotprediction.onrender.com/api" // ⚠️ Replace with your actual backend URL
      : "http://localhost:5050/api";
  }
  
  // ✅ Ensure the URL ends with /api
  if (!url.endsWith('/api')) {
    // If it ends with /, remove it and add /api
    if (url.endsWith('/')) {
      url = url.slice(0, -1) + '/api';
    } else {
      // Otherwise just add /api
      url = url + '/api';
    }
  }
  
  return url;
};

const baseURL = getBaseURL();

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
