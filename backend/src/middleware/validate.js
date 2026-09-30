const { body, validationResult } = require('express-validator');

/**
 * Validation rules for creating / updating a task.
 */
const validateTask = [
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must be between 1 and 2000 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage("Status must be one of: 'pending', 'in_progress', 'completed'")
    .default('pending'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage("Priority must be one of: 'low', 'medium', 'high'")
    .default('medium'),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('dueDate must be a valid ISO 8601 date string')
    .toDate(),
];

/**
 * Middleware that reads express-validator results and short-circuits with
 * a 422 response when any rule failed.
 */
const handleValidationErrors = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const formattedErrors = result.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    const error = new Error('Validation failed');
    error.errors = formattedErrors;
    return next(error);
  }
  next();
};

module.exports = { validateTask, handleValidationErrors };
