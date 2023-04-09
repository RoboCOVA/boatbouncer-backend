import { generateEnumArrayFromObject } from '../utils';

export const modelNames = {
  USERS: 'Users',
  BOATS: 'Boats',
  BOOKINGS: 'Bookings',
  TEMP_UPLOADS: 'TempUpload',
  MESSAGES: 'Messages',
  OFFERS: 'Offers',
  CONVERSATIONS: 'Conversations',
  NOTIFICATIONS: 'Notifications',
  USERS_NOTIFICATIONS: 'UsersNotifications',
  PAYMENT_METHODS: 'PaymentMethods',
  PAYMENT_INTENTS: 'PaymentIntents',
  TRANSACTIONS: 'Transactions',
  ADMINSTRATORS: 'Adminstrators',
};

export const modelNamesEnum = generateEnumArrayFromObject(modelNames);
