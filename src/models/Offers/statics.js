import { bookingStatus, offerStatus } from '../../utils/constants';
import { modelNames } from '../constants';
import {
  invalidReservatoinStatus,
  offerNotFound,
  offerUpdateFailed,
} from './errors';
import { reservationNotFound } from '../Bookings/errors';
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

// Add session
export async function acceptOffer({ offerId, userId }) {
  const Users = this.model(modelNames.USERS);

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
  );

  if (!updateOfferStatus) throw offerUpdateFailed;

  return updateOfferStatus;
}
