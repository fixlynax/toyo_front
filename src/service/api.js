import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': import.meta.env.VITE_API_KEY
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('auth_token');
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
      // Handle unauthorized
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// API methods
export default {
  // GET request
  get(endpoint) {
    return apiClient.get(`/api/${endpoint}`);
  },

  // POST request
  post(endpoint, data) {
    return apiClient.post(`/api/${endpoint}`, data);
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
  }
};