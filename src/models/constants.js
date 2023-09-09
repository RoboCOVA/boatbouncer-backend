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
  FAVORITES: 'Favorites',
};

export const categories = {
  PowerboatsPontoonsAndRIBs: 'Powerboats, pontoons and RIBs',
  Sailing: 'Sailing',
  LuxMotor: 'Luxury motor yachts and bigger groups',
  Fishing: 'Fishing',
  JetskisWaterFly: 'Jet Skis, Water Skis and fly boards',
  HouseboatsAndOvernighters: 'Houseboats and Overnighters',
  ToursLessonsAndDiving: 'Tours, lessons and diving',
  BoardsAndPaddles: 'Boards and Paddles',
  FerriesAndTaxis: 'Ferries and Taxis',
};

export const categoriesEnum = generateEnumArrayFromObject(categories);

export const modelNamesEnum = generateEnumArrayFromObject(modelNames);

export const subCategories = {
  RIB: 'RIB',
  Airboat: 'Airboat',
  ElectricBoat: 'Electric Boat',
  Power: 'Power',
  PowerboatLessons: 'Powerboat Lessons',
};

export const subCategoriesEnum = generateEnumArrayFromObject(subCategories);
