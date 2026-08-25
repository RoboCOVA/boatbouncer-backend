import { clickUpdateFailed, deleteNotificationFailed } from './errors';

/**
 * `notificationIds` must already be scoped to the caller — see
 * `UsersNotifications.filterOwnedNotificationIds`. Notifications hold no
 * recipient field, so ownership cannot be expressed in this query.
 */
export async function updateNotificationSeenStatus(notificationIds, userId) {
  const updatedNotificationIds = [];
  await Promise.all(
    notificationIds.map(async (id) => {
      const updatedNotification = await this.findOneAndUpdate(
        { _id: id },
        { $addToSet: { seenBy: userId } },
        { new: true }
      );
      if (updatedNotification)
        updatedNotificationIds.push(updatedNotification._id);
    })
  );

  return updatedNotificationIds;
}

export async function softDeleteNotification(notificationId, userId) {
  const updated = await this.findOneAndUpdate(
    { _id: notificationId, deletedBy: { $ne: userId } },
    { $push: { deletedBy: userId } },
    { new: true }
  );

  if (!updated) throw deleteNotificationFailed;
  return notificationId;
}

/** `notificationId` must already be scoped to the caller — see above. */
export async function updateNotificationClickedBy(notificationId, userId) {
  const updateClickedBy = await this.findOneAndUpdate(
    { _id: notificationId },
    { $push: { clickedBy: userId } },
    { new: true }
  );

  if (!updateClickedBy) throw clickUpdateFailed;

  return [notificationId];
}
