import { modelNames } from '../constants';
import { userNotFound } from '../Users/errors';
import { messageNotFound, userNotMember } from './errors';

export async function getMessages({ conversationId }) {
  const message = await this.find({ conversation: conversationId }).populate([
    {
      path: 'conversation',
      populate: {
        path: 'members',
        select: 'userName',
      },
    },
  ]);
  return message;
}

export async function readMessage({ messageId, userId }) {
  const Messages = this.model(modelNames.MESSAGES);
  const Users = this.model(modelNames.USERS);

  const user = await Users.findById(userId);
  if (!user) throw userNotFound;

  let message = await Messages.findOne({ _id: messageId });
  if (!message) throw messageNotFound;

  if (message.sender.equals(userId)) {
    return message;
  }

  message = await Messages.findOne({ _id: messageId }).populate(
    'conversation',
    'members'
  );

  const isMember = message.conversation.members.some((member) =>
    member._id.equals(userId)
  );
  if (!isMember) throw userNotMember;

  const olderMessages = await Messages.find({
    conversation: message.conversation._id,
    createdAt: { $lte: message.createdAt },
    isRead: false,
    sender: { $ne: userId },
  });

  const messageIdsToUpdate = [messageId, ...olderMessages.map((m) => m._id)];

  await Messages.updateMany(
    {
      _id: { $in: messageIdsToUpdate },
      isRead: false,
    },
    {
      $set: { isRead: true },
      $addToSet: { readBy: userId },
    }
  );

  const updatedMessage = await Messages.findById(messageId);
  return updatedMessage;
}
