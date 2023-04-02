import express from 'express';
import {
  createOffervalidator,
  udpateOffervalidator,
} from '../validators/offer.validators';
import parseValidationResult from '../validators/errors.parser';
import {
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

export default router;
