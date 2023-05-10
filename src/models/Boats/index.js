import mongoose from 'mongoose';
import boatSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

boatSchema.static(staticFunctions);
boatSchema.method(methodFunctions);

const Boats =
  mongoose?.models?.[modelNames.BOATS] ||
  mongoose.model(modelNames.BOATS, boatSchema);

export default Boats;
