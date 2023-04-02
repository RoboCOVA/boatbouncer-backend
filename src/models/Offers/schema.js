import mongoose, { Types } from 'mongoose';
import { offerStatusEnum } from '../../utils/constants';
import { modelNames } from '../constants';

const offerSchema = new mongoose.Schema(
  {
    bookId: { type: Types.ObjectId, ref: modelNames.BOOKINGS, required: true },
    boatPrice: { type: Number, required: true },
    captainPrice: { type: Number, required: true },
    paymentServiceFee: { type: Number, required: true },
    localTax: { type: Number, required: true },
    status: { type: String, enum: offerStatusEnum },
    createdBy: { type: Types.ObjectId, ref: modelNames.USERS, required: true },
  },
  { timestamps: true }
);

export default offerSchema;
