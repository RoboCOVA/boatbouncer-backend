import mongoose from 'mongoose';
import favoritesSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

favoritesSchema.static(staticFunctions);
favoritesSchema.method(methodFunctions);

const Favorites =
  mongoose?.models?.[modelNames.FAVORITES] ||
  mongoose.model(modelNames.FAVORITES, favoritesSchema);

export default Favorites;
