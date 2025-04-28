import googleStrategy from './googleStrategy';
import jwtStrategy from './jwtStrategy';
import localStrategy from './localStrategy';

const initiatePassport = (passport) => {
  passport.use(localStrategy);
  passport.use(jwtStrategy);
  passport.use(googleStrategy);
};

export default initiatePassport;
