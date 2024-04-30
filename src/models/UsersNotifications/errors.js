import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

export const updateFailed = new APIError(
  'User notification update failed',
  httpStatus.BAD_GATEWAY
);

export const notFound = new APIError(
  'User notification not found',
  httpStatus.NOT_FOUND
);
