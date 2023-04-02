import { body, param } from 'express-validator';

export const createOffervalidator = () => [
  body('bookId').isMongoId().withMessage('Valid Book id is required'),
  body('boatPrice').isNumeric().withMessage('Boat Price is required'),
  body('captainPrice').isNumeric().withMessage('Captain Price is required'),
  body('paymentServiceFee')
    .isNumeric()
    .withMessage('Payment Service Fee is required'),
  body('localTax').isNumeric().withMessage('Local Tax is required'),
];

export const udpateOffervalidator = () => [
  param('offerId').isMongoId().withMessage('Valid Book id is required'),
  body('boatPrice').isNumeric().optional(),
  body('captainPrice').isNumeric().optional(),
  body('paymentServiceFee').isNumeric().optional(),
  body('localTax').isNumeric().optional(),
];
