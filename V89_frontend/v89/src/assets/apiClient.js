import axios from "axios";

// 1. Create a base Axios instance
const apiClient = axios.create({
  // Base URL is usually not needed here if you rely on Vite proxy setup
  // baseURL: 'http://localhost:3000',
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add a request interceptor
// This interceptor runs *before* every request is sent.
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from storage
    const token = localStorage.getItem("userToken");

    // If the token exists, attach it to the Authorization header
    if (token) {
      // CRITICAL: The header format must be 'Bearer ' + token
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default apiClient;
