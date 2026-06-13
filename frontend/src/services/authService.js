import api from './api';

export const authService = {
  signup: async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    return data.data;
  },

  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    return data.data;
  },

  googleAuth: async (idToken) => {
    const { data } = await api.post('/auth/google', { idToken });
    return data.data;
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data.data;
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data.data;
  },
};
