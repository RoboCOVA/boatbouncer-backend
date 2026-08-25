import { body, query } from 'express-validator';
import { cleanPhoneNumber, validPhoneFormat } from '../utils';

const defaultValidators = {
  phoneNumber: body('phoneNumber')
    .custom(validPhoneFormat)
    .withMessage('Provide a valid phone number')
    .customSanitizer(cleanPhoneNumber),
  queryPhoneNumber: query('phoneNumber')
    .custom(validPhoneFormat)
    .withMessage('Provide a valid phone number')
    .customSanitizer(cleanPhoneNumber),
  /**
   * Bounded, not merely integral: `getPaginationValues` computes
   * `skip = limit * (page - 1)`, so `?pageNo=-5` produced a negative $skip and
   * Mongo threw. The size cap keeps a single request from asking for the whole
   * collection.
   */
  pageNo: query('pageNo')
    .optional()
    .isInt({ min: 1 })
    .withMessage('pageNo must be 1 or greater'),
  size: query('size')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('size must be between 1 and 100'),
};

export default defaultValidators;
