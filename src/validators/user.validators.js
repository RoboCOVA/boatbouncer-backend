import { body, param } from 'express-validator';
import { strongPasswordRegex } from '../utils/constants';
import defaultValidators from './default.validator';

export const createUserValidator = () => [
  body('firstName').isString().withMessage('First name is required'),
  body('lastName').isString().withMessage('Last name is required'),
  body('address').isString().optional(),
  body('city').isString().optional(),
  body('state').isString().optional(),
  body('zipCode').isString().optional(),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password')
    .isString()
    .isLength({ min: 8, max: 60 })
    .withMessage(
      'Password should be at least 8 characters and not greater than 60'
    )
    .withMessage((val) => strongPasswordRegex.test(val))
    .withMessage(
      'Password should contain a lower case letter, an upper case letter, a number and one of these symbols (!@#$%^&*).'
    ),
  defaultValidators.phoneNumber,
];

export const verifyUserValidator = () => [
  body('verificationCode')
    .isString()
    .withMessage('Valid verification code is required'),
  defaultValidators.phoneNumber,
];

export const sendSmsValidator = () => [
  body('recaptchaToken')
    .isString()
    .withMessage('Valid recaptchaToken is required'),
  defaultValidators.phoneNumber,
];

export const updateUserValidator = () => [
  param('userId').isMongoId().withMessage('User Id is required'),
  body('firstName').isString().optional(),
  body('lastName').isString().optional(),
  body('address').isString().optional(),
  body('city').isString().optional(),
  body('state').isString().optional(),
  body('zipCode').isString().optional(),
  body('email').isEmail().optional(),
  body('password')
    .isString()
    .isLength({ min: 8, max: 60 })
    .withMessage(
      'Password should be at least 8 cahracters and not greater than 60'
    )
    .withMessage((val) => strongPasswordRegex.test(val))
    .withMessage(
      'Password should contain a lower case letter, an upper case letter, a number and one of these symbols (!@#$%^&*).'
    )
    .optional(),
  body('oldPassword')
    .if((value, { req }) => req.body?.password)
    .notEmpty()
    .isString()
    .withMessage('Password is required'),

  defaultValidators.phoneNumber.optional(),
];

export const updateUserProfilePictureValidator = () => [
  param('userId').isMongoId().withMessage('User Id is required'),
  body('profilePicture')
    .isString()
    .withMessage('Profile Picture Url is required'),
];

export const loginValidator = () => [
  body('email').isEmail().withMessage('Email is required to login'),
  body('password').isString().withMessage('password is required'),
];

export const createStripeAccountValidator = () => [
  param('userId').isMongoId().withMessage('User Id is required'),
];

export const attachPaymentMethodValidator = () => [
  param('methodId').isString().withMessage('Payment Method Id is required'),
];

export const detachMethodValidator = () => [
  param('methodId').isString().withMessage('Payment Method Id is required'),
];

export const updateMethodValidator = () => [
  param('methodId').isString().withMessage('Payment Method Id is required'),
  body('metadata').isString().optional(),
  body('billingDetails.address').isString().withMessage(),
  body('billingDetails.email').isString().withMessage(),
  body('billingDetails.name').isString().withMessage(),
  body('billingDetails.phone').isString().withMessage(),
  body('card.exp_month').isInt().withMessage(),
  body('card.exp_year').isInt().withMessage(),
];

export const forgotPasswordValidator = () => [
  defaultValidators.phoneNumber,
  body('recaptchaToken')
    .isString()
    .withMessage('Valid recaptchaToken is required'),
];

export const validateResetOTPValidator = () => [
  body('verificationCode')
    .isString()
    .withMessage('Valid verification code is required'),
  defaultValidators.phoneNumber,
  body('encryption').isString().withMessage('Encryption Key required'),
];

export const resetPasswordValidator = () => [
  body('newPassword')
    .isString()
    .isLength({ min: 8, max: 60 })
    .withMessage(
      'Password should be at least 8 characters and not greater than 60'
    )
    .withMessage((val) => strongPasswordRegex.test(val))
    .withMessage(
      'Password should contain a lower case letter, an upper case letter, a number and one of these symbols (!@#$%^&*).'
    ),
  body('encryption').isString().withMessage('Encryption Key required'),
];

export const setLocalPasswordValidator = () => [
  body('password')
    .isString()
    .isLength({ min: 8, max: 60 })
    .withMessage(
      'Password should be at least 8 characters and not greater than 60'
    )
    .withMessage((val) => strongPasswordRegex.test(val))
    .withMessage(
      'Password should contain a lower case letter, an upper case letter, a number and one of these symbols (!@#$%^&*).'
    ),
];

export const getGoogleAccoutnUserValidator = () => [
  param('googleId')
    .isString()
    .withMessage('googleId must be included in param'),
];
export const getFacebookAccoutnUserValidator = () => [
  param('facebookId')
    .isString()
    .withMessage('googleId must be included in param'),
];
