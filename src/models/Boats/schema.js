import mongoose, { Types } from 'mongoose';
import { modelNames } from '../constants';

const locationSchema = {
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zip_code: { type: String },
};

const boatSchema = new mongoose.Schema(
  {
    boat_name: { type: String, required: true },
    boat_type: { type: String, required: true }, // should be an enum
    description: { type: String, required: true },
    manufacturer: { type: String },
    model: { type: String },
    year: { type: Number },
    length: { type: Number },
    amenities: [{ type: String }],
    image_urls: [{ type: String }],
    owner: { type: Types.ObjectId, ref: modelNames.USERS },
    location: locationSchema,
    latLng: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
    },
  },
  { timestamps: true }
);

export default boatSchema;
