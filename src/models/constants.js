import { generateEnumArrayFromObject } from '../utils';

export const modelNames = {
  USERS: 'Users',
  BOATS: 'Boats',
  TEMP_UPLOADS: 'TempUpload',
  MESSAGES: 'Messages',
  CONVERSATIONS: 'Conversations',
  NOTIFICATIONS: 'Notifications',
  USERS_NOTIFICATIONS: 'UsersNotifications',
};

export const modelNamesEnum = generateEnumArrayFromObject(modelNames);
