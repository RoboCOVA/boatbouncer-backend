import express from 'express';
import { authenticateJwt } from '../controller/authenticate';
import {
  attachPaymentMethodController,
  changeForgottenPasswordController,
  createStripeAccountController,
  createUserController,
  deleteUserAccount,
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
  updateUserProfilePictureController,
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
  updateUserProfilePictureValidator,
  updateUserValidator,
  validateResetOTPValidator,
  verifyUserValidator,
} from '../validators/user.validators';

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

router.put(
  '/updateProfilePicture/:userId',
  updateUserProfilePictureValidator(),
  parseValidationResult,
  updateUserProfilePictureController
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

router.delete('/account', authenticateJwt, deleteUserAccount);

export default router;
