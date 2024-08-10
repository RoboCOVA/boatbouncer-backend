import mongoose, { Types } from 'mongoose';
import { bookingStatusEnum, pricingType } from '../../utils/constants';
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
    type: { type: String, enum: [pricingType.PER_HOUR, pricingType.PER_DAY] },
    duration: durationSchema,
    renter: { type: Types.ObjectId, ref: modelNames.USERS, required: true },
    owner: { type: Types.ObjectId, ref: modelNames.USERS, required: true },
    renterPrice: { type: Number, min: 1 },
    captainPrice: { type: Number, min: 0 },
    offerId: { type: Types.ObjectId, ref: modelNames.OFFERS },
    status: { type: String, enum: bookingStatusEnum },
    conversationId: {
      type: Types.ObjectId,
      ref: modelNames.CONVERSATIONS,
      required: true,
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
