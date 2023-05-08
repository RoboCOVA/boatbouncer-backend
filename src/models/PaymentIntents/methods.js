import Stripe from 'stripe';
import retry from 'retry';
import { startSession } from 'mongoose';
import { modelNames } from '../constants';
import { userNotFound } from '../Users/errors';
import { stripeSecretKey } from '../../config/environments';
import {
  ownerAccountIdNotFound,
  ownerNotFound,
  settingDocNotFound,
  unableToAcceptPayment,
  userCardExpired,
} from './errors';
import {
  invalidOfferStatus,
  offerCompleted,
  offerNotFound,
} from '../Offers/errors';
import { offerStatus, intentStatus } from '../../utils/constants';
import { decryptData } from '../../utils';

const stripe = new Stripe(stripeSecretKey);

let paymentIntent;

function cancelPaymentIntent(id) {
  const operation = retry.operation({
    retries: 5, // Maximum number of times to retry
    factor: 2, // Exponential factor for backoff
    minTimeout: 1000, // Minimum delay before retrying (in ms)
    maxTimeout: 30000, // Maximum delay before retrying (in ms)
    randomize: true, // Randomize the timeouts to avoid creating a Thundering Herd problem
  });
  return new Promise((resolve, reject) => {
    operation.attempt(async () => {
      try {
        const intent = await stripe.paymentIntents.cancel(id);
        // eslint-disable-next-line no-console
        console.log('Payment Canceled');
        resolve(intent);
      } catch (error) {
        if (operation.retry(error)) {
          // eslint-disable-next-line no-console
          console.log(
            `Retrying paymentIntent.cancel. Retry number: ${operation.attempts()}`
          );
        } else {
          // eslint-disable-next-line no-console
          console.log(
            `Maximum retries reached. Could not cancel paymentIntent with id ${id}`
          );
          reject(operation.mainError());
        }
      }
    });
  });
}

export async function createPaymentIntent() {
  const session = await startSession();
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      await session.withTransaction(async () => {});
      const { currency, description, metadata } = this;
      const Settings = await this.model(modelNames.SETTINGS);
      const offer = await this.model(modelNames.OFFERS)
        .findOne({
          _id: metadata?.offerId,
        })
        .populate([
          {
            path: 'bookId',
            populate: 'owner',
          },
        ]);

      const setting = await Settings.findOne();
      if (!setting?.platformCut) throw settingDocNotFound;

      if (!offer?.bookId?.owner?.stripeAccountId) throw ownerAccountIdNotFound;

      if (
        !offer?.bookId?.boatId ||
        !offer?.bookId?.renter ||
        !offer?.bookId?.owner?.stripeAccountId ||
        !offer?.boatPrice ||
        !offer?.paymentServiceFee ||
        !offer?.localTax
      )
        throw offerNotFound;

      if (offer.status === offerStatus.COMPLETED) throw offerCompleted;
      if (offer.status !== offerStatus.PROCESSING) throw invalidOfferStatus;

      const { bookId } = offer;

      const existingUser = await this.model(modelNames.USERS).findOne({
        _id: bookId?.renter,
      });

      if (!existingUser?.stripeCustomerId) throw userNotFound;

      const boatowner = await this.model(modelNames.BOATS).findOne({
        owner: offer?.bookId?.owner?._id,
        _id: bookId?.boatId,
      });
      if (!boatowner) throw ownerNotFound;

      const customer = existingUser?.stripeCustomerId;
      this.customer = customer;

      const existingIntent = await this.model(
        modelNames.PAYMENT_INTENTS
      ).findOne({
        customer,
        status: intentStatus.PENDING,
      });

      if (existingIntent) {
        const currentIntent = await stripe.paymentIntents.retrieve(
          existingIntent?.intentId
        );
        if (currentIntent) {
          if (currentIntent?.status === 'canceled') {
            await this.model(modelNames.PAYMENT_INTENTS)
              .findOneAndUpdate(
                { _id: existingIntent?._id },
                { status: intentStatus.CANCELLED }
              )
              .session(session);
          } else if (currentIntent?.status === 'succeeded') {
            await this.model(modelNames.PAYMENT_INTENTS)
              .findOneAndUpdate(
                { _id: existingIntent?._id },
                { status: intentStatus.COMPLETED }
              )
              .session(session);
          } else await cancelPaymentIntent(existingIntent?.intentId);
        }
      }

      const boatPrice = +offer.boatPrice || 0;
      const captainPrice = offer?.captainPrice ? +offer.captainPrice : 0;
      const paymentServiceFee = +offer.paymentServiceFee || 0;
      const localTax = +offer.localTax || 0;
      const totalAmont =
        boatPrice + captainPrice + paymentServiceFee + localTax;
      const platformFee = (totalAmont * +setting.platformCut) / 100;

      const accountId = decryptData(offer?.bookId?.owner?.stripeAccountId);

      const savedAccount = await stripe.accounts.retrieve(accountId);

      if (!savedAccount?.charges_enabled) throw unableToAcceptPayment;

      paymentIntent = await stripe.paymentIntents.create({
        customer,
        currency,
        amount: totalAmont * 100,
        payment_method_types: ['card'],
        description,
        confirm: false,
        transfer_data: {
          destination: accountId,
        },
        application_fee_amount: platformFee * 100,
      });

      this.amount = totalAmont;
      this.intentId = paymentIntent.id;
      this.status = intentStatus.PENDING;

      await this.save({ session });
      resolve({ client_secret: paymentIntent.client_secret });
    } catch (error) {
      if (
        /** Checks if the error is related to expiration of the card */
        error?.code === 'card_error' &&
        error?.decline_code === 'expired_card'
      ) {
        reject(userCardExpired);
      } else if (paymentIntent?.id) {
        /** Cancel the created paymentIntent (only if its created in the first place) */
        try {
          await cancelPaymentIntent(paymentIntent?.id);
          reject(error);
        } catch (err) {
          reject(err);
        }
      }
      reject(error);
    } finally {
      await session.endSession();
    }
  });
}

export async function cleanIntent() {
  const intentObj = this.toObject({ virtuals: true });
  delete intentObj.intentId;
  delete intentObj.customer;
  return intentObj;
}
