import { format, parseISO, isPast } from 'date-fns';

/**
 * Format a date string to 'MMM dd, yyyy'
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return '—';
  }
}

/**
 * Format a date string to 'MMM dd, yyyy HH:mm'
 */
export function formatDateTime(dateString) {
  if (!dateString) return '—';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch {
    return '—';
  }
}

/**
 * Returns true if the dueDate is in the past and status is not 'completed'
 */
export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'completed') return false;
  try {
    const date = typeof dueDate === 'string' ? parseISO(dueDate) : new Date(dueDate);
    return isPast(date);
  } catch {
    return false;
  }
}

/**
 * Returns Tailwind CSS class strings for priority badges
 */
export function getPriorityColor(priority) {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800';
    case 'medium':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-800';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

/**
 * Returns Tailwind CSS class strings for status badges
 */
export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-600';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-800';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

/**
 * Capitalize priority label
 */
export function getPriorityLabel(priority) {
  if (!priority) return '—';
  return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
}

/**
 * Human-readable status label
 */
export function getStatusLabel(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status || '—';
  }
}
