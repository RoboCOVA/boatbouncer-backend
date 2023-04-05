import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

/** @ERRORS */
export const methodNotFound = new APIError(
  'Payment Method Not Found!',
  httpStatus.NOT_FOUND,
  true
);
