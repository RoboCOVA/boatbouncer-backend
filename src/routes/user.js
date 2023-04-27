import express from 'express';
import {
  attachPaymentMethodController,
  createStripeAccountController,
  createUserController,
  loginController,
  sendSmsController,
  updateUserController,
  verifyUserController,
} from '../controller/user';
import parseValidationResult from '../validators/errors.parser';
import {
  attachPaymentMethodValidator,
  createUserValidator,
  loginValidator,
  sendSmsValidator,
  updateUserValidator,
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
  '/sendSms',
  sendSmsValidator(),
  parseValidationResult,
  sendSmsController
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

export default router;
