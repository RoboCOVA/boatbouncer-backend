import AdminJSExpress from '@adminjs/express';
import bcrypt from 'bcrypt';
import { adminJs } from './config';
import Adminstrators from '../../models/Adminstrators';
import { cookieName, cookiePassword } from '../environments';

const adminRoute = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    cookieName,
    cookiePassword,
    authenticate: async (email, password) => {
      const user = await Adminstrators.findOne({ email });
      if (user) {
        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
          return user;
        }
      }
      return false;
    },
  },
  null,
  { resave: false, saveUninitialized: true }
);

export default adminRoute;
