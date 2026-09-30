/**
 * Centralized error handler middleware.
 * Handles validation errors, 404s, and generic server errors.
 */
const errorHandler = (err, req, res, next) => {
  // express-validator style errors (array on err.errors)
  if (err.errors && Array.isArray(err.errors)) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  // Explicit 404
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      message: err.message || 'Resource not found',
    });
  }

  // CORS error
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  // Generic server error
  const statusCode = err.status || err.statusCode || 500;
  console.error(`[ERROR] ${err.stack || err.message}`);
  return res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error',
  });
};

/**
 * 404 handler for routes that don't match any defined route.
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.method} ${req.originalUrl}' not found`,
  });
};

/**
 * Wraps an async route handler so thrown errors are forwarded to next().
 * @param {Function} fn - async express handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, notFoundHandler, asyncHandler };
