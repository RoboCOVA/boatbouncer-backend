import mongoose from 'mongoose';
import reviewSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

reviewSchema.static(staticFunctions);
reviewSchema.method(methodFunctions);

const Reviews =
  mongoose?.models?.[modelNames.REVIEW] ||
  mongoose.model(modelNames.REVIEW, reviewSchema);

export default Reviews;
