import { ObjectId } from 'mongodb';
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

// on post is optional boolean value to read all message on post
export async function readMessage({ messageId, userId, onPost }) {
  const Users = this.model(modelNames.USERS);

  const user = await Users.findById(userId);
  if (!user || user.isDeleted) throw userNotFound;

  let message = await this.findOne({ _id: messageId });
  if (!message) throw messageNotFound;

  if (message.sender.equals(userId) && !onPost) {
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

  const messageIdsToUpdate = onPost
    ? [...olderMessages.map((m) => m._id)]
    : [messageId, ...olderMessages.map((m) => m._id)];

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

export async function readMessagesByConversationId({
  conversationId,
  userId,
  force,
}) {
  const Conversations = this.model(modelNames.CONVERSATIONS);
  const Users = this.model(modelNames.USERS);
  const Messages = this.model(modelNames.MESSAGES);

  // Step 1: Validate user
  const user = await Users.findById(userId);
  if (!user || user.isDeleted) throw userNotFound;

  // Step 2: Validate conversation
  const conversation = await Conversations.findById(conversationId);
  if (!conversation) {
    return {};
  }

  // Step 3: Ensure user is a member of the conversation
  const isMember = conversation.members.some((memberId) =>
    memberId.equals(userId)
  );
  if (!isMember) throw userNotMember;

  // Step 4: Find all unread messages in this conversation sent by others

  const query = force
    ? {
        conversation: conversationId,
      }
    : {
        conversation: conversationId,
        isRead: false,
        sender: { $ne: new ObjectId(userId) },
      };
  const unreadMessages = await Messages.find(query);

  const messageIdsToUpdate = unreadMessages.map((msg) => msg._id);

  if (!messageIdsToUpdate.length) {
    return {
      updatedCount: 0,
      message: 'No unread messages found for this conversation.',
    };
  }

  // Step 5: Mark messages as read
  const result = await Messages.updateMany(
    {
      _id: { $in: messageIdsToUpdate },
      isRead: false,
    },
    {
      $set: { isRead: true },
      $addToSet: { readBy: userId },
    }
  );

  return {
    updatedCount: result.modifiedCount,
    message: `${result.modifiedCount} messages marked as read.`,
  };
}

export async function deleteMessage({ messageId, userId }) {
  const Users = this.model(modelNames.USERS);

  const user = await Users.findById(userId);
  if (!user || user.isDeleted) throw userNotFound;

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

// export async function getUnreadMessagesCount({ userId }) {
//   const Conversations = this.model(modelNames.CONVERSATIONS);

//   const conversations = await Conversations.find({
//     members: userId,
//   });

//   if (!conversations.length) {
//     return 0;
//   }

//   const conversationIds = conversations.map((conv) => conv._id);

//   const unreadCount = await this.countDocuments({
//     conversation: { $in: conversationIds },
//     isRead: false,
//     sender: { $ne: userId },
//   });

//   return unreadCount;
// }

export async function getUnreadMessagesCount({ userId }) {
  const Conversations = this.model(modelNames.CONVERSATIONS);
  const Messages = this.model(modelNames.MESSAGES);

  // Step 1: Find all conversations for the user
  const conversations = await Conversations.find({
    members: userId,
  });

  if (!conversations.length) {
    return {
      totalUnread: 0,
      unreadByConversation: [],
    };
  }

  const conversationIds = conversations.map((conv) => conv._id);

  // Step 2: Aggregate unread messages grouped by conversation
  const unreadAggregation = await Messages.aggregate([
    {
      $match: {
        conversation: { $in: conversationIds },
        isRead: false,
        sender: { $ne: new ObjectId(userId) },
      },
    },
    {
      $group: {
        _id: '$conversation',
        count: { $sum: 1 },
      },
    },
  ]);

  const totalUnread = unreadAggregation.reduce(
    (sum, conv) => sum + conv.count,
    0
  );

  const unreadByConversation = unreadAggregation.map((item) => ({
    conversationId: item._id,
    count: item.count,
  }));

  return {
    newMessageCount: totalUnread,
    unreadByConversation,
  };
}
