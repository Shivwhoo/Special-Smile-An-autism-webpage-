import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for sending cookies
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a network error (server down, connection refused)
    if (!error.response) {
      toast.error('Cannot connect to the server. Please check your internet or try again later.');
    }
    return Promise.reject(error);
  }
);

export default api;
