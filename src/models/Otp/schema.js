import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  numberOfTrials: { type: Number, required: true },
  lastSMSTime: { type: Date },
  authOnProgress: { type: Boolean, default: true },
});

export default otpSchema;
