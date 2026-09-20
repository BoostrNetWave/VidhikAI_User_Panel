/// <reference types="vite/client" />
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Ensure url doesn't start with a slash so it properly appends to baseURL
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }
        
        // Ensure baseURL ends with a slash
        if (config.baseURL && !config.baseURL.endsWith('/')) {
            config.baseURL += '/';
        }

        const token = localStorage.getItem('user_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // If uploading FormData, delete Content-Type so browser/axios attaches multipart boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user_auth_token');
            localStorage.removeItem('user_profile_data');
            window.location.href = '/user/login';
        }
        
        if (error.response?.data?.error === 'INSUFFICIENT_CREDITS') {
            toast.error(error.response.data.message || 'You have insufficient AI credits.');
        }

        return Promise.reject(error);
    }
);

export default api;
