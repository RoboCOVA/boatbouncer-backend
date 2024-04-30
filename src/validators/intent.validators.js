import { body, param } from 'express-validator';

export const createIntentValidator = () => [
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
