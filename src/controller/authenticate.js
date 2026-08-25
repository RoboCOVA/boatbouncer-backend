import httpStatus from 'http-status';
import passport from 'passport';
import APIError from '../errors/APIError';

export const authenticateJwt = (req, res, next) => {
  if (req.headers && !req.headers.authorization) {
    const missingTokenError = new APIError(
      'Provide credential',
      httpStatus.UNAUTHORIZED
    );
    return next(missingTokenError);
  }

  return passport.authenticate(
    'jwt',
    { session: false },
    (error, user, message) => {
      try {
        if (error || !user) {
          const theError =
            error instanceof APIError
              ? error
              : new APIError(message, httpStatus.UNAUTHORIZED);
          return next(theError);
        }
        req.user = user.clean();
        return next();
      } catch (err) {
        return next(err);
      }
    }
  )(req, res, next);
};

/**
 * For routes that are public but render differently for a signed-in caller —
 * the boat listing needs the viewer's id to resolve `isFavorite`, yet must keep
 * working for anonymous visitors.
 *
 * A missing or invalid token is not an error here: the request continues with
 * `req.user` unset. Only routes that genuinely require a session should use
 * `authenticateJwt`.
 */
export const optionalAuthenticateJwt = (req, res, next) => {
  if (!req.headers?.authorization) return next();

  return passport.authenticate('jwt', { session: false }, (error, user) => {
    if (!error && user) req.user = user.clean();
    return next();
  })(req, res, next);
};
