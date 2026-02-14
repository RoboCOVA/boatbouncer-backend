import passport from 'passport';

// eslint-disable-next-line import/prefer-default-export
export const authenticateJwtOptional = (req, res, next) => {
  // console.log({ headers: req.headers });
  if (req.headers && !req.headers.authorization) {
    return next();
  }

  return passport.authenticate('jwt', { session: false }, (error, user) => {
    try {
      if (error || !user) {
        // console.log({ user, error });
        return next();
      }
      req.user = user.clean();
      return next();
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
};
