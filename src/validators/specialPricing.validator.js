import { body, param } from 'express-validator';
import { specialPricingTypeEnum } from '../utils/constants';
import defaultValidators from './default.validator';
import { customDateValidator } from '../utils';

export const createSpecialPricingValidator = () => [
  body('boatId').isMongoId().withMessage('Valid boat ID is required'),

  body('type')
    .isString()
    .isIn(specialPricingTypeEnum)
    .withMessage('Type must be either "raise" or "discount"'),

  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),

  body('percent')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Percent must be between 0-100'),

  body('title')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),

  body('description')
    .isString()
    .isLength({ min: 1, max: 500 })
    .withMessage(
      'Description is required and must be less than 500 characters'
    ),

  body('startDate')
    .custom(customDateValidator)
    .withMessage('Start date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        // throw new Error('Start date must be in the future');
      }
      return true;
    }),

  body('endDate')
    .custom(customDateValidator)
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);

      console.log({
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
      });

      if (startDate > endDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  body().custom((value, { req }) => {
    const { amount, percent } = req.body;

    if (!amount && !percent) {
      throw new Error('Either amount or percent is required');
    }

    if (amount && percent) {
      throw new Error(
        'Only one of amount or percent can be provided, not both'
      );
    }

    return true;
  }),
];

// ==================== UPDATE VALIDATORS ====================

export const updateSpecialPricingValidator = () => [
  param('pricingId').isMongoId().withMessage('Valid pricing ID is required'),

  body('title')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be less than 100 characters'),

  body('description')
    .optional()
    .isString()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be less than 500 characters'),

  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),

  body('percent')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Percent must be between 0-100'),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Start date must be in the future');
      }
      return true;
    }),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (req.body.startDate) {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);

        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),

  body().custom((value, { req }) => {
    const { amount, percent } = req.body;

    if (amount && percent) {
      throw new Error(
        'Only one of amount or percent can be provided, not both'
      );
    }

    return true;
  }),
];

// ==================== GET/DELETE VALIDATORS ====================

export const getSpecialPricingValidator = () => [
  param('pricingId').isMongoId().withMessage('Valid pricing ID is required'),
];

export const getBoatSpecialPricingValidator = () => [
  param('boatId').isMongoId().withMessage('Valid boat ID is required'),
  defaultValidators.pageNo,
  defaultValidators.size,
];

export const deleteSpecialPricingValidator = () => [
  param('pricingId').isMongoId().withMessage('Valid pricing ID is required'),
];
