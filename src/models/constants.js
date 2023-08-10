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
  SETTINGS: 'Settings',
};

export const categories = {
  PowerboatsPontoonsAndRIBs: 'Powerboats, pontoons and RIBs',
  Sailing: 'Sailing',
  LuxMotor: 'Luxury motor yachts and bigger groups',
  Fishing: 'Fishing',
  JetskisWaterFly: 'Jetskis, waterskis and flyboards',
  HouseboatsAndOvernighters: 'Houseboats and Overnighters',
  ToursLessonsAndDiving: 'Tours, lessons and diving',
  BoardsAndPaddles: 'Boards and Paddles',
  FerriesAndTaxis: 'Ferries and Taxis',
};

export const categoriesEnum = generateEnumArrayFromObject(categories);

export const modelNamesEnum = generateEnumArrayFromObject(modelNames);
