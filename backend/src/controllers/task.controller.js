const taskService = require('../services/task.service');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * GET /api/tasks
 * Query params: search, status, priority, sortBy, sortOrder, page, limit
 */
const getAllTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, date, sortBy, sortOrder, page, limit } = req.query;

  const result = taskService.getAllTasks({
    search,
    status,
    priority,
    date,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  res.status(200).json({
    success: true,
    data: {
      tasks: result.tasks,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    },
  });
});

/**
 * GET /api/tasks/stats
 */
const getTaskStats = asyncHandler(async (req, res) => {
  const stats = taskService.getTaskStats();
  res.status(200).json({ success: true, data: stats });
});

/**
 * GET /api/tasks/:id
 */
const getTaskById = asyncHandler(async (req, res) => {
  const task = taskService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  res.status(200).json({ success: true, data: task });
});

/**
 * POST /api/tasks
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const task = taskService.createTask({ title, description, status, priority, dueDate });
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
});

/**
 * PUT /api/tasks/:id
 */
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const task = taskService.updateTask(req.params.id, {
    title,
    description,
    status,
    priority,
    dueDate,
  });

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

/**
 * DELETE /api/tasks/:id
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = taskService.deleteTask(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: task,
  });
});

module.exports = {
  getAllTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
