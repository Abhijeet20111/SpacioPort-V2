import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});


api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('sp_admin_token');
  const userToken = localStorage.getItem('sp_token');

  const token = adminToken || userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------- Auth ----------
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  me: () => api.get('/auth/me'),
};

// ---------- Spaces ----------
export interface SpaceFilters {
  type?: 'virtual' | 'physical' | '';
  duration?: 'long-term' | 'on-demand' | '';
  city?: string;
  maxPrice?: string | number;
  page?: number;
  limit?: number;
}

export const spacesAPI = {
  list: (params?: SpaceFilters) => {
    // Strip empty values so we never send `?type=` etc.
    const clean: Record<string, unknown> = {};
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== '' && v !== undefined && v !== null) clean[k] = v;
    });
    return api.get('/spaces', { params: clean });
  },
  get: (id: string) => api.get(`/spaces/${id}`),
  create: (data: Record<string, unknown>) => api.post('/spaces', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/spaces/${id}`, data),
  delete: (id: string) => api.delete(`/spaces/${id}`), // soft delete on backend
};

// ---------- Bookings (Lead form) ----------
export interface BookingPayload {
  spaceId: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export const bookingsAPI = {
  list: () => api.get('/bookings'),
  create: (data: BookingPayload) => api.post('/bookings', data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/bookings/${id}/status`, { status }),
  remove: (id: string) => api.delete(`/bookings/${id}`),
};

// ---------- Wishlist ----------
export const wishlistAPI = {
  list: () => api.get('/wishlist'),
  add: (spaceId: string) => api.post('/wishlist', { spaceId }),
  remove: (spaceId: string) => api.delete(`/wishlist/${spaceId}`),
};

// ---------- Campaigns ----------
export const campaignsAPI = {
  list: () => api.get('/campaigns'),
  create: (data: { name: string; budget: number; targetAudience: string }) =>
    api.post('/campaigns', data),
};

// ---------- Inquiries ----------
export const inquiriesAPI = {
  list: () => api.get('/inquiries'),
  create: (data: { name: string; email: string; subject?: string; message: string }) =>
    api.post('/inquiries', data),
};

export default api;
