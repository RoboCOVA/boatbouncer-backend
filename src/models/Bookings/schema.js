import mongoose, { Types } from 'mongoose';
import {
  boatActivityTypeEnum,
  bookingStatusEnum,
  pricingTypeEnum,
} from '../../utils/constants';
import { modelNames } from '../constants';
import Notifications from '../Notifications';
import { notificationActionTypes } from '../Notifications/constants';

const durationSchema = {
  start: { type: Date, required: true },
  end: { type: Date, required: true },
};

const bookingSchema = new mongoose.Schema(
  {
    boatId: { type: Types.ObjectId, ref: modelNames.BOATS, required: true },
    type: { type: String, enum: pricingTypeEnum, required: true },
    duration: durationSchema,
    renter: { type: Types.ObjectId, ref: modelNames.USERS, required: true },
    owner: { type: Types.ObjectId, ref: modelNames.USERS, required: true },
    offerId: { type: Types.ObjectId, ref: modelNames.OFFERS },
    status: { type: String, enum: bookingStatusEnum },
    conversationId: {
      type: Types.ObjectId,
      ref: modelNames.CONVERSATIONS,
      required: true,
    },
    // captainPrice: { type: Number, min: 0 },
    renterPrice: { type: Number, min: 1 },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    specialPricingId: {
      type: Types.ObjectId,
      ref: modelNames.SPECIAL_PRICING,
      required: false,
      default: null,
    },
    specialPricingApplied: {
      type: Boolean,
      default: false,
    },
    activityType: {
      type: String,
      enum: boatActivityTypeEnum,
      required: false,
      default: undefined,
    },
    hours: {
      type: Number,
      min: 0,
      required: false,
      default: undefined,
    },
    days: {
      type: Number,
      min: 0,
      required: false,
      default: undefined,
    },
    noPeople: {
      type: Number,
      min: 1,
      required: false,
      default: undefined,
    },
  },
  { timestamps: true }
);

bookingSchema.post('save', async function callback(doc) {
  await doc.populate('boatId');

  const notification = new Notifications({
    title: 'Booking Information',
    content: 'Booking Information',
    modelType: modelNames.BOOKINGS,
    userType: modelNames.USERS,
    createdBy: doc.renter,
    actionType: notificationActionTypes.READ,
    model: doc._id,
  });

  await notification.createNotification({
    userIds: [doc?.renter, doc?.boatId?.owner],
  });
});

export default bookingSchema;
