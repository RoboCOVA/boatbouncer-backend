import mongoose, { Schema, Types } from 'mongoose';
import {
  boatActivityTypeEnum,
  boatFeaturesEnum,
  boatListingTypeEnum,
  boatStatusEnum,
  boatTypeEnum,
  currencyCodeEnum,
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

const cancelationSchema = {
  refund: { type: Number },
  priorHours: { type: Number },
  _id: false,
};
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
  currency: { type: String, enum: currencyCodeEnum, default: 'USD' },
  listingType: { type: String, enum: boatListingTypeEnum, default: 'rental' },
  securityAllowance: { type: String, required: true },
  cancelationPolicy: { type: [cancelationSchema] },
  avgResponseTime: { type: Number, default: 0 },
};

const activityBoatFields = {
  activityTypes: {
    type: [
      {
        type: {
          type: String,
          enum: boatActivityTypeEnum,
          required: true,
        },
        durationHours: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    required: false,
    default: undefined,
    _id: false,
  },
};
const combinedPricingSchema = new Schema(
  {
    // Common fields
    perPerson: { type: Number }, // For activity boat
    perDay: { type: Number }, // For rental boat
    perHour: { type: Number }, // For rental boat

    discountPercentage: {
      type: [
        {
          percentage: { type: Number, required: true },
          minPeople: { type: Number, required: true },
        },
      ],
      default: undefined,
    },

    // Rental-specific discounts
    dayDiscount: {
      type: [
        {
          discountPercentage: { type: Number, required: true },
          minDaysForDiscount: { type: Number, required: true },
        },
      ],
      default: undefined,
    },

    hourDiscount: {
      type: [
        {
          discountPercentage: { type: Number, required: true },
          minHoursForDiscount: { type: Number, required: true },
        },
      ],
      default: undefined,
    },

    minHours: { type: Number, default: undefined, required: false },
    minDays: { type: Number, default: undefined, required: false },
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
  length: { type: Number, default: 10 },
  manufacturer: { type: String },
  model: { type: String },
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
    pricing: {
      type: combinedPricingSchema,
      required: false,
    },
  },
  { timestamps: true }
);

boatSchema.index({ latLng: '2dsphere' });

export default boatSchema;
