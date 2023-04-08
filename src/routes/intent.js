import express from 'express';
import {
  cancelPaymentIntentController,
  confirmPaymentIntentController,
  createIntentController,
  getPendingIntentsController,
} from '../controller/intent';
import parseValidationResult from '../validators/errors.parser';
import {
  cancelIntentValidator,
  confirmIntentValidator,
  createIntentValidator,
} from '../validators/intent.validators';

const router = express.Router();

router.post(
  '/',
  createIntentValidator(),
  parseValidationResult,
  createIntentController
);

router.put(
  '/confirm/:intentId',
  confirmIntentValidator(),
  parseValidationResult,
  confirmPaymentIntentController
);

router.put(
  '/cancel/:intentId',
  cancelIntentValidator(),
  parseValidationResult,
  cancelPaymentIntentController
);

router.get('/', getPendingIntentsController);

export default router;
