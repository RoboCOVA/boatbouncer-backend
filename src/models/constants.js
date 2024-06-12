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
  OTP: 'Otp',
};

export const categories = {
  Charters: 'Charters',
  Lessons: 'Lessons',
  IndividualRentals: 'Individual Rentals',
  Tours: 'Tours',
  Certifications: 'Certifications',
  FerriesAndWaterTaxis: 'Ferries and Water Taxis',
  PartyCruise: 'Party Cruises',
};

export const categoriesEnum = generateEnumArrayFromObject(categories);

export const modelNamesEnum = generateEnumArrayFromObject(modelNames);

export const subCategories = {
  PowerRIBPontoon: 'Power/RIB/Pontoon',
  Sailing: 'Sailing',
  HumanPowered: 'Human Powered',
  PWCJetski: 'PWC/Jetski',
  Fishing: 'Fishing',
  LuxuryYachts: 'Luxury/Yachts',
  HouseBoats: 'House Boats',
  EventVessels: 'Event Vessels',
};

export const subCategoriesEnum = generateEnumArrayFromObject(subCategories);
