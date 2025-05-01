import facebookStrategy from './facebookStrategy';
import googleStrategy from './googleStrategy';
import jwtStrategy from './jwtStrategy';
import localStrategy from './localStrategy';

const initiatePassport = (passport) => {
  passport.use(localStrategy);
  passport.use(jwtStrategy);
  passport.use(googleStrategy);
  passport.use(facebookStrategy);
};

export default initiatePassport;
