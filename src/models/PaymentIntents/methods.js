import Stripe from 'stripe';
import retry from 'retry';
import { modelNames } from '../constants';
import { userNotFound } from '../Users/errors';
import { stripeSecretKey } from '../../config/environments';
import { checkMethodExpiration } from '../../utils';
import { intentAlreadyCreated, methodExpired, userCardExpired } from './errors';
import { intentStatus } from '../../utils/constants';

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
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const { customer, paymentMethod, currency, amount, description } = this;
      const existingUser = await this.model(modelNames.USERS).findOne({
        stripeCustomerId: customer,
      });
      if (!existingUser) throw userNotFound;

      const existingIntent = await this.model(
        modelNames.PAYMENT_INTENTS
      ).findOne({
        customer,
        status: intentStatus.PENDING,
      });

      if (existingIntent) throw intentAlreadyCreated;

      const expired = checkMethodExpiration({ paymentMethod });
      if (expired) throw methodExpired;

      paymentIntent = await stripe.paymentIntents.create(paymentMethod.id, {
        customer,
        currency,
        amount,
        payment_method: paymentMethod,
        payment_method_types: ['card'],
        description,
        confirm: false,
      });

      this.intentId = paymentIntent.id;

      const saveIntent = await this.save();
      resolve(saveIntent);
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
    }
  });
}
