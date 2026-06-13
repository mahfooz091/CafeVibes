import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token from localStorage (cookie is also set as fallback)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cafevibes_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Auto-refresh access token on 401, then retry original request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401 && !config._retry && config.url !== '/auth/refresh') {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            config._retry = true;
            resolve(api(config));
          });
        });
      }

      config._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        const newToken = data?.data?.accessToken;
        if (newToken) {
          localStorage.setItem('cafevibes_access_token', newToken);
          onRefreshed(newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
          return api(config);
        }
      } catch (refreshError) {
        localStorage.removeItem('cafevibes_access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
