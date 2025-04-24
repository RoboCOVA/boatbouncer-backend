import { body, param } from 'express-validator';
import {
  boatActivityTypeEnum,
  boatFeatures,
  boatStatusEnum,
  boatTypeEnum,
} from '../utils/constants';
import defaultValidators from './default.validator';

// ==================== CREATE VALIDATORS ====================

const createBaseBoatValidator = () => [
  body('boatName')
    .isString()
    .withMessage('boat Name is required')
    .isLength({ max: 100 })
    .withMessage('boat Name must be less than 100 characters'),

  body('description')
    .isString()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),

  body('address')
    .optional()
    .isString()
    .withMessage('Address should be a valid string')
    .isLength({ max: 255 })
    .withMessage('Address must be less than 255 characters'),

  body('location')
    .optional()
    .custom((value) => {
      if (value) {
        if (!value.address || typeof value.address !== 'string') {
          throw new Error(
            'Location address is required and should be a string'
          );
        }
        if (value.city && typeof value.city !== 'string') {
          throw new Error('Location city should be a string');
        }
        if (value.state && typeof value.state !== 'string') {
          throw new Error('Location state should be a string');
        }
        if (value.zipCode && typeof value.zipCode !== 'string') {
          throw new Error('Location zip code should be a string');
        }
      }
      return true;
    }),

  body('maxPassengers')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Max Passengers should be an integer between 1 and 1000'),

  body('imageUrls')
    .isArray({ min: 1, max: 10 })
    .withMessage('Must provide between 1-10 image URLs'),

  body('imageUrls.*').isURL().withMessage('Each image URL must be a valid URL'),

  body('latLng')
    .optional()
    .custom((value) => {
      if (value) {
        if (
          typeof value.latitude !== 'number' ||
          typeof value.longitude !== 'number'
        ) {
          throw new Error(
            'LatLng must contain latitude and longitude as numbers'
          );
        }
        if (value.latitude < -90 || value.latitude > 90) {
          throw new Error('Latitude must be between -90 and 90');
        }
        if (value.longitude < -180 || value.longitude > 180) {
          throw new Error('Longitude must be between -180 and 180');
        }
        if (value.elevation && typeof value.elevation !== 'number') {
          throw new Error('Elevation must be a number if provided');
        }
      }
      return true;
    }),
];

const createActivityBoatValidator = () => [
  body('activityType')
    .isIn(boatActivityTypeEnum)
    .withMessage(
      `Activity Type must be one of: ${boatActivityTypeEnum.join(', ')}`
    ),

  body('pricing').isObject().withMessage('Pricing must be an object'),

  body('pricing.perPerson')
    .isFloat({ min: 0 })
    .withMessage('Per person price must be a positive number'),

  body('pricing.discountPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount percentage must be between 0-100'),

  body('pricing.minPeopleForDiscount')
    .optional()
    .isInt({ min: 2 })
    .withMessage('Minimum people for discount must be at least 2'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),

  body('features.*')
    .isIn(Object.values(boatFeatures))
    .withMessage(
      `Invalid feature. Valid features are: ${Object.values(boatFeatures).join(
        ', '
      )}`
    ),
];

const createRentalBoatValidator = () => [
  body('boatType')
    .isIn(boatTypeEnum)
    .withMessage(`Boat Type must be one of: ${boatTypeEnum.join(', ')}`),

  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900-${new Date().getFullYear() + 1}`),

  body('manufacturer')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Manufacturer must be less than 100 characters'),

  body('model')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Model must be less than 100 characters'),

  body('pricing').isObject().withMessage('Pricing must be an object'),

  body('pricing.perDay')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Per day price must be a positive number'),

  body('pricing.perHour')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Per hour price must be a positive number'),

  body('pricing.dayDiscount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Day discount must be between 0-100'),

  body('pricing.hourDiscount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Hour discount must be between 0-100'),

  body('pricing.minDaysForDiscount')
    .optional()
    .isInt({ min: 2 })
    .withMessage('Minimum days for discount must be at least 2'),

  body('pricing.minHours')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum hours must be at least 1'),

  body('amenities')
    .optional()
    .isObject()
    .withMessage('Amenities must be an object'),

  body('amenities.captained')
    .optional()
    .isBoolean()
    .withMessage('Captained must be a boolean'),

  body('amenities.waterToys')
    .optional()
    .isBoolean()
    .withMessage('Water toys must be a boolean'),

  body('amenities.towable')
    .optional()
    .isBoolean()
    .withMessage('Towable must be a boolean'),

  body('amenities.deliverable')
    .optional()
    .isBoolean()
    .withMessage('Deliverable must be a boolean'),

  body('amenities.bathroom')
    .optional()
    .isBoolean()
    .withMessage('Bathroom must be a boolean'),

  body('amenities.anchor')
    .optional()
    .isBoolean()
    .withMessage('Anchor must be a boolean'),

  body('amenities.additionalAmenities')
    .optional()
    .isArray()
    .withMessage('Additional amenities must be an array'),

  body('amenities.additionalAmenities.*')
    .isString()
    .isLength({ max: 100 })
    .withMessage(
      'Each additional amenity must be a string less than 100 characters'
    ),
];

export const createBoatValidator = () => [
  ...createBaseBoatValidator(),

  body('listingType')
    .isString()
    .withMessage('listingType must be a string')
    .isIn(['rental', 'activity'])
    .withMessage('Ulisting Type  must be either "rental" or "activity"'),

  body('listingType').custom((value) => {
    if (value === 'activity') return createActivityBoatValidator();
    return createRentalBoatValidator();
  }),
];

// ==================== UPDATE VALIDATORS ====================

const updateBaseBoatValidator = () => [
  body('boatName')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('boat Name must be less than 100 characters'),

  body('description')
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),

  body('address')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Address must be less than 255 characters'),

  body('location')
    .optional()
    .custom((value) => {
      if (value) {
        if (value.address && typeof value.address !== 'string') {
          throw new Error('Location address should be a string');
        }
        if (value.city && typeof value.city !== 'string') {
          throw new Error('Location city should be a string');
        }
        if (value.state && typeof value.state !== 'string') {
          throw new Error('Location state should be a string');
        }
        if (value.zipCode && typeof value.zipCode !== 'string') {
          throw new Error('Location zip code should be a string');
        }
      }
      return true;
    }),

  body('maxPassengers')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Max Passengers should be an integer between 1 and 1000'),

  body('imageUrls')
    .optional()
    .isArray({ min: 1, max: 10 })
    .withMessage('Must provide between 1-10 image URLs'),

  body('imageUrls.*')
    .optional()
    .isURL()
    .withMessage('Each image URL must be a valid URL'),

  body('latLng')
    .optional()
    .custom((value) => {
      if (value) {
        if (
          typeof value.latitude !== 'number' ||
          typeof value.longitude !== 'number'
        ) {
          throw new Error(
            'LatLng must contain latitude and longitude as numbers'
          );
        }
        if (value.latitude < -90 || value.latitude > 90) {
          throw new Error('Latitude must be between -90 and 90');
        }
        if (value.longitude < -180 || value.longitude > 180) {
          throw new Error('Longitude must be between -180 and 180');
        }
        if (value.elevation && typeof value.elevation !== 'number') {
          throw new Error('Elevation must be a number if provided');
        }
      }
      return true;
    }),
];

const updateActivityBoatValidator = () => [
  body('activityType')
    .optional()
    .isIn(boatActivityTypeEnum)
    .withMessage(
      `Activity Type must be one of: ${boatActivityTypeEnum.join(', ')}`
    ),

  body('pricing')
    .optional()
    .isObject()
    .withMessage('Pricing must be an object'),

  body('pricing.perPerson')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Per person price must be a positive number'),

  body('pricing.discountPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount percentage must be between 0-100'),

  body('pricing.minPeopleForDiscount')
    .optional()
    .isInt({ min: 2 })
    .withMessage('Minimum people for discount must be at least 2'),

  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),

  body('features.*')
    .isIn(Object.values(boatFeatures))
    .withMessage(
      `Invalid feature. Valid features are: ${Object.values(boatFeatures).join(
        ', '
      )}`
    ),
];

const updateRentalBoatValidator = () => [
  body('boatType')
    .optional()
    .isIn(boatTypeEnum)
    .withMessage(`Boat Type must be one of: ${boatTypeEnum.join(', ')}`),

  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900-${new Date().getFullYear() + 1}`),

  body('manufacturer')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Manufacturer must be less than 100 characters'),

  body('model')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Model must be less than 100 characters'),

  body('pricing')
    .optional()
    .isObject()
    .withMessage('Pricing must be an object'),

  body('pricing.perDay')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Per day price must be a positive number'),

  body('pricing.perHour')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Per hour price must be a positive number'),

  body('pricing.dayDiscount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Day discount must be between 0-100'),

  body('pricing.hourDiscount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Hour discount must be between 0-100'),

  body('pricing.minDaysForDiscount')
    .optional()
    .isInt({ min: 2 })
    .withMessage('Minimum days for discount must be at least 2'),

  body('pricing.minHours')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum hours must be at least 1'),

  body('amenities')
    .optional()
    .isObject()
    .withMessage('Amenities must be an object'),

  body('amenities.captained')
    .optional()
    .isBoolean()
    .withMessage('Captained must be a boolean'),

  body('amenities.waterToys')
    .optional()
    .isBoolean()
    .withMessage('Water toys must be a boolean'),

  body('amenities.towable')
    .optional()
    .isBoolean()
    .withMessage('Towable must be a boolean'),

  body('amenities.deliverable')
    .optional()
    .isBoolean()
    .withMessage('Deliverable must be a boolean'),

  body('amenities.bathroom')
    .optional()
    .isBoolean()
    .withMessage('Bathroom must be a boolean'),

  body('amenities.anchor')
    .optional()
    .isBoolean()
    .withMessage('Anchor must be a boolean'),

  body('amenities.additionalAmenities')
    .optional()
    .isArray()
    .withMessage('Additional amenities must be an array'),

  body('amenities.additionalAmenities.*')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage(
      'Each additional amenity must be a string less than 100 characters'
    ),
];

export const updateBoatValidator = () => [
  ...updateBaseBoatValidator(),

  body('listingType')
    .isString()
    .withMessage('listingType must be a string')
    .isIn(['rental', 'activity'])
    .withMessage('Ulisting Type  must be either "rental" or "activity"'),

  body('status').isString().isIn(boatStatusEnum).optional(),

  body('listingType').custom((value) => {
    if (value === 'activity') return updateActivityBoatValidator();
    return updateRentalBoatValidator();
  }),
];
export const getBoatValidator = () => [
  param('boatId').isMongoId().withMessage('Valid Boat id is required'),
];

export const getBoatsValidator = () => [
  defaultValidators.pageNo,
  defaultValidators.size,
];

// export const updateBoatsValidator = () => [
//   param('boatId').isMongoId().withMessage('Valid Boat id is required'),
//   body('boatName').isString().optional(),
//   body('boatType').isString().optional(),
//   body('description').isString().optional(),
//   body('manufacturer').isString().optional(),
//   body('model').isString().optional(),
//   body('year').isNumeric().optional(),
//   body('length').isNumeric().optional(),
//   body('amenities').isArray().optional(),
//   body('amenities.*').isString().optional(),
//   body('imageUrls').isArray().optional(),
//   body('imageUrls.*').isString().optional(),
//   body('location.address').isString().optional(),
//   body('location.city').isString().optional(),
//   body('location.state').isString().optional(),
//   body('location.zipCode').isString().optional(),
//   body('latLng.latitude').isNumeric().optional(),
//   body('latLng.longitude').isNumeric().optional(),
//   body('category').isArray().optional(),
//   body('currency').isString().optional(),
//   body('subCategory.*').isString().optional(),
//   body('features').isArray().optional(),
//   body('features.*').isString().optional(),
//   body('securityAllowance').isString().optional(),
//   body('pricing').isArray().optional(),
//   body('pricing.*.type').isString().isIn(pricingTypeEnum).optional(),
//   body('pricing.*.min').isNumeric().optional(),
//   body('cancelationPolicy.refund').isNumeric().optional(),
//   body('cancelationPolicy.priorHours').isNumeric().optional(),
//   body('captained').isBoolean().optional(),
// ];

export const deleteBoatsValidator = () => [
  param('boatId').isMongoId().optional(),
];

export const addToFavoriteValidator = () => [param('boatId').isMongoId()];

export const getBoatListingValidator = () => [
  defaultValidators.pageNo,
  defaultValidators.size,
];
