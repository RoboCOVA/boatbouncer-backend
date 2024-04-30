import mongoose from 'mongoose';
import messagesSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

messagesSchema.static(staticFunctions);
messagesSchema.method(methodFunctions);

const Messages =
  mongoose?.models?.[modelNames.MESSAGES] ||
  mongoose.model(modelNames.MESSAGES, messagesSchema);

export default Messages;
