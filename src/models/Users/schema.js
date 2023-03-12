import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  { timestamps: true }
);

export default userSchema;
