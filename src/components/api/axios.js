// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // backend url
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token in the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
        // Handle specific HTTP status codes
        if (error.response.status === 401) {
            // Unauthorized: Clear token and redirect to login (optional)
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        }
        return Promise.reject(error);
    }
);

export default api;