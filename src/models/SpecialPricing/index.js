import mongoose from 'mongoose';
import specialPricingSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

specialPricingSchema.static(staticFunctions);
specialPricingSchema.method(methodFunctions);

const SpecialPricing =
  mongoose?.models?.[modelNames.SPECIAL_PRICING] ||
  mongoose.model(modelNames.SPECIAL_PRICING, specialPricingSchema);

export default SpecialPricing;
