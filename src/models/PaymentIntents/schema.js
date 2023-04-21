import mongoose, { Types } from 'mongoose';
import {
  bookingStatus,
  currencyCode,
  currencyCodeEnum,
  intentStatus,
  offerStatus,
} from '../../utils/constants';
import { modelNames } from '../constants';
import Offers from '../Offers';
import Bookings from '../Bookings';

const paymentIntentSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  amount: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    enum: currencyCodeEnum,
    default: currencyCode.USD,
  },
  description: {
    type: String,
    required: true,
  },
  payment_method_types: {
    type: [String],
    default: ['card'],
  },
  metadata: {
    offerId: { type: Types.ObjectId, ref: modelNames.OFFERS, required: true },
  },
  intentId: { type: String, required: true },
  status: { type: String, enum: intentStatus, required: true },
});

paymentIntentSchema.post('findOneAndUpdate', async function callback(doc) {
  const { metadata } = doc;
  if (doc.status === intentStatus.COMPLETED) {
    const offer = await Offers.findOneAndUpdate(
      { _id: metadata.offerId },
      { status: offerStatus.COMPLETED }
    );
    await Bookings.findOneAndUpdate(
      { offerId: offer.offerId },
      {
        status: bookingStatus.COMPLETED,
      }
    );
  } else if (doc.status === intentStatus.CANCELLED) {
    const offer = await Offers.findOneAndUpdate(
      { _id: metadata.offerId },
      { status: offerStatus.CANCELLED }
    );

    await Bookings.findOneAndUpdate(
      { offerId: offer.offerId },
      {
        status: bookingStatus.CANCELLED,
      }
    );
  }
});

export default paymentIntentSchema;
