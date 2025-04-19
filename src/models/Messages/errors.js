import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

/** @ERRORS */
export const messageNotFound = new APIError(
  'Message not found',
  httpStatus.NOT_FOUND
);

export const conversationNotFound = new APIError(
  'Conversation not found',
  httpStatus.NOT_FOUND
);

export const userNotMember = new APIError(
  'user is not member of conversation',
  httpStatus.BAD_REQUEST
);
