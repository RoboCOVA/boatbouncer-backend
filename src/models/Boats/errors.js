import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

/** @ERRORS */
export const boatNotFound = new APIError(
  'Boat Not Found',
  httpStatus.NOT_FOUND
);

export const boatDeleteFailed = new APIError(
  'Boat Delete Operation Failed',
  httpStatus.BAD_REQUEST
);

export const boatUpdateFailed = new APIError(
  'Boat Update Operation Failed',
  httpStatus.BAD_REQUEST
);
