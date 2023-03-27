import { modelNames } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export async function createUsersNotification() {
  const UsersNotifications = this.model(modelNames.USERS_NOTIFICATIONS);
  const { user, notifications } = this;
  const existingUser = await UsersNotifications.findOne({ user });

  if (existingUser) {
    const usernotification = await UsersNotifications.findOneAndUpdate(
      { _id: existingUser._id },
      {
        $push: {
          notifications: {
            $each: [notifications],
            $position: 0,
          },
        },
      }
    );
    return usernotification;
  }
  const usersnotification = await this.save();
  return usersnotification;
}
