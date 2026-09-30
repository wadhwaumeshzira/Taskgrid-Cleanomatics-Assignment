import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - log requests
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - extract data and handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('[API] Response error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    const enhancedError = new Error(message);
    enhancedError.status = error.response?.status;
    enhancedError.data = error.response?.data;
    return Promise.reject(enhancedError);
  }
);

export const taskApi = {
  /**
   * Get all tasks with optional filters
   * @param {{ search?: string, status?: string, priority?: string, sortBy?: string, sortOrder?: string, page?: number, limit?: number }} params
   */
  getAll: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    );
    return api.get('/tasks', { params: cleanParams });
  },

  /** Get a single task by ID */
  getById: (id) => api.get(`/tasks/${id}`),

  /** Create a new task */
  create: (taskData) => api.post('/tasks', taskData),

  /** Update an existing task */
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),

  /** Delete a task */
  delete: (id) => api.delete(`/tasks/${id}`),

  /** Get task statistics */
  getStats: () => api.get('/tasks/stats'),
};

export default api;
