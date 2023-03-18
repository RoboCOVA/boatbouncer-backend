import { Schema, Types } from 'mongoose';
import { modelNames } from '../constants';

const tempUploadsSchema = new Schema(
  {
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    assetId: { type: String, required: true },
    originalName: { type: String, required: true },
    publicId: { type: String, required: true },
    etag: { type: String, required: true },
    uploadedBy: {
      type: Types.ObjectId,
      ref: modelNames.USERS,
    },
    contentType: { type: String },
    fileExtension: { type: String },
  },
  { timestamps: true }
);

export default tempUploadsSchema;
