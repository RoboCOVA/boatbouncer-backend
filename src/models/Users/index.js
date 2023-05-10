import mongoose from 'mongoose';
import userSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

userSchema.static(staticFunctions);
userSchema.method(methodFunctions);

const Users =
  mongoose?.models?.[modelNames.USERS] ||
  mongoose.model(modelNames.USERS, userSchema);

export default Users;
