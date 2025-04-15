import { Schema, Types } from 'mongoose';
import { modelNames } from '../constants';

const conversationSchema = new Schema(
  {
    members: [{ type: Types.ObjectId, ref: modelNames.USERS, required: true }],
  },
  { timestamps: true }
);

export default conversationSchema;
