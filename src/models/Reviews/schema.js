import mongoose, { Types } from 'mongoose';
import { modelNames } from '../constants';

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: Types.ObjectId,
      ref: modelNames.BOOKINGS,
      required: true,
      unique: true, // Ensures only one review per booking
    },
    userId: {
      type: Types.ObjectId,
      ref: modelNames.USERS,
      required: true,
    },
    boatId: {
      type: Types.ObjectId,
      ref: modelNames.BOATS,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewMessage: {
      type: String,
      required: false,
      maxlength: 1000,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to ensure one review per user per booking
reviewSchema.index({ bookingId: 1 }, { unique: true });

// Index for efficient querying by boat and user
reviewSchema.index({ boatId: 1, userId: 1 });
reviewSchema.index({ boatId: 1, date: -1 }); // For getting recent reviews for a boat

export default reviewSchema;
