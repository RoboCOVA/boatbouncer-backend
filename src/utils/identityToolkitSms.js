import httpStatus from 'http-status';
import { identityToolkit } from '../config/googleApis';
import APIError from '../errors/APIError';
import { logIdentityToolkitSmsError } from './logIdentityToolkitSmsError';

/**
 * Identity Toolkit reports caller-side faults — a stale or malformed reCAPTCHA
 * token, an unusable phone number, too many attempts — as failures of our own
 * request. Unmapped they reach the error handler as a generic 500, which tells
 * the client the server broke when the fix is actually in their hands.
 *
 * Codes not listed here (INVALID_APP_CREDENTIAL and friends) really are our
 * misconfiguration and are deliberately left to surface as 500s.
 */
const clientErrors = {
  CAPTCHA_CHECK_FAILED: {
    status: httpStatus.BAD_REQUEST,
    message: 'reCAPTCHA verification failed. Please try again.',
  },
  MISSING_RECAPTCHA_TOKEN: {
    status: httpStatus.BAD_REQUEST,
    message: 'A reCAPTCHA token is required.',
  },
  INVALID_RECAPTCHA_TOKEN: {
    status: httpStatus.BAD_REQUEST,
    message: 'reCAPTCHA verification failed. Please try again.',
  },
  INVALID_RECAPTCHA_ACTION: {
    status: httpStatus.BAD_REQUEST,
    message: 'reCAPTCHA verification failed. Please try again.',
  },
  MISSING_PHONE_NUMBER: {
    status: httpStatus.BAD_REQUEST,
    message: 'A phone number is required.',
  },
  INVALID_PHONE_NUMBER: {
    status: httpStatus.BAD_REQUEST,
    message: 'The phone number provided is not valid.',
  },
  TOO_MANY_ATTEMPTS_TRY_LATER: {
    status: httpStatus.TOO_MANY_REQUESTS,
    message: 'Too many attempts. Please try again later.',
  },
  QUOTA_EXCEEDED: {
    status: httpStatus.TOO_MANY_REQUESTS,
    message: 'Too many attempts. Please try again later.',
  },
  INVALID_CODE: {
    status: httpStatus.BAD_REQUEST,
    message: 'The verification code is incorrect.',
  },
  MISSING_CODE: {
    status: httpStatus.BAD_REQUEST,
    message: 'A verification code is required.',
  },
  SESSION_EXPIRED: {
    status: httpStatus.BAD_REQUEST,
    message: 'The verification code has expired. Please request a new one.',
  },
  INVALID_SESSION_INFO: {
    status: httpStatus.BAD_REQUEST,
    message:
      'This verification session is no longer valid. Please request a new code.',
  },
  MISSING_SESSION_INFO: {
    status: httpStatus.BAD_REQUEST,
    message:
      'This verification session is no longer valid. Please request a new code.',
  },
};

/**
 * Google returns messages shaped like
 * `CAPTCHA_CHECK_FAILED : Recaptcha verification failed - MALFORMED`,
 * so the machine-readable code is the part before the first colon.
 */
export const toSmsApiError = (error) => {
  if (error instanceof APIError) return error;

  const rawMessage = error?.response?.data?.error?.message || error?.message;
  if (!rawMessage) return error;

  const code = String(rawMessage).split(':')[0].trim();
  const mapped = clientErrors[code];

  if (!mapped) return error;

  return new APIError(mapped.message, mapped.status, true);
};

/**
 * Single entry point for phone verification SMS. Logs the full Google error
 * (redacted by `logIdentityToolkitSmsError`) before the details are discarded
 * by the mapping.
 */
export const sendVerificationCode = async (
  { phoneNumber, recaptchaToken },
  context = {}
) => {
  try {
    return await identityToolkit.relyingparty.sendVerificationCode({
      phoneNumber,
      recaptchaToken,
    });
  } catch (error) {
    logIdentityToolkitSmsError(error, {
      phoneNumber,
      recaptchaToken,
      ...context,
    });
    throw toSmsApiError(error);
  }
};

/**
 * Counterpart to `sendVerificationCode`: checks a code against the session
 * Identity Toolkit issued when the SMS was sent.
 *
 * This MUST be awaited by callers. A wrong, expired or replayed code is
 * reported as a rejected promise, never as a falsy return value, so dropping
 * the await silently turns every failed check into a pass.
 */
export const verifyPhoneCode = async ({ code, sessionInfo }, context = {}) => {
  try {
    const response = await identityToolkit.relyingparty.verifyPhoneNumber({
      code,
      sessionInfo,
    });

    // Identity Toolkit answers a successful check with the identity it just
    // verified. No body means we cannot attest to anything, so refuse rather
    // than treat a 200 as proof.
    if (!response?.data) {
      throw new APIError(
        'Phone verification failed. Please request a new code.',
        httpStatus.BAD_REQUEST,
        true
      );
    }

    return response;
  } catch (error) {
    logIdentityToolkitSmsError(error, {
      tag: 'identitytoolkit.verifyPhoneNumber',
      ...context,
    });
    throw toSmsApiError(error);
  }
};

export default sendVerificationCode;
