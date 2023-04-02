import express from 'express';
import parseValidationResult from '../validators/errors.parser';
import {
  cancelBookingValidator,
  createBookingValidator,
  getBookingValidator,
  getBookingsValidator,
} from '../validators/booking.validators';
import {
  cancelBookingController,
  createBookingController,
  getBookingController,
  getBookingsController,
} from '../controller/booking';

const router = express.Router();

router.post(
  '/',
  createBookingValidator(),
  parseValidationResult,
  createBookingController
);

router.put(
  '/cancel/:bookId',
  cancelBookingValidator(),
  parseValidationResult,
  cancelBookingController
);

router.get(
  '/',
  getBookingsValidator(),
  parseValidationResult,
  getBookingsController
);

router.get(
  '/:bookId',
  getBookingValidator(),
  parseValidationResult,
  getBookingController
);

export default router;
