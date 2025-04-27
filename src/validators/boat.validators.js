import { body, param } from 'express-validator';
import {
  boatActivityTypeEnum,
  boatFeatures,
  boatStatusEnum,
  boatTypeEnum,
  currencyCodeEnum,
} from '../utils/constants';
import defaultValidators from './default.validator';

// ==================== CREATE VALIDATORS ====================

const createBaseBoatValidator = () => [
  body('boatName')
    .isString()
    .withMessage('boat Name is required')
    .isLength({ max: 100 })
    .withMessage('boat Name must be less than 100 characters'),

  body('securityAllowance')
    .isString()
    .withMessage('Deposite  is required')
    .isLength({ max: 100 })
    .withMessage('Deposite must be less than 100 characters'),

  body('currency')
    .isString()
    .optional()
    .isIn(currencyCodeEnum)
    .withMessage('Invalid currency')
    .optional(),

  body('description')
    .isString()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),

  body('address')
    .isString()
    .withMessage('Address should be a valid string')
    .isLength({ max: 255 })
    .withMessage('Address must be less than 255 characters'),

  body('location').custom((value) => {
    if (value) {
      if (!value.address || typeof value.address !== 'string') {
        throw new Error('Location address is required and should be a string');
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

  body('latLng').custom((value) => {
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

  body('cancelationPolicy')
    .isArray({ min: 1 })
    .withMessage('Cancellation policy must be a non-empty array'),

  body('cancelationPolicy.*.refund')
    .isNumeric()
    .withMessage('Each cancellation policy refund must be a number'),

  body('cancelationPolicy.*.priorHours')
    .isNumeric()
    .withMessage('Each cancellation policy priorHours must be a number'),
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
    .isArray()
    .withMessage('Discount percentage must be an array of discount objects'),

  body('pricing.discountPercentage.*.percentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Each discount percentage must be between 0-100'),

  body('pricing.discountPercentage.*.minPeople')
    .isInt({ min: 1 })
    .withMessage('Each discount must have at least 2 minimum people'),
];

const createRentalBoatValidator = () => [
  body('boatType')
    .isIn(boatTypeEnum)
    .withMessage(`Boat Type must be one of: ${boatTypeEnum.join(', ')}`),

  body('length')
    .optional()
    .isInt({ min: 0 })
    .withMessage('length  should be an integer minimum of 0'),

  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900-${new Date().getFullYear() + 1}`),

  body('manufacturer')
    .isString()
    .isLength({ max: 100 })
    .withMessage('Manufacturer must be less than 100 characters'),

  body('model')
    .isString()
    .isLength({ max: 100 })
    .withMessage('Model must be less than 100 characters'),

  body('pricing').isObject().withMessage('Pricing must be an object'),

  body('pricing.perDay')
    .isFloat({ min: 0 })
    .withMessage('Per day price must be a positive number'),

  body('pricing.perHour')
    .isFloat({ min: 0 })
    .withMessage('Per hour price must be a positive number'),

  body('pricing.dayDiscount')
    .isArray()
    .withMessage('Day discount must be an array of discount objects'),

  body('pricing.dayDiscount.*.discountPercentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Each day discount percentage must be between 0-100'),

  body('pricing.dayDiscount.*.minDaysForDiscount')
    .isInt({ min: 1 })
    .withMessage('Each day discount must have at least 2 minimum days'),

  body('pricing.minDays')
    .isInt({ min: 0 })
    .withMessage('Minimum days must be a non-negative integer'),

  body('pricing.hourDiscount')
    .isArray()
    .withMessage('Hour discount must be an array of discount objects'),

  body('pricing.hourDiscount.*.discountPercentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Each hour discount percentage must be between 0-100'),

  body('pricing.hourDiscount.*.minHoursForDiscount')
    .isInt({ min: 1 })
    .withMessage('Each hour discount must have at least 1 minimum hour'),

  body('pricing.minHours')
    .isInt({ min: 1 })
    .withMessage('Minimum hours must be at least 1'),

  body('features')
    .isArray()
    .withMessage('Features must be an array')
    .isIn(Object.values(boatFeatures))
    .withMessage(
      `Invalid feature. Valid features are: ${Object.values(boatFeatures).join(
        ', '
      )}`
    ),
];

export const createBoatValidator = () => [
  ...createBaseBoatValidator(),

  body('listingType')
    .isString()
    .withMessage('listingType must be a string')
    .isIn(['rental', 'activity'])
    .withMessage('listing Type  must be either "rental" or "activity"'),

  body().custom((value, { req }) => {
    if (req.body.listingType === 'activity') {
      return Promise.all(
        createActivityBoatValidator().map((validator) => validator.run(req))
      );
    }
    if (req.body.listingType === 'rental') {
      return Promise.all(
        createRentalBoatValidator().map((validator) => validator.run(req))
      );
    }
    return true;
  }),
];

// ==================== UPDATE VALIDATORS ====================

const updateBaseBoatValidator = () => [
  body('boatName')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('boat Name must be less than 100 characters'),

  body('securityAllowance')
    .optional()
    .isString()
    .withMessage('Deposite  is required')
    .isLength({ max: 100 })
    .withMessage('Deposite must be less than 100 characters'),

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
  body('cancelationPolicy')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Cancellation policy must be a non-empty array'),

  body('cancelationPolicy.*.refund')
    .optional()
    .isNumeric()
    .withMessage('Each cancellation policy refund must be a number'),

  body('cancelationPolicy.*.priorHours')
    .optional()
    .isNumeric()
    .withMessage('Each cancellation policy priorHours must be a number'),

  body('currency')
    .isString()
    .optional()
    .isIn(currencyCodeEnum)
    .withMessage('Invalid currency')
    .optional(),
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
    .isArray()
    .withMessage('Discount percentage must be an array of discount objects'),

  body('pricing.discountPercentage.*.percentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Each discount percentage must be between 0-100'),

  body('pricing.discountPercentage.*.minPeople')
    .isInt({ min: 1 })
    .withMessage('Each discount must have at least 2 minimum people'),
];

const updateRentalBoatValidator = () => [
  body('boatType')
    .optional()
    .isIn(boatTypeEnum)
    .withMessage(`Boat Type must be one of: ${boatTypeEnum.join(', ')}`),

  body('length')
    .optional()
    .isInt({ min: 0 })
    .withMessage('length  should be an integer minimum of 0'),

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
    .isArray()
    .withMessage('Day discount must be an array of discount objects'),

  body('pricing.dayDiscount.*.discountPercentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Each day discount percentage must be between 0-100'),

  body('pricing.dayDiscount.*.minDaysForDiscount')
    .isInt({ min: 1 })
    .withMessage('Each day discount must have at least 2 minimum days'),

  body('pricing.minDays')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum days must be a non-negative integer'),

  body('pricing.hourDiscount')
    .optional()
    .isArray()
    .withMessage('Hour discount must be an array of discount objects'),

  body('pricing.hourDiscount.*.discountPercentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Each hour discount percentage must be between 0-100'),

  body('pricing.hourDiscount.*.minHoursForDiscount')
    .isInt({ min: 1 })
    .withMessage('Each hour discount must have at least 1 minimum hour'),

  body('pricing.minHours')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum hours must be at least 1'),

  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array')
    .isIn(Object.values(boatFeatures))
    .withMessage(
      `Invalid feature. Valid features are: ${Object.values(boatFeatures).join(
        ', '
      )}`
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

  body().custom((value, { req }) => {
    if (req.body.listingType === 'activity') {
      return Promise.all(
        updateActivityBoatValidator().map((validator) => validator.run(req))
      );
    }
    if (req.body.listingType === 'rental') {
      return Promise.all(
        updateRentalBoatValidator().map((validator) => validator.run(req))
      );
    }
    return true;
  }),
];

export const getBoatValidator = () => [
  param('boatId').isMongoId().withMessage('Valid Boat id is required'),
];

export const getBoatsValidator = () => [
  defaultValidators.pageNo,
  defaultValidators.size,
];

export const deleteBoatsValidator = () => [
  param('boatId').isMongoId().optional(),
];

export const addToFavoriteValidator = () => [param('boatId').isMongoId()];

export const getBoatListingValidator = () => [
  defaultValidators.pageNo,
  defaultValidators.size,
];
