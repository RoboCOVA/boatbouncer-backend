import express from 'express';
import Stripe from 'stripe';
import { stripeSecretKey } from '../config/environments';

const stripe = new Stripe(stripeSecretKey);

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;
  const Customer = await stripe.customers.create({
    name,
    email,
    phone,
  });

  res.send(Customer);
});

router.post('/method', async (req, res) => {
  const { customer } = req.body;
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123',
    },
  });

  const paymentMethodAttach = await stripe.paymentMethods.attach(
    paymentMethod.id,
    {
      customer,
    }
  );

  res.send(paymentMethodAttach);
});

router.get('/methods', async (req, res) => {
  try {
    const { customerId } = req.body;
    // console.log(req.body);
    const paymentMethods = await stripe.customers.listPaymentMethods(
      customerId,
      {
        type: 'card',
      }
    );
    res.send(paymentMethods);
  } catch (err) {
    // console.log(err);
    res.status(500).json('Could not create payment');
  }
});

router.post('/create', async (req, res) => {
  const { paymentMethod, userCustomerId } = req.body;
  /* Query database for getting the payment amount and customer id of the current logged in user */

  const amount = 1000;
  const currency = 'USD';

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      customer: userCustomerId,
      payment_method: paymentMethod,
      confirmation_method: 'manual', // For 3D Security
      description: 'Buy Product',
    });

    /* Add the payment intent record to your datbase if required */
    res.status(200).json(paymentIntent);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.status(500).json('Could not create payment');
  }
});

router.post('/confirm', async (req, res) => {
  const { paymentIntent, paymentMethod } = req.body;
  try {
    const intent = await stripe.paymentIntents.confirm(paymentIntent, {
      payment_method: paymentMethod,
    });

    /* Update the status of the payment to indicate confirmation */
    res.status(200).json(intent);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json('Could not confirm payment');
  }
});

export default router;
