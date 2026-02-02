import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // Important for cookies/session
});

// Function to get CSRF cookie
export const getCsrfCookie = async () => {
  await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Get XSRF token from cookie
    const xsrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 419 CSRF token mismatch - retry with fresh CSRF token
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get fresh CSRF cookie
        await getCsrfCookie();
        
        // Update XSRF token in the request
        const xsrfToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];
        
        if (xsrfToken) {
          originalRequest.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
        }
        
        // Retry the original request
        return api(originalRequest);
      } catch (csrfError) {
        return Promise.reject(csrfError);
      }
    }
    
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    // Get CSRF cookie first for stateful authentication
    await getCsrfCookie();
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/me');
    return response.data;
  },
  
  updatePassword: async (currentPassword: string, newPassword: string, newPasswordConfirmation: string) => {
    const response = await api.put('/password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
    return response.data;
  },
};

// Kategori API
export const kategoriApi = {
  getAll: async (params?: { search?: string; is_active?: boolean; all?: boolean }) => {
    const response = await api.get('/kategori', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/kategori/${id}`);
    return response.data;
  },
  
  create: async (data: {
    nama: string;
    deskripsi?: string;
    biaya_per_hari: number;
    denda_per_hari: number;
    is_active?: boolean;
  }) => {
    const response = await api.post('/kategori', data);
    return response.data;
  },
  
  update: async (id: number, data: {
    nama: string;
    deskripsi?: string;
    biaya_per_hari: number;
    denda_per_hari: number;
    is_active?: boolean;
  }) => {
    const response = await api.put(`/kategori/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/kategori/${id}`);
    return response.data;
  },
};

// Pelanggan API
export const pelangganApi = {
  getAll: async (params?: {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
    all?: boolean;
  }) => {
    const response = await api.get('/pelanggan', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/pelanggan/${id}`);
    return response.data;
  },
  
  getNextId: async () => {
    const response = await api.get('/pelanggan/next-id');
    return response.data;
  },
  
  create: async (data: {
    nama: string;
    no_hp: string;
    alamat: string;
    email?: string;
  }) => {
    const response = await api.post('/pelanggan', data);
    return response.data;
  },
  
  update: async (id: number, data: {
    nama: string;
    no_hp: string;
    alamat: string;
    email?: string;
    is_active?: boolean;
  }) => {
    const response = await api.put(`/pelanggan/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/pelanggan/${id}`);
    return response.data;
  },
};

// Penitipan API
export const penitipanApi = {
  getAll: async (params?: {
    search?: string;
    status?: 'dititipkan' | 'diambil';
    kategori_id?: number;
    pelanggan_id?: number;
    date_from?: string;
    date_to?: string;
    overdue?: boolean;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
    all?: boolean;
  }) => {
    const response = await api.get('/penitipan', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/penitipan/${id}`);
    return response.data;
  },
  
  getNextId: async () => {
    const response = await api.get('/penitipan/next-id');
    return response.data;
  },
  
  getStatistics: async () => {
    const response = await api.get('/dashboard/statistics');
    return response.data;
  },
  
  create: async (data: {
    pelanggan_id: number;
    kategori_id: number;
    nama_barang: string;
    deskripsi?: string;
    tanggal_titip: string;
    durasi_hari: number;
    biaya_per_hari?: number;
    denda_per_hari?: number;
    catatan?: string;
  }) => {
    const response = await api.post('/penitipan', data);
    return response.data;
  },
  
  update: async (id: number, data: {
    pelanggan_id: number;
    kategori_id: number;
    nama_barang: string;
    deskripsi?: string;
    tanggal_titip: string;
    durasi_hari: number;
    biaya_per_hari?: number;
    denda_per_hari?: number;
    catatan?: string;
  }) => {
    const response = await api.put(`/penitipan/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/penitipan/${id}`);
    return response.data;
  },
  
  pickup: async (id: number, tanggalAmbil?: string) => {
    const response = await api.post(`/penitipan/${id}/pickup`, {
      tanggal_ambil: tanggalAmbil,
    });
    return response.data;
  },
};

export default api;
