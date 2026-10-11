import api from './api';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  demoLogin: (role) => api.post('/auth/demo', { role }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const floorAPI = {
  getFloors: () => api.get('/floors'),
  createFloor: (data) => api.post('/floors', data),
  updateFloor: (id, data) => api.put(`/floors/${id}`, data),
  deleteFloor: (id) => api.delete(`/floors/${id}`),
  getTables: (params) => api.get('/tables', { params }),
  createTable: (data) => api.post('/tables', data),
  updateTable: (id, data) => api.put(`/tables/${id}`, data),
  deleteTable: (id) => api.delete(`/tables/${id}`),
};

export const customerAPI = {
  getAll: (params) => api.get('/customers', { params }),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const couponAPI = {
  getCoupons: () => api.get('/coupons'),
  createCoupon: (data) => api.post('/coupons', data),
  updateCoupon: (id, data) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
  validate: (data) => api.post('/coupons/validate', data),
  getPromotions: () => api.get('/promotions'),
  createPromotion: (data) => api.post('/promotions', data),
  updatePromotion: (id, data) => api.put(`/promotions/${id}`, data),
  deletePromotion: (id) => api.delete(`/promotions/${id}`),
};

export const orderAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  cancel: (id, reason) => api.patch(`/orders/${id}/cancel`, { reason }),
  getKitchen: (params) => api.get('/orders/kitchen', { params }),
  updateKitchen: (id, data) => api.patch(`/orders/${id}/kitchen`, data),
};

export const paymentAPI = {
  process: (id, data) => api.post(`/payments/${id}/pay`, data),
  getQR: (id) => api.get(`/payments/${id}/qr`),
};

export const receiptAPI = {
  getHTML: (id) => api.get(`/receipts/${id}/html`),
  downloadPDF: (id) => api.get(`/receipts/${id}/pdf`, { responseType: 'blob' }),
  email: (id, email) => api.post(`/receipts/${id}/email`, { email }),
};

export const posSessionAPI = {
  getActive: () => api.get('/pos-sessions/active'),
  getLastClosed: () => api.get('/pos-sessions/last-closed'),
  open: (data) => api.post('/pos-sessions/open', data),
  close: (id, data) => api.post(`/pos-sessions/${id}/close`, data),
  addCashTransaction: (data) => api.post('/pos-sessions/cash-transaction', data),
};

export const reportAPI = {
  getDashboard: (params) => api.get('/reports/dashboard', { params }),
  getSalesTrend: (params) => api.get('/reports/sales-trend', { params }),
  getTopProducts: (params) => api.get('/reports/top-products', { params }),
  getTopCategories: (params) => api.get('/reports/top-categories', { params }),
  getTopOrders: (params) => api.get('/reports/top-orders', { params }),
  getEmployees: () => api.get('/reports/employees'),
  getSessions: () => api.get('/reports/sessions'),
  exportExcel: (params) => api.get('/reports/export/excel', { params, responseType: 'blob' }),
  exportPDF: (params) => api.get('/reports/export/pdf', { params, responseType: 'blob' }),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  changePassword: (id, password) => api.put(`/users/${id}/change-password`, { password }),
  toggleArchive: (id) => api.patch(`/users/${id}/toggle-archive`),
  delete: (id) => api.delete(`/users/${id}`),
};
