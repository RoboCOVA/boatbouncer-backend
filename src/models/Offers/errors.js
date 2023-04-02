import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

/** @ERRORS */
export const offerNotFound = new APIError(
  'Offer Not Found',
  httpStatus.NOT_FOUND
);

export const offerUpdateFailed = new APIError(
  'Offer Update Operation Failed',
  httpStatus.BAD_REQUEST
);

export const invalidStatus = new APIError(
  'Can not create an Offer for Reservation which is not in PENDING status'
);

export const invalidReservatoinStatus = new APIError(
  'Can not update an Offer for Reservation which is not in PENDING status'
);

export const stripeCustomerCreationFailed = new APIError(
  'Stripe Customer Creation failed',
  httpStatus.INTERNAL_SERVER_ERROR
);

export const userUpdateFailed = new APIError(
  'User Update operation failed!',
  httpStatus.NOT_FOUND,
  true
);
