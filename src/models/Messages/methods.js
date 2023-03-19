import { modelNames } from '../constants';
import { userNotFound } from '../Users/errors';
import { conversationNotFound } from './errors';

export async function createMessage() {
  const { conversation, sender } = this;
  const Conversations = this.model(modelNames.CONVERSATIONS);
  const Users = this.model(modelNames.USERS);

  const existingUser = await Users.findOne({ _id: sender });
  if (!existingUser) throw userNotFound;

  const existingConvo = await Conversations.findOne({ _id: conversation });
  if (!existingConvo) throw conversationNotFound;
  const messages = await this.save();
  return messages;
}
