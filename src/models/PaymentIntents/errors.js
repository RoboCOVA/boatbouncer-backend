import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

/** @ERRORS */
export const intentNotFound = new APIError(
  'Payment Intent Not Found!',
  httpStatus.NOT_FOUND,
  true
);

export const methodExpired = new APIError(
  'Payment Method has Expired!',
  httpStatus.NOT_FOUND,
  true
);

export const userCardExpired = new APIError(
  'The card has expired. Please use a different card.',
  httpStatus.BAD_REQUEST
);

export const intentAlreadyCreated = new APIError(
  'Pending Payment Intent Found!',
  httpStatus.BAD_REQUEST,
  true
);

export const confirmationFailed = new APIError(
  'Confirmation Failed',
  httpStatus.BAD_REQUEST
);

export const ownerNotFound = new APIError(
  'Owner Not Found!',
  httpStatus.NOT_FOUND,
  true
);

export const intentCanceled = new APIError(
  'Payment Intent is already canceled',
  httpStatus.BAD_REQUEST
);

export const settingDocNotFound = new APIError(
  'Setting not found',
  httpStatus.NOT_FOUND
);
