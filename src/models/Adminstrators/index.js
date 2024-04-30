import mongoose from 'mongoose';
import adminSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

adminSchema.static(staticFunctions);
adminSchema.method(methodFunctions);

const Users =
  mongoose?.models?.[modelNames.ADMINSTRATORS] ||
  mongoose.model(modelNames.ADMINSTRATORS, adminSchema);

export default Users;
