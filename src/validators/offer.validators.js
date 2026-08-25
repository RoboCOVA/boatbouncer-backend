import { body, param } from 'express-validator';
import { customDateValidator } from '../utils';

export const createOffervalidator = () => [
  body('bookId').isMongoId().withMessage('Valid Book id is required'),
  /**
   * `isNumeric()` alone accepts "-100" — these guard money moving between two
   * parties, so they are bounded rather than merely numeric.
   */
  body('boatPrice')
    .isFloat({ min: 0 })
    .withMessage('Boat Price must be a positive number'),
  body('captainPrice')
    .isFloat({ min: 0 })
    .optional()
    .withMessage('Captain Price cannot be negative'),
  // body('paymentServiceFee')
  //   .isFloat({ min: 0 })
  //   .withMessage('Payment Service Fee is required'),
  body('localTax')
    .isFloat({ min: 0 })
    .withMessage('Local Tax cannot be negative'),
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
  body('boatPrice')
    .isFloat({ min: 0 })
    .optional()
    .withMessage('Boat Price must be a positive number'),
  body('captainPrice')
    .isFloat({ min: 0 })
    .optional()
    .withMessage('Captain Price cannot be negative'),
  body('paymentServiceFee')
    .isFloat({ min: 0 })
    .optional()
    .withMessage('Payment Service Fee cannot be negative'),
  body('localTax')
    .isFloat({ min: 0 })
    .optional()
    .withMessage('Local Tax cannot be negative'),
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
