import express from 'express';
import {
  createReviewController,
  deleteReviewController,
  getBoatReviewsController,
  getBookingReviewsController,
  getReviewController,
  getUserReviewsController,
  updateReviewController,
} from '../controller/review';
import parseValidationResult from '../validators/errors.parser';
import {
  createReviewValidator,
  deleteReviewValidator,
  getBoatReviewsValidator,
  getBookingReviewValidator,
  getReviewValidator,
  getUserReviewsValidator,
  updateReviewValidator,
} from '../validators/review.validators';
import { authenticateJwt } from '../controller/authenticate';

const router = express.Router();

// Create a new review
router.post(
  '/',
  authenticateJwt,
  createReviewValidator(),
  parseValidationResult,
  createReviewController
);

// Update a review
router.put(
  '/:reviewId',
  authenticateJwt,
  updateReviewValidator(),
  parseValidationResult,
  updateReviewController
);

// Delete a review
router.delete(
  '/:reviewId',
  authenticateJwt,
  deleteReviewValidator(),
  parseValidationResult,
  deleteReviewController
);

// Get reviews for a specific booking
router.get(
  '/booking/:bookingId',
  getBookingReviewValidator(),
  parseValidationResult,
  getBookingReviewsController
);

// Get all reviews for a boat
router.get(
  '/boat/:boatId',
  getBoatReviewsValidator(),
  parseValidationResult,
  getBoatReviewsController
);

// Get a specific review
router.get(
  '/:reviewId',
  getReviewValidator(),
  parseValidationResult,
  getReviewController
);

// Get all reviews by the current user
router.get(
  '/user/my-reviews',
  getUserReviewsValidator(),
  parseValidationResult,
  getUserReviewsController
);

export default router;
