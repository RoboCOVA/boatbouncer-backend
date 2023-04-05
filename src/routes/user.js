import express from 'express';
import {
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

export default router;
