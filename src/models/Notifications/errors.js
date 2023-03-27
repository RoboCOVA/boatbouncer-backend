import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

export const clickUpdateFailed = new APIError(
  'Clicked Update Failed',
  httpStatus.BAD_REQUEST
);
