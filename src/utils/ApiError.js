// A custom error class for handling API errors in a consistent way
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong", // Default error message
    errors = [],                      // Array of detailed error messages (e.g., validation errors)
    stack = ""                        // Optional stack trace
  ) {
    super(message);                   // Call parent Error constructor
    this.statusCode = statusCode;    // HTTP status code (e.g., 400, 404, 500)
    this.data = null;                // Optional data field (usually null in errors)
    this.message = message;          // Human-readable error message
    this.success = false;            // Always false for errors
    this.errors = errors;            // Array of additional error details

    // Capture custom or default stack trace for debugging
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

/*
  Purpose:
  - This class provides a standardized way to throw errors in your application.
  - Useful for throwing application-specific errors with proper HTTP status codes and messages.
  - Helps in centralized error handling middleware (like Express error handler).

  Example usage:
    throw new ApiError(404, "User not found");

  This ensures that all errors thrown in the app have a consistent shape and are easy to handle/log.
*/
