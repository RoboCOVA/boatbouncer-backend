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
  pageNo: query('pageNo').optional().isInt(),
  size: query('size').optional().isInt(),
};

export default defaultValidators;
