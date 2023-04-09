import mongoose from 'mongoose';
import { modelNames } from '../constants';

const invoiceSchema = new mongoose.Schema({
  from: { type: mongoose.Types.ObjectId, ref: modelNames.USERS },
  to: { type: mongoose.Types.ObjectId, ref: modelNames.USERS },
  intentId: { type: String, required: true },
});

export default invoiceSchema;
