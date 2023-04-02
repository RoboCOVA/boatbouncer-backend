import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    verified: { type: Boolean, required: true },
    session: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    stripeCustomerId: { type: String },
  },
  { timestamps: true }
);

export default userSchema;
