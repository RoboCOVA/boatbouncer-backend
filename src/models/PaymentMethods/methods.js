import Stripe from 'stripe';
import { modelNames } from '../constants';
import { userNotFound } from '../Users/errors';
import { stripeSecretKey } from '../../config/environments';

const stripe = new Stripe(stripeSecretKey);

export async function createPaymentMethods() {
  const { customer, card } = this;
  const existingUser = await await this.model(modelNames.USERS).findOne({
    stripeCustomerId: customer,
  });
  if (!existingUser) throw userNotFound;

  const paymentMethod = await stripe.paymentMethods.create({
    card,
  });

  await stripe.paymentMethods.attach(paymentMethod.id, {
    customer,
  });

  this.paymentMethodId = paymentMethod.id;

  const paymentMethodEntry = await this.save();
  return paymentMethodEntry;
}
