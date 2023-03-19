import httpStatus from 'http-status';
import APIError from '../../errors/APIError';

export const conversationNotFound = new APIError(
  'Conversation not found',
  httpStatus.NOT_FOUND
);
