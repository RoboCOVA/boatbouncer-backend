import { modelNames } from '../constants';
import {
  bookingNotCompleted,
  bookingNotFound,
  reviewAlreadyExists,
  reviewCreateFailed,
  userNotAuthorized,
} from './errors';

export async function createReview() {
  // Check if review already exists for this booking
  const existingReview = await this.constructor.findOne({
    bookingId: this.bookingId,
  });

  if (existingReview) {
    throw reviewAlreadyExists;
  }

  // Verify the booking exists and user is authorized
  const booking = await this.model(modelNames.BOOKINGS)
    .findOne({
      _id: this.bookingId,
    })
    .populate('boatId');

  if (!booking) {
    throw bookingNotFound;
  }

  // Check if user is the renter of this booking
  if (booking.renter.toString() !== this.userId.toString()) {
    throw userNotAuthorized;
  }

  // Check if booking is completed
  if (booking.status !== 'completed') {
    throw bookingNotCompleted;
  }

  this.boatId = booking.boatId._id;

  try {
    const review = await this.save();
    await this.model(modelNames.BOATS).calculateRating(this.boatId);
    return review;
  } catch (error) {
    throw reviewCreateFailed;
  }
}
