import httpStatus from 'http-status';
import AppError from './APPError';
/**
 * @extends AppError
 */

class APIError extends AppError {
  constructor(
    message,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
    code = undefined
  ) {
    super(message, status, isPublic, code);
  }
}

export default APIError;
