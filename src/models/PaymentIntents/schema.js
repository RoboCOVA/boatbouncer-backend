import mongoose, { Types } from 'mongoose';
import {
  currencyCode,
  currencyCodeEnum,
  intentStatus,
  offerStatus,
} from '../../utils/constants';
import { modelNames } from '../constants';
import Offers from '../Offers';

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
    await Offers.findOneAndUpdate(
      { _id: metadata.offerId },
      { status: offerStatus.COMPLETED }
    );
  } else if (doc.status === intentStatus.CANCELLED) await Offers.findOneAndUpdate({ _id: metadata.offerId }, { status: offerStatus.CANCELLED });
});

export default paymentIntentSchema;
