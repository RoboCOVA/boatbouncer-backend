import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

export const specialPricingNotFound = new APIError(
  'Special Pricing Not Found',
  httpStatus.NOT_FOUND
);
export const boatOwnershipError = new APIError(
  'Special Pricing Not Found',
  httpStatus.FORBIDDEN
);

export const specialPricingNameUsed = new APIError(
  'Special Pricing title already used for this boat',
  httpStatus.CONFLICT
);

export const specialPricingDeleteFailed = new APIError(
  'Special Pricing Delete Operation Failed',
  httpStatus.BAD_REQUEST
);

export const specialPricingUpdateFailed = new APIError(
  'Special Pricing Update Operation Failed',
  httpStatus.BAD_REQUEST
);

export const specialPricingOverlap = new APIError(
  'Special Pricing dates overlap with existing pricing',
  httpStatus.CONFLICT
);

export const specialPricingCannotUpdate = new APIError(
  'Cannot update special pricing that has been used or has expired',
  httpStatus.BAD_REQUEST
);

export const specialPricingCannotDelete = new APIError(
  'Cannot delete special pricing that has been used',
  httpStatus.BAD_REQUEST
);

export const specialPricingInvalidDates = new APIError(
  'Start date must be before end date',
  httpStatus.BAD_REQUEST
);

export const specialPricingPastDate = new APIError(
  'Cannot create special pricing for past dates',
  httpStatus.BAD_REQUEST
);
