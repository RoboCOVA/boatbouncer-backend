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
  body('departureDate')
    .custom(customDateValidator)
    .withMessage('Departure date is required'),
  body('returnDate')
    .custom(customDateValidator)
    .withMessage('Return date is required')
    .bail()
    .custom((returnDate, { req }) => {
      const departure = new Date(req.body.departureDate);
      const ret = new Date(returnDate);
      if (ret <= departure) {
        throw new Error('Return date must be after departure date');
      }
      return true;
    }),
];

export const updateOffervalidator = () => [
  param('offerId').isMongoId().withMessage('Valid Offer id is required'),
  body('boatPrice').isNumeric().optional(),
  body('captainPrice').isNumeric().optional(),
  body('paymentServiceFee').isNumeric().optional(),
  body('localTax').isNumeric().optional(),
  body('departureDate').custom(customDateValidator).optional(),
  body('returnDate')
    .custom(customDateValidator)
    .optional()
    .bail()
    .custom((returnDate, { req }) => {
      if (req.body.departureDate) {
        const departure = new Date(req.body.departureDate);
        const ret = new Date(returnDate);
        if (ret <= departure) {
          throw new Error('Return date must be after departure date');
        }
      }
      return true;
    }),
];

export const acceptOfferValidator = () => [
  param('offerId').isMongoId().withMessage('Valid Offer Id is required'),
];

export const getOfferValidator = () => [
  param('offerId').isMongoId().withMessage('Valid Offer Id is required'),
];
