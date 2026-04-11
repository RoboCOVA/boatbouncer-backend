import winstonLogger from '../config/winston';

/**
 * Safe fields for debugging Identity Toolkit phone SMS (e.g. error code 39, CAPTCHA, INVALID_APP_CREDENTIAL).
 * Does not log secrets: no full phone, no recaptcha token, no URLs (may contain API key).
 */
export function logIdentityToolkitSmsError(error, context = {}) {
  const { phoneNumber, recaptchaToken } = context;
  const res = error.response;
  const data = res?.data;
  const googleErr = data?.error;

  const payload = {
    tag: 'identitytoolkit.sendVerificationCode',
    errName: error.name,
    errMessage: error.message,
    gaxiosCode: error.code,
    httpStatus: res?.status,
    googleErrorMessage: googleErr?.message,
    googleErrorCode: googleErr?.code,
    googleErrorStatus: googleErr?.status,
    googleErrorDetails: googleErr?.details,
    googleErrorsArray: googleErr?.errors ?? error.errors,
    clientIp: context.reqIp,
    phoneLast4:
      phoneNumber && String(phoneNumber).length >= 4
        ? String(phoneNumber).slice(-4)
        : undefined,
    recaptchaTokenLength: recaptchaToken ? String(recaptchaToken).length : 0,
  };

  winstonLogger.error(JSON.stringify(payload));
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error('[sendVerificationCode]', payload);
  }
}
