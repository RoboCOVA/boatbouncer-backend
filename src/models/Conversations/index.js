import mongoose from 'mongoose';
import conversationSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

conversationSchema.static(staticFunctions);
conversationSchema.method(methodFunctions);

const Conversation = mongoose.model(
  modelNames.CONVERSATIONS,
  conversationSchema
);

export default Conversation;
