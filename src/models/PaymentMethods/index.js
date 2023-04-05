import mongoose from 'mongoose';
import paymentMethodSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

paymentMethodSchema.static(staticFunctions);
paymentMethodSchema.method(methodFunctions);

const Users = mongoose.model(modelNames.PAYMENT_METHODS, paymentMethodSchema);

export default Users;
