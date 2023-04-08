import express from 'express';
import {
  createStripeAccountController,
  createUserController,
  loginController,
  sendSmsController,
  updateUserController,
  verifyUserController,
} from '../controller/user';
import parseValidationResult from '../validators/errors.parser';
import {
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

export default router;
