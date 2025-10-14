import Stripe from 'stripe';
import Users from '../models/Users';
import PaymentIntents from '../models/PaymentIntents';
import { endpointSecret, stripeSecretKey } from '../config/environments';
import { intentStatus } from '../utils/constants';

const stripe = new Stripe(stripeSecretKey);
// This is your Stripe CLI webhook secret for testing your endpoint locally.

export const stripeWebHookController = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log({ event }, 'stripe event');
    } catch (err) {
      next(err);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // eslint-disable-next-line no-console
        console.log(`Payment Succeeded ${event.data.object}`);
        await PaymentIntents.findOneAndUpdate(
          { intentId: event.data.object?.id },
          {
            status: intentStatus.COMPLETED,
          },
          { new: true }
        ).exec();
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      case 'account.updated':
        // eslint-disable-next-line no-console
        console.log(`Onboarding Complete ${event.data.object}`);
        await Users.findOneAndUpdate(
          { stripeAccountId: event.data.object?.id },
          {
            chargesEnabled: event.data.object.charges_enabled,
          }
        );
        break;
      // ... handle other event types
      default:
        // eslint-disable-next-line no-console
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send();
  } catch (error) {
    next(error);
  }
};
