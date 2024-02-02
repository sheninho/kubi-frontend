// services/axiosService.js
import axios from 'axios';
import { API_URL } from './authService';
import { useAuth } from '@/app/context/AuthContext.js';

const axiosService = axios.create({
    baseURL: `${API_URL}`
    // baseURL: `${API_URL}token-refresh/`
});

axiosService.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axiosService.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await axios.post(`${API_URL}token-refresh/`, {
                refresh: refreshToken
            });
            const { access } = response.data;
            localStorage.setItem('accessToken', access);
            originalRequest.headers['Authorization'] = `Bearer ${access}`;
            return axiosService(originalRequest);
        } catch (refreshError) {
            console.error('Erreur lors du rafraîchissement du token', refreshError);

            useAuth.logout();
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

export default axiosService;
