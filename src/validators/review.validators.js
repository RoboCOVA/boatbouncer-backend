import { body, param } from 'express-validator';
import defaultValidators from './default.validator';

export const createReviewValidator = () => [
  body('bookingId').isMongoId().withMessage('Valid booking ID is required'),

  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('reviewMessage')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Review message must be less than 1000 characters'),
];

export const updateReviewValidator = () => [
  param('reviewId').isMongoId().withMessage('Valid review ID is required'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('reviewMessage')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Review message must be less than 1000 characters'),

  body().custom((value, { req }) => {
    // Ensure at least one field is being updated
    if (!req.body.rating && !req.body.reviewMessage) {
      throw new Error(
        'At least one field (rating or reviewMessage) must be provided for update'
      );
    }
    return true;
  }),
];

export const deleteReviewValidator = () => [
  param('reviewId').isMongoId().withMessage('Valid review ID is required'),
];

export const getReviewValidator = () => [
  param('reviewId').isMongoId().withMessage('Valid review ID is required'),
];
export const getBookingReviewValidator = () => [
  param('bookingId').isMongoId().withMessage('Valid booking ID is required'),

  defaultValidators.pageNo.optional(),
  defaultValidators.size.optional(),
];

export const getBoatReviewsValidator = () => [
  param('boatId').isMongoId().withMessage('Valid boat ID is required'),

  defaultValidators.pageNo.optional(),
  defaultValidators.size.optional(),
];

export const getUserReviewsValidator = () => [
  defaultValidators.pageNo.optional(),
  defaultValidators.size.optional(),
];
