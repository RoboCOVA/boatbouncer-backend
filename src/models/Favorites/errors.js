import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

/** @ERRORS */
export const favoriteNotFound = new APIError(
  'Favorite Not Found',
  httpStatus.NOT_FOUND
);
