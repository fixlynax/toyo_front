import axios from 'axios';
import { useMenuStore } from '../store/menu';
// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': import.meta.env.VITE_API_KEY
    }
});
// Token management functions
export const tokenService = {
    getToken() {
        return localStorage.getItem('auth_token');
    },

    setToken(token) {
        localStorage.setItem('auth_token', token);
    },

    removeToken() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_expires_at');
        localStorage.removeItem('token_type');
    },

    isTokenExpired() {
        const expiresAt = localStorage.getItem('token_expires_at');
        if (!expiresAt) return true;

        return Date.now() >= parseInt(expiresAt) * 1000; // Convert to milliseconds
    },

    logout() {
        this.removeToken();
        const menuStore = useMenuStore();
        menuStore.reset();
        // Redirect to login page if needed
        // window.location.href = '/auth/login';
    }
};

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Handle unauthorized - token expired or invalid
            console.error('Unauthorized access - token may be expired');
            tokenService.logout();
        }
        return Promise.reject(error);
    }
);

apiClient.defaults.headers.post['Content-Type'] = 'multipart/form-data';

// API methods
export default {
    // GET request
    get(endpoint) {
        return apiClient.get(`/api/${endpoint}`);
    },

    // GET request with options
    getDownload(endpoint, options = {}) {
        return apiClient.get(`/api/${endpoint}`,options);
    },

    // POST request
    post(endpoint, data) {
        return apiClient.post(`/api/${endpoint}`, data);
    },

    // POST request (multipart/form-data)
    postExtra(endpoint, data, options = {}) {
        return apiClient.post(`/api/${endpoint}`, data ,options);
    },

    // PUT request
    put(endpoint, data) {
        return apiClient.put(`/api/${endpoint}`, data);
    },

    // DELETE request
    delete(endpoint) {
        return apiClient.delete(`/api/${endpoint}`);
    },

    // Custom request
    customRequest(config) {
        return apiClient(config);
    },

    async getPrivateFile(url) {
        try {
            const token = tokenService.getToken();
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Api-Key': import.meta.env.VITE_API_KEY
                }
            });

            if (response.status === 401) {
                console.warn('Unauthorized image access, skipping logout.');
                return null;
            }

            if (!response.ok) throw new Error('Failed to load private file');
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Private file fetch error:', error);
            return null;
        }
    },

    // Token service
    tokenService
};
