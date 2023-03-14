import express from 'express';
import {
  createUserController,
  sendSmsController,
  updateUserController,
  verifyUserController,
} from '../controller/user';
import parseValidationResult from '../validators/errors.parser';
import {
  createUserValidator,
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

router.post(
  '/update',
  updateUserValidator(),
  parseValidationResult,
  updateUserController
);

export default router;
