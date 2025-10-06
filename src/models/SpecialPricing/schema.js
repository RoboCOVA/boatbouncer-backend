import mongoose, { Types } from 'mongoose';
import { modelNames } from '../constants';
import { specialPricingTypeEnum } from '../../utils/constants';

const specialPricingSchema = new mongoose.Schema(
  {
    boatId: {
      type: Types.ObjectId,
      ref: modelNames.BOATS,
      required: true,
    },
    type: {
      type: String,
      enum: specialPricingTypeEnum,
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
      /*eslint-disable */
      required: function () {
        return !this.percent;
      },
      /*eslint-disable */
    },
    percent: {
      type: Number,
      min: 0,
      max: 100,
      /*eslint-disable */
      required: function () {
        return !this.amount;
      },
    },
    /*eslint-disable */
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    usedInBookings: [
      {
        type: Types.ObjectId,
        ref: modelNames.BOOKINGS,
      },
    ],
  },

  { timestamps: true }
);

specialPricingSchema.index({ boatId: 1 });
specialPricingSchema.index({ startDate: 1, endDate: 1 });

export default specialPricingSchema;
