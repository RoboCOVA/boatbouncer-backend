import express from 'express';
import {
  acceptOfferValidator,
  createOffervalidator,
  getOfferValidator,
  updateOffervalidator,
} from '../validators/offer.validators';
import parseValidationResult from '../validators/errors.parser';
import {
  acceptOfferController,
  createOfferController,
  getOfferController,
  updateOfferController,
} from '../controller/offers';

const router = express.Router();

router.get(
  '/:offerId',
  getOfferValidator(),
  parseValidationResult,
  getOfferController
);

router.post(
  '/',
  createOffervalidator(),
  parseValidationResult,
  createOfferController
);

router.put(
  '/:offerId',
  updateOffervalidator(),
  parseValidationResult,
  updateOfferController
);

router.put(
  '/accept/:offerId',
  acceptOfferValidator(),
  parseValidationResult,
  acceptOfferController
);

export default router;
