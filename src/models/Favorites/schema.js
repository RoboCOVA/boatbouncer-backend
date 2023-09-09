import mongoose, { Types } from 'mongoose';
import { modelNames } from '../constants';

const favoritesSchema = new mongoose.Schema(
  {
    user: { type: Types.ObjectId, ref: modelNames.USERS, required: true },
    boat: { type: Types.ObjectId, ref: modelNames.BOATS, required: true },
  },
  { timestamps: true }
);

export default favoritesSchema;
