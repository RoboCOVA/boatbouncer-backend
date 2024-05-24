import { body, param, query } from 'express-validator';
import { pricingType } from '../utils/constants';
import { customDateValidator } from '../utils';
import defaultValidators from './default.validator';

export const createBookingValidator = () => [
  body('boatId').isMongoId().withMessage('Valid Boat id is required'),
  body('type').isString().isIn([pricingType.PER_HOUR, pricingType.PER_DAY]),
  body('duration.start')
    .custom(customDateValidator)
    .withMessage('Start time is required'),
  body('duration.end')
    .custom(customDateValidator)
    .withMessage('End time is required'),
  body('renterPrice').isNumeric().optional(),
  body('captainPrice').isNumeric().optional(),
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
  query('isRenter')
    .isBoolean()
    .custom((value) => value === 'true')
    .optional(),
];
