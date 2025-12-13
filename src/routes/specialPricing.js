import express from 'express';
import {
  createSpecialPricingController,
  deleteSpecialPricingController,
  getBoatSpecialPricingController,
  getSpecialPricingController,
  updateSpecialPricingController,
} from '../controller/specialPricing';
import parseValidationResult from '../validators/errors.parser';
import {
  createSpecialPricingValidator,
  deleteSpecialPricingValidator,
  getBoatSpecialPricingValidator,
  getSpecialPricingValidator,
  updateSpecialPricingValidator,
} from '../validators/specialPricing.validator';

const router = express.Router();

// Create special pricing
router.post(
  '/',
  createSpecialPricingValidator(),
  parseValidationResult,
  createSpecialPricingController
);

// Get all special pricing for a boat
router.get(
  '/boat/:boatId',
  getBoatSpecialPricingValidator(),
  parseValidationResult,
  getBoatSpecialPricingController
);

// Get specific special pricing
router.get(
  '/:pricingId',
  getSpecialPricingValidator(),
  parseValidationResult,
  getSpecialPricingController
);

// Update special pricing
router.put(
  '/:pricingId',
  updateSpecialPricingValidator(),
  parseValidationResult,
  updateSpecialPricingController
);

// Delete special pricing
router.delete(
  '/:pricingId',
  deleteSpecialPricingValidator(),
  parseValidationResult,
  deleteSpecialPricingController
);

export default router;
