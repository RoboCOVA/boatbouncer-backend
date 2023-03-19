import httpStatus from 'http-status';
import { Strategy, ExtractJwt } from 'passport-jwt';
import APIError from '../../errors/APIError';
import { jwtKey } from '../environments';
import Users from '../../models/Users';

const strategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtKey,
  },
  async (payload, done) => {
    try {
      const user = await Users.findOne({ _id: payload._id });

      if (!user) {
        const NotFound = new APIError(
          'User not found',
          httpStatus.NOT_FOUND,
          true
        );

        return done(NotFound, false);
      }

      return done(false, user);
    } catch (error) {
      return done(error, null);
    }
  }
);

export default strategy;
