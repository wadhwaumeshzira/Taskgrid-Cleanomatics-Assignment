const { Router } = require('express');
const {
  getAllTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const { validateTask, handleValidationErrors } = require('../middleware/validate');

const router = Router();

// GET  /api/tasks          – list with filtering, sorting & pagination
router.get('/', getAllTasks);

// GET  /api/tasks/stats    – aggregate statistics (must come before /:id)
router.get('/stats', getTaskStats);

// GET  /api/tasks/:id      – single task
router.get('/:id', getTaskById);

// POST /api/tasks          – create a task
router.post('/', validateTask, handleValidationErrors, createTask);

// PUT  /api/tasks/:id      – replace/update a task
router.put('/:id', validateTask, handleValidationErrors, updateTask);

// DELETE /api/tasks/:id    – remove a task
router.delete('/:id', deleteTask);

module.exports = router;
