import { modelNames } from '../constants';
import { userNotFound } from '../Users/errors';
import {
  messageDeletionFailed,
  messageNotFound,
  notMessageOwner,
  userNotMember,
} from './errors';

export async function getMessages({ conversationId, userId }) {
  const Conversations = this.model(modelNames.CONVERSATIONS);
  const conversation = await Conversations.findOne({
    _id: conversationId,
  }).populate('members');

  const isMember = conversation.members.some((member) =>
    member._id.equals(userId)
  );
  if (isMember) {
    const unreadMessages = await this.find({
      conversation: conversationId,
      isRead: false,
      sender: { $ne: userId },
    });

    if (unreadMessages.length > 0) {
      const messageIdsToUpdate = unreadMessages.map((m) => m._id);

      await this.updateMany(
        {
          _id: { $in: messageIdsToUpdate },
          isRead: false,
        },
        {
          $set: { isRead: true },
          $addToSet: { readBy: userId },
        }
      );
    }
  }

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
  const Users = this.model(modelNames.USERS);

  const user = await Users.findById(userId);
  if (!user) throw userNotFound;

  let message = await this.findOne({ _id: messageId });
  if (!message) throw messageNotFound;

  if (message.sender.equals(userId)) {
    return message;
  }

  message = await this.findOne({ _id: messageId }).populate(
    'conversation',
    'members'
  );

  const isMember = message.conversation.members.some((member) =>
    member._id.equals(userId)
  );
  if (!isMember) throw userNotMember;

  const olderMessages = await this.find({
    conversation: message.conversation._id,
    createdAt: { $lte: message.createdAt },
    isRead: false,
    sender: { $ne: userId },
  });

  const messageIdsToUpdate = [messageId, ...olderMessages.map((m) => m._id)];

  await this.updateMany(
    {
      _id: { $in: messageIdsToUpdate },
      isRead: false,
    },
    {
      $set: { isRead: true },
      $addToSet: { readBy: userId },
    }
  );

  const updatedMessage = await this.findById(messageId);
  return updatedMessage;
}

export async function deleteMessage({ messageId, userId }) {
  const Users = this.model(modelNames.USERS);

  const user = await Users.findById(userId);
  if (!user) throw userNotFound;

  const message = await this.findOne({ _id: messageId });
  if (!message) throw messageNotFound;

  if (!message.sender.equals(userId)) {
    throw notMessageOwner;
  }

  const deletedMessage = await this.findByIdAndDelete(messageId);

  if (!deletedMessage) {
    throw messageDeletionFailed;
  }
  return messageId;
}

export async function getUnreadMessagesCount({ userId }) {
  const Conversations = this.model(modelNames.CONVERSATIONS);

  const conversations = await Conversations.find({
    members: userId,
  });

  if (!conversations.length) {
    return 0;
  }

  const conversationIds = conversations.map((conv) => conv._id);

  const unreadCount = await this.countDocuments({
    conversation: { $in: conversationIds },
    isRead: false,
    sender: { $ne: userId },
  });

  return unreadCount;
}
