import express from 'express';
import {
  acceptOfferValidator,
  createOffervalidator,
  udpateOffervalidator,
} from '../validators/offer.validators';
import parseValidationResult from '../validators/errors.parser';
import {
  acceptOfferController,
  createOfferController,
  updateOfferController,
} from '../controller/offers';

const router = express.Router();

router.post(
  '/',
  createOffervalidator(),
  parseValidationResult,
  createOfferController
);

router.put(
  '/:offerId',
  udpateOffervalidator(),
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
