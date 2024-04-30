import { startSession } from 'mongoose';
import { modelNames } from '../constants';
import UsersNotifications from '../UsersNotifications';
import { eventNames } from '../../socket/constants';

/**
 * It creates a new notification and emits it to the users who should be notified
 */
async function createAndEmitNotification({ notification, notifiableUsers }) {
  if (notifiableUsers.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item in notifiableUsers) {
      if (notifiableUsers?.[item]) {
        const usersNotifications = new UsersNotifications(
          notifiableUsers?.[item]
        );
        // eslint-disable-next-line no-await-in-loop
        await usersNotifications.createUsersNotification();
      }
    }
  }

  // emitt the new notification
  global._emitter.emit(eventNames.NEW_NOTIFICATION, {
    notification,
    users: notifiableUsers.map((item) => item.user.toString()),
  });
}

/**
 * It takes in an object with a notification and an array of userIds, and then creates a new
 * notifiableUsers array with the userIds and the notification._id, and then calls the
 * createAndEmitNotification function with the notification and the notifiableUsers array.
 */
async function emitNotifications({ notification, userIds = [] }) {
  const notifiableUsers = [];

  if (Array.isArray(userIds) && userIds?.length)
    userIds.forEach((item) => {
      notifiableUsers.push({
        user: item,
        onModel: modelNames.USERS,
        notifications: [notification._id],
      });
    });

  await createAndEmitNotification({
    notification,
    notifiableUsers,
  });
}

// eslint-disable-next-line import/prefer-default-export
export async function createNotification({ userIds }) {
  const { modelType } = this;
  const session = await startSession();
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      await session.withTransaction(async () => {
        const notification = await this.save({ session });

        switch (modelType) {
          case modelNames.BOOKINGS:
            await emitNotifications({ notification, userIds });
            break;
          default:
            break;
        }

        await session.commitTransaction();
        resolve(notification);
      });
    } catch (error) {
      reject(error);
    } finally {
      await session.endSession();
    }
  });
}
