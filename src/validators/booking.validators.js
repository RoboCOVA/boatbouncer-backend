import { body, param, query } from 'express-validator';
import { customDateValidator } from '../utils';
import {
  boatActivityTypeEnum,
  pricingType,
  pricingTypeEnum,
} from '../utils/constants';
import defaultValidators from './default.validator';

export const createBookingValidator = () => [
  body('boatId')
    .isMongoId()
    .withMessage('Invalid boat ID format. Must be a valid MongoDB ObjectId'),

  body('type')
    .isString()
    .withMessage('Booking type must be a string')
    .isIn(pricingTypeEnum)
    .withMessage(
      `Booking type must be one of: ${Object.values(pricingType).join(', ')}`
    ),

  body('duration.start')
    .custom(customDateValidator)
    .withMessage(
      'Valid start date and time in ISO 8601 format is required (e.g., "2023-05-01T09:00:00Z")'
    ),

  body('duration.end')
    .custom(customDateValidator)
    .withMessage(
      'Valid end date and time in ISO 8601 format is required (e.g., "2023-05-01T17:00:00Z")'
    ),

  body('renterPrice')
    .optional()
    .isNumeric()
    .withMessage('Renter price must be a valid number')
    .isFloat({ min: 0 })
    .withMessage('Renter price must be a positive number'),

  body('hours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Hours must be a positive number (can include decimals)'),

  body('days')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Days must be a positive number (can include decimals)'),

  body('noPeople')
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      'Number of people must be a whole number equal to or greater than 1'
    ),

  body('activityType')
    .optional()
    .isString()
    .withMessage('Activity type must be a string')
    .isIn(boatActivityTypeEnum)
    .withMessage(
      `Invalid activity type. Must be one of: ${boatActivityTypeEnum.join(
        ', '
      )}`
    ),
];

export const cancelBookingValidator = () => [
  param('bookId').isMongoId().withMessage('Valid Book id is required'),
  query('isRenter')
    .isBoolean()
    .custom((value) => value === 'true')
    .optional(),
];

export const getBookingsValidator = () => [
  query('isRenter')
    .isBoolean()
    .custom((value) => value === 'true')
    .optional(),
  defaultValidators.pageNo,
  defaultValidators.size,
];

export const getBookingValidator = () => [
  param('bookId').isMongoId().withMessage('Valid Book id is required'),
  query('isRenter')
    .isBoolean()
    .custom((value) => value === 'true')
    .optional(),
];

export const getCanceledBookingsValidator = () => [
  query('as')
    .isString()
    .custom((value) => value === 'renter' || 'owner')
    .optional(),
];
