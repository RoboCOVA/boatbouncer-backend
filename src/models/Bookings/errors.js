import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

/** @ERRORS */
export const boatNotFound = new APIError(
  'Boat Not Found',
  httpStatus.NOT_FOUND
);

export const reservationUpdateFailed = new APIError(
  'Booking Update Operation Failed',
  httpStatus.BAD_REQUEST
);

export const reservationNotFound = new APIError(
  'Reservation Not Found',
  httpStatus.NOT_FOUND
);

export const authorizationError = new APIError(
  'User not authorized to perform this action!',
  httpStatus.UNAUTHORIZED
);

export const statusChangeError = new APIError(
  'Cannot cancell booking at this stage',
  httpStatus.BAD_REQUEST
);

export const offerNotFound = new APIError(
  'Offer Not Found',
  httpStatus.NOT_FOUND
);

export const offerCancelFailed = new APIError(
  'Offer Cancellation Failed!',
  httpStatus.BAD_REQUEST
);

export const invalidOperaton = new APIError(
  'Boat owner can not own his/her own boat',
  httpStatus.BAD_REQUEST
);

export const invalidDateRange = new APIError(
  'Date Range is Invalid!',
  httpStatus.BAD_REQUEST
);
