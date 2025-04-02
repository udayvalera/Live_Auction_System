// src/services/apiClient.ts
import axios from 'axios';

// Define your backend base URL
const API_BASE_URL = 'http://localhost:5001/api'; // Use http for local dev if not using HTTPS

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor to add Auth Token ---
// This interceptor reads the token from localStorage (or wherever you store it)
// and adds it to the Authorization header for every request.
apiClient.interceptors.request.use(
  (config) => {
    // Use the same key you'll use in AuthContext for storing the token
    const token = localStorage.getItem('auctionverse_token');
    if (token) {
      // Ensure the header format matches what your backend 'protect' middleware expects
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Optional: Interceptor for Response Error Handling ---
// You might want to handle global errors, like logging out the user
// if a 401 Unauthorized response is received.
apiClient.interceptors.response.use(
  (response) => response, // Simply return successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      console.error("Unauthorized access - 401. Potentially logging out.");
      // Optionally trigger a logout action here if you have access to your auth context/store
      // For example: authContext.logout(false); // Pass false to prevent redirect loop if already on login page
      localStorage.removeItem('auctionverse_token'); // Ensure token is cleared
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
         // window.location.href = '/login'; // Hard redirect might be necessary
      }
    }
    // Return the error so components can handle specific errors if needed
    return Promise.reject(error);
  }
);


export default apiClient;