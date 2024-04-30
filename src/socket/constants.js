import { generateEnumArrayFromObject } from '../utils';

export const socketConstant = {
  ADD_USER: 'add-user',
  SEND_MESSAGE: 'sendMessage',
  GET_MESSAGE: 'getMessage',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  USERS: 'users',
  ALL_USERS: 'all users',
};

export const eventNames = {
  NEW_NOTIFICATION: 'NEW_NOTIFICATION',
  INCOMING_NEW_NOTIFICATION: 'INCOMING_NEW_NOTIFICATION',
};

export const eventNamesEnum = generateEnumArrayFromObject(eventNames);
