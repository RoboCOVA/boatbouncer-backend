import express from 'express';
import { authenticateJwt } from '../controller/authenticate';
import {
  googleLoginCallbackController,
  googleLoginController,
  googleLoginGetAccountController,
  setLocalPasswordController,
} from '../controller/user';
import {
  getGoogleAccoutnUserValidator,
  setLocalPasswordValidator,
} from '../validators/user.validators';

import parseValidationResult from '../validators/errors.parser';

const router = express.Router();

router.get('/google', googleLoginController);

router.get('/google/callback', googleLoginCallbackController);

router.get(
  '/google/success/:googleId',
  authenticateJwt,
  getGoogleAccoutnUserValidator(),
  googleLoginGetAccountController
);

router.patch(
  '/local',
  authenticateJwt,
  setLocalPasswordValidator(),
  parseValidationResult,
  setLocalPasswordController
);

export default router;
