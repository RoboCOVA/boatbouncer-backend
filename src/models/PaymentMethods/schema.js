import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  paymentMethodId: { type: String, required: true },
  card: {
    number: { type: String, required: true },
    expMonth: { type: Number, required: true },
    expYear: { type: Number, required: true },
    cvc: { type: String, required: true },
  },
  type: {
    type: String,
    default: 'card',
  },
});

export default paymentMethodSchema;
