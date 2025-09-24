import { startSession } from 'mongoose';
import { bookingStatus, offerStatus } from '../../utils/constants';
import { modelNames } from '../constants';
import {
  authorizationError,
  offerCancelFailed,
  offerNotFound,
  reservationNotFound,
  reservationUpdateFailed,
  statusChangeError,
} from './errors';

/**
 * It cancels a booking and if an offer is already created, it cancels the offer as well.
 * </code>
 * @returns a promise.
 */
export async function cancelBooking({ bookId, userId, isRenter }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const session = await startSession();
    const Offers = this.model(modelNames.OFFERS);
    try {
      await session.withTransaction(async () => {
        const matchQuery = {
          _id: bookId,
        };

        if (isRenter) matchQuery.renter = userId;
        const book = await this.findOne(matchQuery).populate('boatId');

        if (!book) throw reservationNotFound;

        if (!isRenter && !book?.owner?.equals(userId)) throw authorizationError;

        if (book?.status !== bookingStatus.PENDING) throw statusChangeError;
        const cancelledBooking = await this.findOneAndUpdate(
          matchQuery,
          {
            status: bookingStatus.CANCELLED,
          },
          { new: true }
        ).session(session);

        if (!cancelledBooking) throw reservationUpdateFailed;

        /** If Offer is already created, cancel the offer as well */
        if (book?.offerId) {
          const offer = await Offers.findOne({ _id: book?.offerId });
          if (!offer) throw offerNotFound;

          const cancelOffer = await Offers.findOneAndUpdate(
            {
              _id: book?.offerId,
            },
            { status: offerStatus.CANCELLED }
          ).session(session);

          if (!cancelOffer) throw offerCancelFailed;
        }

        await session.commitTransaction();
        resolve(cancelledBooking);
      });
    } catch (error) {
      await session.endSession();
      reject(error);
    } finally {
      await session.endSession();
    }
  });
}

/**
 * Get all bookings that are not cancelled and match the userId and isRenter flag.
 * @returns An array of bookings.
 */
export async function getBookings({ userId, isRenter }) {
  const matchQuery = {
    status: { $nin: [bookingStatus.CANCELLED, bookingStatus.COMPLETED] },
  };
  if (isRenter) {
    matchQuery.renter = userId;
  } else matchQuery.owner = userId;

  const bookings = await this.find(matchQuery).populate([
    {
      path: 'renter',
      select: [
        '-password',
        '-stripeCustomerId',
        '-stripeAccountId',
        '-chargesEnabled',
      ],
    },
    {
      path: 'owner',
      select: [
        '-password',
        '-stripeCustomerId',
        '-stripeAccountId',
        '-chargesEnabled',
      ],
    },
    {
      path: 'offerId',
    },
    {
      path: 'boatId',
    },
  ]);
  const total = await this.count(matchQuery);
  return { data: bookings, total };
}

/**
 * Get a booking by its id, the user id and whether the user is the renter or the owner.
 * @returns The booking object
 */
export async function getBooking({ bookId, userId, isRenter }) {
  const matchQuery = {
    _id: bookId,
    status: { $nin: [bookingStatus.CANCELLED] },
  };
  if (isRenter) {
    matchQuery.renter = userId;
  } else matchQuery.owner = userId;

  const booking = await this.findOne(matchQuery).populate([
    {
      path: 'offerId',
    },
    {
      path: 'boatId',
    },
    {
      path: 'renter',
    },
  ]);
  return booking;
}

export async function checkAvailability({ boatId, start, end }) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error(
      'Invalid date format. Please provide dates in the format: yyyy-mm-dd'
    );
  }

  const bookings = await this.find({
    boatId,
    status: { $nin: [bookingStatus.CANCELLED] },
    // 'duration.start': { $gte: startDate },
    // 'duration.end': { $lte: endDate },
    $or: [
      // Case 1: Booking starts during the requested period
      {
        'duration.start': { $gte: startDate, $lt: endDate },
      },
      // Case 2: Booking ends during the requested period
      {
        'duration.end': { $gt: startDate, $lte: endDate },
      },
      // Case 3: Booking completely contains the requested period
      {
        'duration.start': { $lte: startDate },
        'duration.end': { $gte: endDate },
      },
    ],
  });

  if (bookings?.length) return false;
  return true;
}

/**
 * Get canceled bookings
 * @returns An array of canceled bookings
 */
export async function getCanceledBookings({ userId, as }) {
  const matchQuery = { status: bookingStatus.CANCELLED };
  if (as === 'renter') {
    matchQuery.renter = userId;
  } else matchQuery.owner = userId;
  const bookings = await this.find(matchQuery).populate([
    {
      path: 'renter',
      select: [
        '-password',
        '-stripeCustomerId',
        '-stripeAccountId',
        '-chargesEnabled',
      ],
    },
    {
      path: 'owner',
      select: [
        '-password',
        '-stripeCustomerId',
        '-stripeAccountId',
        '-chargesEnabled',
      ],
    },
    {
      path: 'offerId',
    },
    {
      path: 'boatId',
    },
  ]);
  const total = await this.count(matchQuery);
  return { data: bookings, total };
}

export async function getCompletedBookings({ userId, as }) {
  const matchQuery = { status: bookingStatus.COMPLETED };
  if (as === 'renter') {
    matchQuery.renter = userId;
  } else matchQuery.owner = userId;
  const bookings = await this.find(matchQuery).populate([
    {
      path: 'renter',
      select: [
        '-password',
        '-stripeCustomerId',
        '-stripeAccountId',
        '-chargesEnabled',
      ],
    },
    {
      path: 'owner',
      select: [
        '-password',
        '-stripeCustomerId',
        '-stripeAccountId',
        '-chargesEnabled',
      ],
    },
    {
      path: 'offerId',
    },
    {
      path: 'boatId',
    },
  ]);
  const total = await this.count(matchQuery);
  return { data: bookings, total };
}
