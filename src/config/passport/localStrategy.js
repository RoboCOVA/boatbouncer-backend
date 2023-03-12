import passportLocal from 'passport-local';

const strategy = new passportLocal.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true, // to use req
  },
  async (req, email, password, done) => {
    try {
      // Excute some operation
      return done(false, {});
    } catch (error) {
      return done(error, null);
    }
  }
);

export default strategy;
