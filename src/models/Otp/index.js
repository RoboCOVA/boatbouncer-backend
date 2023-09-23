import mongoose from 'mongoose';
import otpSchema from './schema';
import * as methodFunction from './method';
// eslint-disable-next-line import/no-cycle
import * as staticFunctions from './static';
import { modelNames } from '../constants';

otpSchema.static(staticFunctions);
otpSchema.method(methodFunction);

const otpVerification = mongoose.model(modelNames.OTP, otpSchema);

export default otpVerification;
