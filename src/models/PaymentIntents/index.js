import mongoose from 'mongoose';
import paymentIntentSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

paymentIntentSchema.static(staticFunctions);
paymentIntentSchema.method(methodFunctions);

const Users =
  mongoose?.models?.[modelNames.PAYMENT_INTENTS] ||
  mongoose.model(modelNames.PAYMENT_INTENTS, paymentIntentSchema);

export default Users;
