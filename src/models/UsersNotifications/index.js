import mongoose from 'mongoose';
import * as statics from './statics';
import * as methods from './methods';
import usersnotificationSchema from './schema';
import { modelNames } from '../constants';

usersnotificationSchema.method(methods);
usersnotificationSchema.static(statics);

const Notifications =
  mongoose?.models?.[modelNames.USERS_NOTIFICATIONS] ||
  mongoose.model(modelNames.USERS_NOTIFICATIONS, usersnotificationSchema);

export default Notifications;
