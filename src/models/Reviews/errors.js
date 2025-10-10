import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

/** @ERRORS */
export const reviewNotFound = new APIError(
  'Review Not Found',
  httpStatus.NOT_FOUND
);

export const reviewAlreadyExists = new APIError(
  'Review already exists for this booking',
  httpStatus.CONFLICT
);

export const bookingNotFound = new APIError(
  'Booking not found',
  httpStatus.NOT_FOUND
);

export const userNotAuthorized = new APIError(
  'User not authorized to review this booking',
  httpStatus.FORBIDDEN
);

export const bookingNotCompleted = new APIError(
  'Cannot review a booking that is not completed',
  httpStatus.BAD_REQUEST
);

export const reviewCreateFailed = new APIError(
  'Review creation failed',
  httpStatus.BAD_REQUEST
);

export const reviewUpdateFailed = new APIError(
  'Review update failed',
  httpStatus.BAD_REQUEST
);

export const reviewDeleteFailed = new APIError(
  'Review delete failed',
  httpStatus.BAD_REQUEST
);
