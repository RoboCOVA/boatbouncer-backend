import express from 'express';
import {
  attachPaymentMethodController,
  changeForgottenPasswordController,
  createStripeAccountController,
  createUserController,
  detachMethodController,
  forgetPasswordController,
  formValidatedController,
  getCurrentUserController,
  getPaymentMethodController,
  loginController,
  resendSmsController,
  sendSmsController,
  updateMethodController,
  updateUserController,
  verifyUserController,
} from '../controller/user';
import parseValidationResult from '../validators/errors.parser';
import {
  attachPaymentMethodValidator,
  createUserValidator,
  detachMethodValidator,
  forgotPasswordValidator,
  loginValidator,
  resetPasswordValidator,
  sendSmsValidator,
  updateMethodValidator,
  updateUserValidator,
  validateResetOTPValidator,
  verifyUserValidator,
} from '../validators/user.validators';
import { authenticateJwt } from '../controller/authenticate';

const router = express.Router();

router.post(
  '/createAccount',
  createUserValidator(),
  parseValidationResult,
  createUserController
);

router.post(
  '/validateUserForm',
  createUserValidator(),
  parseValidationResult,
  formValidatedController
);

router.post(
  '/sendSms',
  sendSmsValidator(),
  parseValidationResult,
  sendSmsController
);

router.post(
  '/resendSms',
  sendSmsValidator(),
  parseValidationResult,
  resendSmsController
);

router.post(
  '/forgetPassword',
  forgotPasswordValidator(),
  parseValidationResult,
  forgetPasswordController
);

router.post(
  '/validateResetOTP',
  validateResetOTPValidator(),
  parseValidationResult,
  verifyUserController
);

router.post(
  '/changePassword',
  resetPasswordValidator(),
  parseValidationResult,
  changeForgottenPasswordController
);

router.post(
  '/otpVerify',
  verifyUserValidator(),
  parseValidationResult,
  verifyUserController
);

router.put(
  '/:userId',
  updateUserValidator(),
  parseValidationResult,
  updateUserController
);

router.post('/login', loginValidator(), parseValidationResult, loginController);

router.post('/stripAccount', authenticateJwt, createStripeAccountController);

router.post(
  '/attachMethod/:methodId',
  authenticateJwt,
  attachPaymentMethodValidator(),
  parseValidationResult,
  attachPaymentMethodController
);

router.get('/getMethods', authenticateJwt, getPaymentMethodController);

router.post(
  '/detachMethod/:methodId',
  authenticateJwt,
  detachMethodValidator(),
  parseValidationResult,
  detachMethodController
);

router.post(
  '/updateMethod/:methodId',
  authenticateJwt,
  updateMethodValidator(),
  parseValidationResult,
  updateMethodController
);

router.get('/current', authenticateJwt, getCurrentUserController);

export default router;
