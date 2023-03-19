import httpStatus from 'http-status';
import passport from 'passport';
import APIError from '../errors/APIError';

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
