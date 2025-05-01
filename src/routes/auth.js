import express from 'express';
import { authenticateJwt } from '../controller/authenticate';
import {
  facebookLoginCallbackController,
  facebookLoginController,
  facebookLoginGetAccountController,
  googleLoginCallbackController,
  googleLoginController,
  googleLoginGetAccountController,
  setLocalPasswordController,
} from '../controller/user';
import {
  getFacebookAccoutnUserValidator,
  getGoogleAccoutnUserValidator,
  setLocalPasswordValidator,
} from '../validators/user.validators';

import parseValidationResult from '../validators/errors.parser';

const router = express.Router();

router.get('/google', googleLoginController);

router.get('/google/callback', googleLoginCallbackController);

router.get('/facebook', facebookLoginController);

router.get('/facebook/callback', facebookLoginCallbackController);

router.get(
  '/google/success/:googleId',
  getGoogleAccoutnUserValidator(),
  googleLoginGetAccountController
);

router.get(
  '/facebook/success/:facebookId',
  getFacebookAccoutnUserValidator(),
  facebookLoginGetAccountController
);

router.patch(
  '/local',
  authenticateJwt,
  setLocalPasswordValidator(),
  parseValidationResult,
  setLocalPasswordController
);

export default router;
