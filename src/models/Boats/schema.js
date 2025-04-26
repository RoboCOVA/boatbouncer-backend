import mongoose, { Schema, Types } from 'mongoose';
import {
  boatActivityTypeEnum,
  boatFeaturesEnum,
  boatListingTypeEnum,
  boatStatusEnum,
  boatTypeEnum,
} from '../../utils/constants';

const latLngSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

const locationSchema = new Schema(
  {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  { _id: false }
);

const baseBoatFieldsSchema = {
  boatName: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String },
  location: locationSchema,
  maxPassengers: { type: Number },
  imageUrls: [{ type: String }],
  owner: { type: Types.ObjectId, ref: 'User', required: true },
  latLng: latLngSchema,
  searchable: { type: Boolean, default: false },
  status: { type: String, enum: boatStatusEnum },
  listingType: { type: String, enum: boatListingTypeEnum, default: 'rental' },
};

const activityPricingSchema = new Schema(
  {
    perPerson: { type: Number, required: true },
    discountPercentage: {
      type: [
        {
          percentage: { type: Number, required: true },
          minPeople: { type: Number, required: true },
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

const activityBoatFields = {
  activityType: {
    type: String,
    enum: boatActivityTypeEnum,
    required: false,
  },
  pricing: { type: activityPricingSchema, required: false },
};

const rentalPricingSchema = new Schema(
  {
    perDay: { type: Number },
    dayDiscount: [
      {
        discountPercentage: { type: Number, required: true },
        minDaysForDiscount: { type: Number, required: true },
      },
    ],
    minDays: { type: Number, default: 0 },

    perHour: { type: Number },
    hourDiscount: [
      {
        discountPercentage: { type: Number, required: true },
        minHoursForDiscount: { type: Number, required: true },
      },
    ],
    minHours: { type: Number, default: 1 },
  },
  { _id: false }
);

const rentalBoatFields = {
  agreementInfo: { type: String },
  boatType: {
    type: String,
    enum: boatTypeEnum,
    required: false,
  },
  year: { type: Number },
  manufacturer: { type: String },
  model: { type: String },
  pricing: { type: rentalPricingSchema, required: false },
  features: {
    type: [String],
    enum: boatFeaturesEnum,
    default: [],
  },
};
const boatSchema = new mongoose.Schema(
  {
    ...baseBoatFieldsSchema,
    ...activityBoatFields,
    ...rentalBoatFields,
  },
  { timestamps: true }
);

boatSchema.index({ latLng: '2dsphere' });

export default boatSchema;
