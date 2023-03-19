import { Schema, Types } from 'mongoose';
import { modelNames } from '../constants';

const messageSchema = new Schema(
  {
    conversation: {
      type: Types.ObjectId,
      ref: modelNames.CONVERSATIONS,
      required: true,
    },
    sender: { type: Types.ObjectId, ref: modelNames.USERS, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default messageSchema;
