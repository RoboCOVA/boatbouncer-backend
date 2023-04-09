import mongoose from 'mongoose';
import { modelNames } from '../constants';

const adminSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    super: { type: Boolean },
    users: { type: mongoose.Types.ObjectId, ref: modelNames.USERS },
  },
  { timestamps: true }
);

export default adminSchema;
