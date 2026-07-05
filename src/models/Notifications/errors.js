import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

export const clickUpdateFailed = new APIError(
  'Clicked Update Failed',
  httpStatus.BAD_REQUEST
);

export const deleteNotificationFailed = new APIError(
  'Notification not found or already deleted',
  httpStatus.NOT_FOUND
);
