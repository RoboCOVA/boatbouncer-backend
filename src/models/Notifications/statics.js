import { clickUpdateFailed } from './errors';

// eslint-disable-next-line import/prefer-default-export
export async function updateNotificationSeenStatus(
  notificationIds,
  userId,
  adminOverride = false
) {
  const updatedNotificationIds = [];
  await Promise.all(
    notificationIds.map(async (id) => {
      const matchQuery = adminOverride
        ? { _id: id }
        : { _id: id, createdBy: userId };
      const updatedNotification = await this.findOneAndUpdate(
        matchQuery,
        { $push: { seenBy: userId } },
        { new: true }
      );
      if (updatedNotification)
        updatedNotificationIds.push(updatedNotification._id);
    })
  );

  return updatedNotificationIds;
}

export async function updateNotificationClickedBy(
  notificationId,
  userId,
  adminOverride = false
) {
  const matchQuery = adminOverride
    ? { _id: notificationId }
    : { _id: notificationId, createdBy: userId };
  const updateClickedBy = await this.findOneAndUpdate(
    matchQuery,
    { $push: { clickedBy: userId } },
    { new: true }
  );

  if (!updateClickedBy) throw clickUpdateFailed;

  return [notificationId];
}
