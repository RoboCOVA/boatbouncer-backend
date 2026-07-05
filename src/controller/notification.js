import { isValidObjectId } from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';
import Notifications from '../models/Notifications';
import UsersNotifications from '../models/UsersNotifications';

export const getNotificationsController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { pageNo = 1, size = 20 } = req.query;

    const result = await UsersNotifications.getNotifications(
      pageNo,
      size,
      userId
    );
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const markNotificationsSeenController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds) || !notificationIds.length) {
      throw new APIError(
        'notificationIds must be a non-empty array',
        httpStatus.BAD_REQUEST
      );
    }

    const invalidIds = notificationIds.filter((id) => !isValidObjectId(id));
    if (invalidIds.length) {
      throw new APIError(
        'One or more notificationIds are invalid',
        httpStatus.BAD_REQUEST
      );
    }

    const updated = await Notifications.updateNotificationSeenStatus(
      notificationIds,
      userId,
      true
    );
    res.send({ updatedIds: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteNotificationController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { notificationId } = req.params;

    if (!isValidObjectId(notificationId)) {
      throw new APIError('Invalid notification ID', httpStatus.BAD_REQUEST);
    }

    await Notifications.softDeleteNotification(notificationId, userId);
    res.send({ deletedId: notificationId });
  } catch (error) {
    next(error);
  }
};
