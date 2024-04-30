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
    profilePicture: { type: String, required: false },
    session: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    stripeCustomerId: { type: String },
    stripeAccountId: { type: String },
    chargesEnabled: { type: Boolean },
  },
  { timestamps: true }
);

export default userSchema;
