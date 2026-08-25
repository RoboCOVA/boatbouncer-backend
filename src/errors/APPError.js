/**
 * @extends Error
 */

class AppError extends Error {
  /**
   * @param {String} [code] Stable machine-readable identifier for clients that
   * need to branch on a specific failure rather than match on prose.
   */
  constructor(message, status, isPublic, code) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

export default AppError;
