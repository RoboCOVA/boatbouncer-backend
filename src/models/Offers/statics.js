import Stripe from 'stripe';
import { bookingStatus, offerStatus } from '../../utils/constants';
import { modelNames } from '../constants';
import {
  invalidReservatoinStatus,
  offerNotFound,
  offerUpdateFailed,
  stripeCustomerCreationFailed,
  userUpdateFailed,
} from './errors';
import { reservationNotFound } from '../Bookings/errors';
import { userNotFound } from '../Users/errors';
import { stripeSecretKey } from '../../config/environments';

const stripe = new Stripe(stripeSecretKey);

/** @HELPERS */
async function doesCustomerExistByEmail(email) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const customers = await stripe.customers.list({ email });
      resolve(customers); // customer exists if there is at least one customer with the given email
    } catch (error) {
      reject(error);
    }
  });
}
/** @END */

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
  const user = await this.findOne({ _id: userId });
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

  const customers = await doesCustomerExistByEmail(user?.email);

  if (user?.stripeCustomerId && !customers.length) {
    const { phoneNumber, email, userName } = user;

    /** Create Stripe User */
    const Customer = await stripe.customers.create({
      phoneNumber,
      email,
      userName,
    });
    if (!Customer) throw stripeCustomerCreationFailed;

    /** Save stripe customerId to the current user */
    const userStripe = await Users.findOneAndUpdate(
      { _id: userId },
      { stripeCustomerId: Customer.id }
    );
    if (userStripe) throw userUpdateFailed;
  }

  const updateOfferStatus = await this.findOneAndUpdate(matchQuery, {
    status: offerStatus.PROCESSING,
  });

  if (!updateOfferStatus) throw offerUpdateFailed;
}
