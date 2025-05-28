import axios from 'axios';
import { createBrowserHistory } from 'history';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// For redirecting outside React components
const history = createBrowserHistory();

// Attach token to requests
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle responses globally
API.interceptors.response.use(
  response => response,
  error => {
    // If token is invalid or expired (usually 401 Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token'); // Remove invalid token
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;
