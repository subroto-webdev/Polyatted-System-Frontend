import axios from 'axios';

// Development-এ CRA proxy ব্যবহার হয় (package.json → "proxy": "http://localhost:5000")
// Production-এ REACT_APP_API_URL এ full URL দিতে হবে (যেমন: https://yourapi.com/api)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000, // 15 সেকেন্ড
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Public routes যেগুলোতে 401 হলে redirect করা যাবে না
const PUBLIC_PATHS = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];

const isPublicPath = () =>
  PUBLIC_PATHS.some(path => window.location.pathname.startsWith(path));

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');

      // Public page-এ থাকলে redirect করব না — infinite loop এড়াতে
      if (!isPublicPath()) {
        window.location.href = '/login';
      }
    }

    // Network error (server down, CORS, etc.)
    if (!err.response) {
      console.error('Network error — server সংযোগ করা যাচ্ছে না:', err.message);
    }

    return Promise.reject(err);
  }
);

export default api;