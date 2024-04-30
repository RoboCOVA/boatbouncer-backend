import { startSession } from 'mongoose';
import { modelNames } from '../constants';
import {
  bookOwnerNotFoundStatus,
  invalidAccess,
  invalidStatus,
  offerDuplication,
} from './errors';
import {
  reservationNotFound,
  reservationUpdateFailed,
} from '../Bookings/errors';
import { bookingStatus } from '../../utils/constants';

export async function createOffers() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const session = await startSession();
    const Bookings = this.model(modelNames.BOOKINGS);
    try {
      await session.withTransaction(async () => {
        const { bookId, createdBy } = this;

        /** Check if the boat exists */
        const book = await Bookings.findOne({ _id: bookId });
        if (!book) throw reservationNotFound;

        if (
          book?.status === bookingStatus.CANCELLED ||
          book?.status === bookingStatus.COMPLETED
        )
          throw invalidStatus;

        if (!book?.owner) throw bookOwnerNotFoundStatus;
        if (!book.owner?.equals(createdBy)) throw invalidAccess;
        if (book?.offerId) throw offerDuplication;

        const offer = await this.save({ session });

        const updateBooking = await Bookings.findOneAndUpdate(
          { _id: bookId },
          {
            offerId: offer._id,
          }
        ).session(session);

        if (!updateBooking) throw reservationUpdateFailed;

        await session.commitTransaction();
        resolve(offer);
      });
    } catch (error) {
      await session.endSession();
      reject(error);
    } finally {
      await session.endSession();
    }
  });
}
