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
  REVIEW: 'review',
  REVIEWS: 'review',
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

/**
 * Fields safe to expose when a user is populated into someone else's document
 * — a booking counterparty, a review author.
 *
 * Deliberately an allow-list. The blacklists this replaced named `-password`
 * and the Stripe fields and so leaked everything added since: `session`, the
 * permanent OAuth provider ids (which /auth/update accepts as proof of
 * identity), and `deviceTokens`.
 */
export const populatedUserFields = [
  '_id',
  'firstName',
  'lastName',
  'userName',
  'email',
  'phoneNumber',
  'profilePicture',
  'address',
  'city',
  'state',
  'zipCode',
  'verified',
  'authProviders',
  'createdAt',
].join(' ');
