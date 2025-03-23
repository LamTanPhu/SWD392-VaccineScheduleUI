import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // config.headers.Authorization = `Bearer ${token}`;
            config.headers.Authorization = `${token}`;
            console.log('Sending request with token:', token); 
        } else {
            console.warn('No token found in localStorage');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('401 Unauthorized - Token invalid or expired');
            localStorage.removeItem('authToken');
            window.location.href = '/auth?reason=session_invalid';
        }
        return Promise.reject(error);
    }
);

export default api;