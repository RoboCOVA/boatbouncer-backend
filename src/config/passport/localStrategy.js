import passportLocal from 'passport-local';
import Users from '../../models/Users';

const strategy = new passportLocal.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true, // to use req
  },
  async (req, email, password, done) => {
    try {
      // Excute some operation
      const authUser = await Users.authenticateUser(email, password);
      return done(false, authUser);
    } catch (error) {
      return done(error, null);
    }
  }
);

export default strategy;
