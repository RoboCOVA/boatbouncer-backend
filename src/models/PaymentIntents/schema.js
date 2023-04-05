import mongoose, { Types } from 'mongoose';
import {
  currencyCode,
  currencyCodeEnum,
  intentStatus,
} from '../../utils/constants';
import { modelNames } from '../constants';

const paymentIntentSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  paymentMethod: {
    card: {
      number: { type: String, required: true },
      exp_month: { type: Number, required: true },
      exp_year: { type: Number, required: true },
      cvc: { type: String, required: true },
    },
    type: {
      type: String,
      default: 'card',
    },
  },
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
    boatId: { type: Types.ObjectId, ref: modelNames.BOATS },
    userId: { type: Types.ObjectId, ref: modelNames.USERS },
  },
  intentId: { type: String, required: true },
  status: { type: String, enum: intentStatus, required: true },
});

export default paymentIntentSchema;
