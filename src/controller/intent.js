import PaymentIntents from '../models/PaymentIntents';

export const createIntentController = async (req, res, next) => {
  try {
    const { paymentMethod, currency, description, metadata } = req.body;
    const paymentIntent = new PaymentIntents({
      paymentMethod,
      currency,
      description,
      metadata,
    });
    const newIntent = await paymentIntent.createPaymentIntent();
    res.send(newIntent);
  } catch (error) {
    next(error);
  }
};

export const confirmPaymentIntentController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || '';
    const { intentId } = req.params;
    const confirmIntent = await PaymentIntents.confirmPaymentIntent({
      userId,
      id: intentId,
    });
    res.send(confirmIntent);
  } catch (error) {
    next(error);
  }
};

export const getPendingIntentsController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || '';
    const intents = await PaymentIntents.getPendingPaymentIntents({
      userId,
    });
    res.send(intents);
  } catch (error) {
    next(error);
  }
};

export const cancelPaymentIntentController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || '';
    const { intentId } = req.params;
    const confirmIntent = await PaymentIntents.cancelPaymentIntent({
      userId,
      id: intentId,
    });
    res.send(confirmIntent);
  } catch (error) {
    next(error);
  }
};
