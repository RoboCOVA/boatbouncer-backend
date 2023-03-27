import mongoose from 'mongoose';
import * as statics from './statics';
import * as methods from './methods';
import notificationSchema from './schema';
import { modelNames } from '../constants';

notificationSchema.method(methods);
notificationSchema.static(statics);

const Notifications = mongoose.model(
  modelNames.NOTIFICATIONS,
  notificationSchema
);

export default Notifications;
