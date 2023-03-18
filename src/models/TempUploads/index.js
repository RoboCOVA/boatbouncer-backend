import mongoose from 'mongoose';
import tempUploadsSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

tempUploadsSchema.static(staticFunctions);
tempUploadsSchema.method(methodFunctions);

const TempUploads = mongoose.model(modelNames.TEMP_UPLOADS, tempUploadsSchema);

export default TempUploads;
