import { Schema, Types } from 'mongoose';
import { modelNames } from '../constants';

const usersnotificationSchema = new Schema(
  {
    onModel: {
      type: String,
      enum: [modelNames.USERS],
      required: true,
    },
    user: { type: Types.ObjectId, refPath: 'onModel' },
    notifications: [{ type: Types.ObjectId, ref: modelNames.NOTIFICATIONS }],
  },

  { timestamps: true }
);

export default usersnotificationSchema;
