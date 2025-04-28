import express from 'express';
import {
  googleLoginCallbackController,
  googleLoginController,
} from '../controller/user';

const router = express.Router();

router.get('/google', googleLoginController);

router.get('/google/callback', googleLoginCallbackController);

export default router;
