import Stripe from 'stripe';
import { confirmationFailed, intentNotFound } from './errors';
import { intentStatus } from '../../utils/constants';
import { stripeSecretKey } from '../../config/environments';

const stripe = new Stripe(stripeSecretKey);

/** @STATIC_FUNCTIONS */

/**
 * It checks if the payment method is expired
 * @returns A boolean value.
 */
export async function confirmPaymentIntent({ customer, intentId }) {
  const matchQuery = { customer, intentId, status: intentStatus.PENDING };
  const intent = await this.findOne(matchQuery);
  if (!intent) throw intentNotFound;

  const paymentIntent = await stripe.paymentIntents.retrieve(intent.intentId);

  if (paymentIntent.status === 'requires_confirmation') {
    await stripe.paymentIntents.confirm(paymentIntent.id);

    const paymentConfirmed = await this.findOneAndUpdate(matchQuery, {
      status: intentStatus.COMPLETED,
    });
    // SAVE TO INVOICE BEFORE RETURNING
    return paymentConfirmed;
  }
  throw confirmationFailed;
}
