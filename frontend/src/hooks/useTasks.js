import { useState, useCallback, useEffect, useRef } from 'react';
import { taskApi } from '../services/api';

const DEFAULT_FILTERS = {
  search: '',
  status: '',
  priority: '',
  date: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

/**
 * Custom debounce hook that returns a debounced value
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

/**
 * Main task management hook
 */
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [filters, setFiltersState] = useState(DEFAULT_FILTERS);

  // Only debounce the search field, keep other filters reactive
  const debouncedSearch = useDebounce(filters.search, 500);

  // Effective filters used for actual API calls
  const effectiveFilters = { ...filters, search: debouncedSearch };

  // Track if it's the initial mount to avoid double-fetch
  const hasMounted = useRef(false);

  const fetchTasks = useCallback(async (overrideFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = overrideFilters || effectiveFilters;
      const response = await taskApi.getAll(params);
      // Backend returns { success, data: { tasks, pagination } }
      // Axios interceptor unwraps to that object, so response = { success, data: { tasks, pagination } }
      const taskList = response?.data?.tasks || response?.tasks || [];
      const paginationData = response?.data?.pagination || response?.pagination || {};
      setTasks(taskList);
      setPagination({
        page: paginationData.page || params.page || 1,
        totalPages: paginationData.totalPages || paginationData.pages || 1,
        total: paginationData.total || taskList.length,
        limit: paginationData.limit || params.limit || 10,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [effectiveFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStats = useCallback(async () => {
    try {
      const response = await taskApi.getStats();
      // Backend returns { success, data: { total, pending, ... } }
      const data = response?.data || response;
      setStats({
        total: data.total || 0,
        pending: data.pending || 0,
        in_progress: data.in_progress || data.inProgress || 0,
        completed: data.completed || 0,
        low: data.low || 0,
        medium: data.medium || 0,
        high: data.high || 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err.message);
    }
  }, []);

  // Fetch whenever effective filters (including debounced search) change
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [
    debouncedSearch,
    filters.status,
    filters.priority,
    filters.date,
    filters.sortBy,
    filters.sortOrder,
    filters.page,
    filters.limit,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const createTask = useCallback(async (data) => {
    const response = await taskApi.create(data);
    await fetchTasks();
    await fetchStats();
    return response;
  }, [fetchTasks, fetchStats]);

  const updateTask = useCallback(async (id, data) => {
    const response = await taskApi.update(id, data);
    await fetchTasks();
    await fetchStats();
    return response;
  }, [fetchTasks, fetchStats]);

  const deleteTask = useCallback(async (id) => {
    await taskApi.delete(id);
    await fetchTasks();
    await fetchStats();
  }, [fetchTasks, fetchStats]);

  /**
   * Update filters, reset page to 1 when non-page filter changes
   */
  const setFilters = useCallback((newFilters) => {
    setFiltersState((prev) => {
      const updated = { ...prev, ...newFilters };
      // Reset to page 1 when anything other than page changes
      if (Object.keys(newFilters).some((k) => k !== 'page')) {
        updated.page = 1;
      }
      return updated;
    });
  }, []);

  return {
    tasks,
    loading,
    error,
    stats,
    pagination,
    filters,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
  };
}
