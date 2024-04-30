import { Schema } from 'mongoose';
import { modelNames, modelNamesEnum } from '../constants';
import { notificationActionTypesEnum } from './constants';

const notificationSchema = new Schema(
  {
    title: { type: String, required: true },
    content: {
      type: String,
      required: true,
    },
    actionType: {
      type: String,
      enum: notificationActionTypesEnum,
    },
    modelType: {
      type: String,
      enum: modelNamesEnum,
      required: true,
    },
    model: {
      type: Schema.Types.Mixed,
      refPath: 'modelType',
      required: true,
    },
    userType: {
      type: String,
      enum: [modelNames.USERS],
      required: true,
    },
    parentId: { type: Schema.Types.Mixed },
    seenBy: [{ type: Schema.Types.Mixed, refPath: 'userType' }],
    clickedBy: [{ type: Schema.Types.Mixed, refPath: 'userType' }],
    createdBy: { type: Schema.Types.Mixed, refPath: 'userType' },
  },

  { timestamps: true }
);

export default notificationSchema;
