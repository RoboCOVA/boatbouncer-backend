import mongoose from 'mongoose';
import offerSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

offerSchema.static(staticFunctions);
offerSchema.method(methodFunctions);

const Offers =
  mongoose?.models?.[modelNames.OFFERS] ||
  mongoose.model(modelNames.OFFERS, offerSchema);

export default Offers;
