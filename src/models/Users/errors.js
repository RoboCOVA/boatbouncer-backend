import httpStatus from 'http-status';
import APIError from '../../errors/APIError';
import { errorCodes } from '../../errors/codes';

/** @ERRORS */
export const userNotFound = new APIError(
  'User not found!',
  httpStatus.NOT_FOUND,
  true
);
export const AuthProviderError = (provider) =>
  new APIError(
    `Current auth provider does not include Local,email login not activated use one of ${provider.join(
      ','
    )} , `,
    httpStatus.UNAUTHORIZED,
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
export const deleteFailed = new APIError(
  'Delete operation failed!',
  httpStatus.NOT_FOUND,
  true
);

export const userHasPeningBookings = new APIError(
  'User has pendig bookings',
  httpStatus.NOT_FOUND,
  true
);

export const stripeUpdateFailed = new APIError(
  'Failed to create stripe customer Id!',
  httpStatus.INTERNAL_SERVER_ERROR,
  true
);

export const emailAlreadyUsed = new APIError(
  'Email is already used.!',
  httpStatus.CONFLICT,
  true
);
export const phoneNumberAlreadyUsed = new APIError(
  'Phone number is already used.!',
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

export const existingStripCustomerNotFound = new APIError(
  'Existing stripe customer not found!',
  httpStatus.NOT_FOUND
);

export const StripAccIdNotFound = new APIError(
  'Stripe account ID not found!',
  httpStatus.NOT_FOUND
);

export const chargeEnableUpdateFailed = new APIError(
  'Charges Enabled Update operation failed!',
  httpStatus.BAD_REQUEST,
  true
);

export const userNotVerified = new APIError(
  'User not verified',
  httpStatus.BAD_REQUEST,
  true,
  errorCodes.USER_NOT_VERIFIED
);

/**
 * Login-specific counterpart. Credentials were correct but the account has not
 * completed phone verification, so no token is issued — the client should send
 * the user into the OTP flow rather than treat this as a failed sign-in.
 */
export const userNotVerifiedLogin = new APIError(
  'Please verify your phone number to continue',
  httpStatus.FORBIDDEN,
  true,
  errorCodes.USER_NOT_VERIFIED
);

export const passwordResetSessionExp = new APIError(
  'Password reset session expired!',
  httpStatus.BAD_REQUEST,
  true
);
