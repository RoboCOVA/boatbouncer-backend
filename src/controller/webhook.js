import Stripe from 'stripe';
import Users from '../models/Users';
import { stripeSecretKey } from '../config/environments';

const stripe = new Stripe(stripeSecretKey);
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  'whsec_8ee99c032f4ea745f35c4209011dfa4e75bcf202544f2ccdb74830b61527ec1f';

export const stripeWebHookController = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      next(err);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // eslint-disable-next-line no-console
        console.log(`Payment Succeeded ${event.data.object}`);
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
