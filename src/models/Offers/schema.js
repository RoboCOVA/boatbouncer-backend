import mongoose, { Types } from 'mongoose';
import { offerStatusEnum } from '../../utils/constants';
import { modelNames } from '../constants';

const offerSchema = new mongoose.Schema(
  {
    bookId: { type: Types.ObjectId, ref: modelNames.BOOKINGS, required: true },
    boatPrice: { type: Number, required: true },
    captainPrice: { type: Number, min: 0 },
    // paymentServiceFee: { type: Number, required: true },
    localTax: { type: Number, required: true },
    status: { type: String, enum: offerStatusEnum },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    createdBy: { type: Types.ObjectId, ref: modelNames.USERS, required: true },
  },
  { timestamps: true }
);

export default offerSchema;
