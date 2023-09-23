import mongoose from 'mongoose';
import { modelNames } from '../constants';

const otpSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  numberOfTrials: { type: Number, required: true },
  lastSMSTime: { type: Date },
  authOnProgress: { type: Boolean, default: true },
});

export default otpSchema;
