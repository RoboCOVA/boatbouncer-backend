import { body, param } from 'express-validator';
import { customDateValidator } from '../utils';

export const createOffervalidator = () => [
  body('bookId').isMongoId().withMessage('Valid Book id is required'),
  body('boatPrice').isNumeric().withMessage('Boat Price is required'),
  body('captainPrice').isNumeric().optional(),
  // body('paymentServiceFee')
  //   .isNumeric()
  //   .withMessage('Payment Service Fee is required'),
  body('localTax').isNumeric().withMessage('Local Tax is required'),
  body('returnDate')
    .custom(customDateValidator)
    .withMessage('Start time is required'),
  body('departureDate')
    .custom(customDateValidator)
    .withMessage('Start time is required'),
];

export const updateOffervalidator = () => [
  param('offerId').isMongoId().withMessage('Valid Book id is required'),
  body('boatPrice').isNumeric().optional(),
  body('captainPrice').isNumeric().optional(),
  body('paymentServiceFee').isNumeric().optional(),
  body('localTax').isNumeric().optional(),
  body('departureDate').custom(customDateValidator).optional(),
  body('returnDate').custom(customDateValidator).optional(),
];

export const acceptOfferValidator = () => [
  param('offerId').isMongoId().withMessage('Valid Offer Id is required'),
];

export const getOfferValidator = () => [
  param('offerId').isMongoId().withMessage('Valid Offer Id is required'),
];
