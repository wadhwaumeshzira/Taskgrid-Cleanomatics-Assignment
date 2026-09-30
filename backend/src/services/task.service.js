const { v4: uuidv4 } = require('uuid');

// ── In-memory store ───────────────────────────────────────────────────────────
let tasks = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    title: 'Buy groceries for the week',
    description: 'Get milk, eggs, bread, and some fresh vegetables from the supermarket.',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    title: 'Schedule dentist appointment',
    description: 'Call Dr. Smith to schedule the routine 6-month checkup.',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3b241101-e2bb-4255-8caf-4136c566a962',
    title: 'Clean the garage',
    description: 'Organize the tools, throw away old boxes, and sweep the floor.',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    title: 'Pay electricity bill',
    description: 'The bill is due soon. Make sure to pay it online through the portal.',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a8098c1a-f86e-11da-bd1a-00112444be1e',
    title: 'Read the new sci-fi novel',
    description: 'Start reading the book I bought last week before bed.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c129d380-6e35-4318-97c7-e61304562093',
    title: 'Plan weekend trip',
    description: 'Look for hotels and book train tickets for the weekend getaway.',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Priority weight for sorting
const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

// ── Helpers ───────────────────────────────────────────────────────────────────
/**
 * Compare two tasks for a given sort field.
 * Returns a negative, zero, or positive number.
 */
const compareBy = (a, b, sortBy, sortOrder) => {
  let valA, valB;

  if (sortBy === 'priority') {
    valA = PRIORITY_WEIGHT[a.priority] ?? 0;
    valB = PRIORITY_WEIGHT[b.priority] ?? 0;
  } else {
    // createdAt | updatedAt | dueDate — compare as strings/dates
    valA = a[sortBy] ? new Date(a[sortBy]).getTime() : 0;
    valB = b[sortBy] ? new Date(b[sortBy]).getTime() : 0;
  }

  if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
  if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
  return 0;
};

// ── Service functions ─────────────────────────────────────────────────────────

/**
 * Get all tasks with optional filtering, sorting, and pagination.
 *
 * @param {object} options
 * @param {string}  [options.search]    - filter by title/description substring
 * @param {string}  [options.status]    - filter by status
 * @param {string}  [options.priority]  - filter by priority
 * @param {string}  [options.sortBy='createdAt']
 * @param {string}  [options.sortOrder='desc']
 * @param {number}  [options.page=1]
 * @param {number}  [options.limit=10]
 * @returns {{ tasks: object[], total: number, page: number, limit: number, totalPages: number }}
 */
const getAllTasks = ({
  search,
  status,
  priority,
  date,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 10,
} = {}) => {
  // Normalise & clamp
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

  const validSortBy = ['createdAt', 'dueDate', 'priority', 'updatedAt'];
  if (!validSortBy.includes(sortBy)) sortBy = 'createdAt';
  if (!['asc', 'desc'].includes(sortOrder)) sortOrder = 'desc';

  // Filtering
  let filtered = tasks.filter((task) => {
    if (
      search &&
      !task.title.toLowerCase().includes(search.toLowerCase()) &&
      !task.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (status && task.status !== status) return false;
    if (priority && task.priority !== priority) return false;
    if (date) {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      if (taskDate !== date) return false;
    }
    return true;
  });

  // Sorting
  filtered = [...filtered].sort((a, b) => compareBy(a, b, sortBy, sortOrder));

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);

  return { tasks: paginated, total, page, limit, totalPages };
};

/**
 * Get a single task by ID.
 * @param {string} id
 * @returns {object|null}
 */
const getTaskById = (id) => tasks.find((t) => t.id === id) || null;

/**
 * Create a new task.
 * @param {{ title, description, status, priority, dueDate }} data
 * @returns {object} the created task
 */
const createTask = ({ title, description, status = 'pending', priority = 'medium', dueDate }) => {
  const now = new Date().toISOString();
  const task = {
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    status,
    priority,
    dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  return task;
};

/**
 * Update an existing task (partial update — only supplied fields are changed).
 * @param {string} id
 * @param {{ title?, description?, status?, priority?, dueDate? }} updates
 * @returns {object|null} updated task or null if not found
 */
const updateTask = (id, { title, description, status, priority, dueDate }) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const existing = tasks[index];
  const updated = {
    ...existing,
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(status !== undefined && { status }),
    ...(priority !== undefined && { priority }),
    ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate).toISOString() : null }),
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  return updated;
};

/**
 * Delete a task by ID.
 * @param {string} id
 * @returns {object|null} the deleted task or null if not found
 */
const deleteTask = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const [deleted] = tasks.splice(index, 1);
  return deleted;
};

/**
 * Get aggregate statistics about tasks.
 * @returns {{ total, pending, in_progress, completed, low, medium, high }}
 */
const getTaskStats = () => {
  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    low: tasks.filter((t) => t.priority === 'low').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    high: tasks.filter((t) => t.priority === 'high').length,
  };
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
