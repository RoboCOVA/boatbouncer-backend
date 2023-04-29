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
  'Can not create an Offer for Reservation which is not in PENDING status',
  httpStatus.BAD_REQUEST
);

export const invalidReservatoinStatus = new APIError(
  'Can not update an Offer for Reservation which is not in PENDING status',
  httpStatus.BAD_REQUEST
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

export const invalidOfferStatus = new APIError(
  'Invalid Offer Status status',
  httpStatus.BAD_REQUEST
);

export const bookOwnerNotFoundStatus = new APIError(
  'Boat owner not found',
  httpStatus.BAD_REQUEST
);

export const invalidAccess = new APIError(
  'Only owner can create an offer',
  httpStatus.BAD_REQUEST
);

export const offerDuplication = new APIError(
  'Offer Is Already Created',
  httpStatus.BAD_REQUEST
);
