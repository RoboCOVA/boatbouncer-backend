import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

/** @ERRORS */
export const userNotFound = new APIError(
  'User not found!',
  httpStatus.NOT_FOUND,
  true
);
export const userAlreadyVerified = new APIError(
  'User is already verified!',
  httpStatus.NOT_FOUND,
  true
);
export const updateFailed = new APIError(
  'Update operation failed!',
  httpStatus.NOT_FOUND,
  true
);
export const emailAlreadyUsed = new APIError(
  'Email is already used.!',
  httpStatus.CONFLICT,
  true
);
export const phoneNumberAlreadyUsed = new APIError(
  'Email is already used.!',
  httpStatus.CONFLICT,
  true
);

export const passwordDontMatch = new APIError(
  'Password dont match.!',
  httpStatus.CONFLICT,
  true
);

export const doesntMatchError = new APIError(
  "Email or Password doesn't match",
  httpStatus.UNAUTHORIZED,
  true
);
