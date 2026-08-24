/**
 * Centralized error handler. Never leaks database credentials, connection strings, or internal traces.
 */
export function errorHandler(err, req, res, next) {
  console.error('❌ [API Error]:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.isPublic ? err.message : 'An error occurred while processing your request.';

  res.status(statusCode).json({
    success: false,
    message,
  });
}

/**
 * 404 handler for undefined API routes.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
}
