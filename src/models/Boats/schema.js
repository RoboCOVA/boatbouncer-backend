import mongoose, { Types } from 'mongoose';
import { boatFeaturesEnum, pricingTypeEnum } from '../../utils/constants';
import { categoriesEnum, modelNames, subCategoriesEnum } from '../constants';

const locationSchema = {
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
};

const pricingSchema = {
  type: { type: String, enum: pricingTypeEnum },
  min: { type: Number },
  value: { type: Number },
};

const boatSchema = new mongoose.Schema(
  {
    boatName: { type: String, required: true },
    boatType: { type: String, required: true }, // should be an enum
    description: { type: String, required: true },
    manufacturer: { type: String },
    model: { type: String },
    year: { type: Number },
    length: { type: Number }, // measurment
    amenities: [{ type: String }],
    imageUrls: [{ type: String }],
    owner: { type: Types.ObjectId, ref: modelNames.USERS, required: true },
    location: locationSchema,
    latLng: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
    },
    category: [{ type: String, enum: categoriesEnum }],
    subCategory: [{ type: String, enum: subCategoriesEnum }],
    currency: { type: String },
    features: [{ type: String, enum: boatFeaturesEnum }],
    pricing: [pricingSchema],
    securityAllowance: { type: String, required: true },
    captained: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default boatSchema;
