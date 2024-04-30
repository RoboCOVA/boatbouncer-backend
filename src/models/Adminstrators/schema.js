import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    super: { type: Boolean },
  },
  { timestamps: true }
);

export default adminSchema;
