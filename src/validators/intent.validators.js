import { body, param } from 'express-validator';

export const createIntentValidator = () => [
  body('paymentMethod.card.number')
    .isNumeric()
    .withMessage('Valid Card Number is required'),
  body('paymentMethod.card.exp_month')
    .isNumeric()
    .withMessage('Valid Card Expiration Month is required'),
  body('paymentMethod.card.exp_year')
    .isNumeric()
    .withMessage('Valid Card Expiration Year is required'),
  body('paymentMethod.card.cvc')
    .isNumeric()
    .withMessage('Valid Card CVC is required'),
  body('currency').optional(),
  body('description').isString().withMessage('Description is required'),
  body('metadata.offerId')
    .isMongoId()
    .withMessage('Valid Offer Id is required'),
];

export const confirmIntentValidator = () => [
  param('intentId').isMongoId().withMessage('Valid Intent Id is required'),
];

export const cancelIntentValidator = () => [
  param('intentId').isMongoId().withMessage('Valid Intent Id is required'),
];
