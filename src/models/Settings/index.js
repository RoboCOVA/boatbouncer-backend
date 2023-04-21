import mongoose from 'mongoose';
import settingsSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

settingsSchema.static(staticFunctions);
settingsSchema.method(methodFunctions);

const Users = mongoose.model(modelNames.SETTINGS, settingsSchema);

export default Users;
