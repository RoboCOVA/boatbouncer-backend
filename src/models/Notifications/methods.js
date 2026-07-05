import { startSession } from 'mongoose';
import { modelNames } from '../constants';
import UsersNotifications from '../UsersNotifications';
import { eventNames } from '../../socket/constants';

/**
 * It creates a new notification and emits it to the users who should be notified
 */
async function createAndEmitNotification({ notification, notifiableUsers }) {
  // eslint-disable-next-line no-restricted-syntax
  for (const notifiableUser of notifiableUsers) {
    const usersNotifications = new UsersNotifications(notifiableUser);
    // eslint-disable-next-line no-await-in-loop
    await usersNotifications.createUsersNotification();
  }

  if (global._emitter) {
    global._emitter.emit(eventNames.NEW_NOTIFICATION, {
      notification,
      users: notifiableUsers.map((item) => item.user.toString()),
    });
  }
}

async function emitNotifications({ notification, userIds = [] }) {
  if (!Array.isArray(userIds) || !userIds.length) return;

  const uniqueUserIds = [
    ...new Set(userIds.map((id) => id?.toString()).filter(Boolean)),
  ];

  const notifiableUsers = uniqueUserIds.map((id) => ({
    user: id,
    onModel: modelNames.USERS,
    notifications: [notification._id],
  }));

  await createAndEmitNotification({ notification, notifiableUsers });
}

// eslint-disable-next-line import/prefer-default-export
export async function createNotification({ userIds }) {
  const session = await startSession();
  try {
    let notification;
    await session.withTransaction(async () => {
      notification = await this.save({ session });
    });
    await emitNotifications({ notification, userIds });
    return notification;
  } finally {
    await session.endSession();
  }
}
