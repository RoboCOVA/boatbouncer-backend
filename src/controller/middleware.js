import httpStatus from 'http-status';
import passport from 'passport';
import APIError from '../errors/APIError';

/**
 * It checks if the request has an authorization header, if it doesn't, it returns a 400 error, if it
 * does, it authenticates the request using the jwt strategy
 * @param req - The request object
 * @param res - The response object.
 * @param next - This is a callback function that will be called when the middleware is done.
 * @returns A function that takes in req, res, and next.
 */
// eslint-disable-next-line import/prefer-default-export
export const authenticateJwt = (req, res, next) => {
  if (req.headers && !req.headers.authorization) {
    const missingTokenError = new APIError(
      'Provide credential',
      httpStatus.BAD_REQUEST
    );
    return next(missingTokenError);
  }

  return passport.authenticate(
    'jwt',
    { session: false },
    (error, user, message) => {
      if (error || !user) {
        const theError =
          error instanceof APIError
            ? error
            : new APIError(message, httpStatus.UNAUTHORIZED);
        return next(theError);
      }

      req.user = user.clean();
      return next();
    }
  )(req, res, next);
};
