import express from 'express';
import parseValidationResult from '../validators/errors.parser';
import {
  cancelBookingValidator,
  createBookingValidator,
  getBookingValidator,
  getBookingsValidator,
  getCanceledBookingsValidator,
} from '../validators/booking.validators';
import {
  cancelBookingController,
  createBookingController,
  getBookingController,
  getBookingsController,
  getCanceledBookingsController,
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

// Get all canceled bookings
router.get(
  '/canceled',
  getCanceledBookingsValidator(),
  parseValidationResult,
  getCanceledBookingsController
);

router.get(
  '/:bookId',
  getBookingValidator(),
  parseValidationResult,
  getBookingController
);

export default router;
