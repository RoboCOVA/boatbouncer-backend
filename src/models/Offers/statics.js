import { startSession } from 'mongoose';
import { bookingStatus, offerStatus } from '../../utils/constants';
import { modelNames } from '../constants';
import {
  invalidReservatoinStatus,
  offerNotFound,
  offerUpdateFailed,
} from './errors';
import {
  reservationNotFound,
  reservationUpdateFailed,
} from '../Bookings/errors';
import { userNotFound } from '../Users/errors';

export async function updateOffer({ offerId, userId, updateObject }) {
  const matchQuery = { _id: offerId, createdBy: userId };
  const Bookings = this.model(modelNames.BOOKINGS);

  const offer = await this.findOne(matchQuery);
  if (!offer) throw offerNotFound;

  const reservation = await Bookings.findOne({ _id: offer?.bookId });
  if (!reservation) throw reservationNotFound;

  if (
    reservation?.status === bookingStatus.CANCELLED ||
    reservation?.status === bookingStatus.COMPLETED
  )
    throw invalidReservatoinStatus;

  const updatedOffer = await this.findOne(matchQuery, updateObject, {
    new: true,
  });

  if (!updatedOffer) throw offerUpdateFailed;

  return updatedOffer;
}

export async function acceptOffer({ offerId, userId }) {
  const session = await startSession();
  return new Promise(async (resolve, reject) => {
    try {
      await session.withTransaction(async () => {
        const Users = this.model(modelNames.USERS);
        const Bookings = this.model(modelNames.BOOKINGS);

        /** @EXISTING_CHECK */
        const user = await Users.findOne({ _id: userId });
        if (!user) throw userNotFound;

        const matchQuery = {
          _id: offerId,
          renter: userId,
          status: {
            $nin: [
              offerStatus.CANCELLED,
              offerStatus.COMPLETED,
              offerStatus.PROCESSING,
            ],
          },
        };
        const offer = await this.findOne(matchQuery);
        if (!offer) throw offerNotFound;

        const updateOfferStatus = await this.findOneAndUpdate(
          matchQuery,
          {
            status: offerStatus.PROCESSING,
          },
          { new: true }
        ).session(session);

        if (!updateOfferStatus) throw offerUpdateFailed;

        const updateBooking = await Bookings.findOneAndUpdate(
          { _id: updateOfferStatus.bookId },
          {
            $set: {
              'duration.start': updateOfferStatus.departureDate,
              'duration.end': updateOfferStatus.returnDate,
            },
          }
        ).session(session);

        if (updateBooking) throw reservationUpdateFailed;

        await session.commitTransaction();
        resolve(updateOfferStatus);
      });
    } catch (error) {
      reject(error);
    } finally {
      await session.endSession();
    }
  });
}
