import { generateEnumArrayFromObject } from '.';

export const strongPasswordRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);

export const currencyCode = {
  USD: 'USD',
  CAD: 'CAD',
  EUR: 'EUR',
  AED: 'AED',
  AFN: 'AFN',
  ALL: 'ALL',
  AMD: 'AMD',
  ARS: 'ARS',
  AUD: 'AUD',
  AZN: 'AZN',
  BAM: 'BAM',
  BDT: 'BDT',
  BGN: 'BGN',
  BHD: 'BHD',
  BIF: 'BIF',
  BND: 'BND',
  BOB: 'BOB',
  BRL: 'BRL',
  BWP: 'BWP',
  BYN: 'BYN',
  BZD: 'BZD',
  CDF: 'CDF',
  CHF: 'CHF',
  CLP: 'CLP',
  CNY: 'CNY',
  COP: 'COP',
  CRC: 'CRC',
  CVE: 'CVE',
  CZK: 'CZK',
  DJF: 'DJF',
  DKK: 'DKK',
  DOP: 'DOP',
  DZD: 'DZD',
  EEK: 'EEK',
  EGP: 'EGP',
  ERN: 'ERN',
  ETB: 'ETB',
  GBP: 'GBP',
  GEL: 'GEL',
  GHS: 'GHS',
  GNF: 'GNF',
  GTQ: 'GTQ',
  HKD: 'HKD',
  HNL: 'HNL',
  HRK: 'HRK',
  HUF: 'HUF',
  IDR: 'IDR',
  ILS: 'ILS',
  INR: 'INR',
  IQD: 'IQD',
  IRR: 'IRR',
  ISK: 'ISK',
  JMD: 'JMD',
  JOD: 'JOD',
  JPY: 'JPY',
  KES: 'KES',
  KHR: 'KHR',
  KMF: 'KMF',
  KRW: 'KRW',
  KWD: 'KWD',
  KZT: 'KZT',
  LBP: 'LBP',
  LKR: 'LKR',
  LTL: 'LTL',
  LVL: 'LVL',
  LYD: 'LYD',
  MAD: 'MAD',
  MDL: 'MDL',
  MGA: 'MGA',
  MKD: 'MKD',
  MMK: 'MMK',
  MOP: 'MOP',
  MUR: 'MUR',
  MXN: 'MXN',
  MYR: 'MYR',
  MZN: 'MZN',
  NAD: 'NAD',
  NGN: 'NGN',
  NIO: 'NIO',
  NOK: 'NOK',
  NPR: 'NPR',
  NZD: 'NZD',
  OMR: 'OMR',
  PAB: 'PAB',
  PEN: 'PEN',
  PHP: 'PHP',
  PKR: 'PKR',
  PLN: 'PLN',
  PYG: 'PYG',
  QAR: 'QAR',
  RON: 'RON',
  RSD: 'RSD',
  RUB: 'RUB',
  RWF: 'RWF',
  SAR: 'SAR',
  SDG: 'SDG',
  SEK: 'SEK',
  SGD: 'SGD',
  SOS: 'SOS',
  SYP: 'SYP',
  THB: 'THB',
  TND: 'TND',
  TOP: 'TOP',
  TRY: 'TRY',
  TTD: 'TTD',
  TWD: 'TWD',
  TZS: 'TZS',
  UAH: 'UAH',
  UGX: 'UGX',
  UYU: 'UYU',
  UZS: 'UZS',
  VEF: 'VEF',
  VND: 'VND',
  XAF: 'XAF',
  XOF: 'XOF',
  YER: 'YER',
  ZAR: 'ZAR',
  ZMK: 'ZMK',
  ZWL: 'ZWL',
};

export const currencyCodeEnum = generateEnumArrayFromObject(currencyCode);

export const pricingType = {
  PER_HOUR: 'Per_Hour',
  PER_DAY: 'Per_Day',
  // PER_NIGHT: 'Per_Night',
  // PER_WEEK: 'Per_Week',
  PER_PERSON: 'Per_Person',
};

export const pricingTypeEnum = generateEnumArrayFromObject(pricingType);
export const publicResources = {
  BOAT: 'BOAT',
  USER: 'USER',
};

export const publicResourcesEnum = generateEnumArrayFromObject(publicResources);

// export const boatFeatures = {
//   BluetoothCapable: 'Bluetooth capable',
//   PremiumSoundSystem: 'Premium sound system',
//   Bathroom: 'Bathroom',
//   Grill: 'Grill',
//   Kitchen: 'Kitchen',
//   Refrigerator: 'Refrigerator',
//   SwimLadder: 'Swim ladder',
//   SunBed: 'Sun bed',
//   BiminiShade: 'Bimini / shade',
//   Heater: 'Heater',
//   AC: 'A/C',
//   FishFinder: 'Fish finder',
//   FishingRodHolders: 'Fishing rod holders',
//   LiveWell: 'Live well',
//   TrollingMotor: 'Trolling motor',
//   Cabin: 'Cabin',
//   WaterSportsCapable: 'Water sports capable',
//   Wifi: 'Wifi',
//   Shower: 'Shower',
//   RgbLights: 'RGB lights',
// };

// export const boatFeaturesEnum = generateEnumArrayFromObject(boatFeatures);

export const boatStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  DELETED: 'deleted',
};

export const boatStatusEnum = generateEnumArrayFromObject(boatStatus);

export const bookingStatus = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const boatListTypes = {
  RENTAL: 'rental',
  ACTIVITY: 'activity',
};

export const boatListingTypeEnum = generateEnumArrayFromObject(boatListTypes);

const boatTypes = {
  YACHT: 'Yacht',
  MOTORIZED_BOAT: 'Motorized Boat',
  NON_MOTORIZED_BOAT: 'Non-Motorized Boat',
  SAIL_BOAT: 'Sail Boat',
  PWC: 'PWC',
};
export const boatTypeEnum = generateEnumArrayFromObject(boatTypes);

export const boatActivities = {
  LESSON: 'Lesson',
  TOUR_GUIDE: 'Tour/Guide',
  CHARTER: 'Cruise/Charter',
  EXPERIENCE: 'Experiences',
  OTHER: 'Other',
};
export const boatActivityTypeEnum = generateEnumArrayFromObject(boatActivities);

export const boatFeatures = {
  CAPTAINED: 'Captained',
  WATER_TOYS: 'Water Toys',
  TOWABLE: 'Can be Towed on Trailer',
  DELIVERABLE: 'Deliverable',
  BATHROOM: 'Bathroom',
  ANCHOR: 'Anchor',
  ADDITIONAL_AMENITIES: 'Additional Amenities',
};

export const boatFeaturesEnum = generateEnumArrayFromObject(boatFeatures);

export const bookingStatusEnum = generateEnumArrayFromObject(bookingStatus);

export const offerStatus = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  PROCESSING: 'Processing',
};

export const offerStatusEnum = generateEnumArrayFromObject(offerStatus);

export const intentStatus = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const intentStatusEnum = generateEnumArrayFromObject(intentStatus);
