import Stripe from 'stripe';
import { startSession } from 'mongoose';
import {
  confirmationFailed,
  intentAlreadyCreated,
  intentNotFound,
} from './errors';
import { intentStatus } from '../../utils/constants';
import { stripeSecretKey } from '../../config/environments';
import { modelNames } from '../constants';
import { userNotFound } from '../Users/errors';

const stripe = new Stripe(stripeSecretKey);

/** @STATIC_FUNCTIONS */

/**
 * It checks if the payment method is expired
 * @returns A boolean value.
 */
export async function confirmPaymentIntent({ userId, id }) {
  const Users = this.model(modelNames.USERS);
  const user = await Users.findOne({ _id: userId });

  if (!user?.stripeCustomerId) throw userNotFound;
  const customer = user?.stripeCustomerId;

  const matchQuery = { customer, _id: id, status: intentStatus.PENDING };
  const intent = await this.findOne(matchQuery);
  if (!intent?.intentId) throw intentNotFound;

  const paymentIntent = await stripe.paymentIntents.retrieve(intent.intentId);

  if (paymentIntent.status === 'requires_confirmation') {
    await stripe.paymentIntents.confirm(paymentIntent.id);

    const paymentConfirmed = await this.findOneAndUpdate(matchQuery, {
      status: intentStatus.COMPLETED,
    });
    // SAVE TO INVOICE BEFORE RETURNING
    const clean = await paymentConfirmed.cleanIntent();
    return clean;
  }
  throw confirmationFailed;
}

export async function getPendingPaymentIntents({ userId }) {
  const Users = this.model(modelNames.USERS);
  const user = await Users.findOne({ _id: userId });

  if (!user?.stripeCustomerId) throw userNotFound;

  const matchQuery = {
    customer: user?.stripeCustomerId,
    status: intentStatus.PENDING,
  };
  const intent = await this.find(matchQuery, { intentId: 0, customer: 0 });
  return intent;
}

export async function cancelPaymentIntent({ userId, id }) {
  const session = await startSession();
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      await session.withTransaction(async () => {
        const Users = this.model(modelNames.USERS);
        const user = await Users.findOne({ _id: userId });

        if (!user?.stripeCustomerId) throw userNotFound;

        const matchQuery = {
          customer: user?.stripeCustomerId,
          _id: id,
          status: intentStatus.PENDING,
        };
        const intent = await this.findOne(matchQuery).session(session);
        if (!intent?.intentId) throw intentNotFound;
        if (intent.status !== intentStatus.PENDING) throw intentAlreadyCreated;

        const updateObject = {};
        const currentIntent = stripe.paymentIntents.retrieve(intent?.intentId);
        if (currentIntent?.status === 'succeeded')
          updateObject.status = intentStatus.COMPLETED;
        else updateObject.status = intentStatus.CANCELLED;

        const cancelledIntent = await this.findOneAndUpdate(
          matchQuery,
          updateObject,
          { new: true }
        ).session(session);

        if (cancelledIntent?.status === intentStatus.CANCELLED)
          await stripe.paymentIntents.cancel(intent?.intentId);

        const clean = await cancelledIntent.cleanIntent();
        await session.commitTransaction();
        resolve(clean);
      });
    } catch (error) {
      await session.endSession();
      reject(error);
    } finally {
      await session.endSession();
    }
  });
}
