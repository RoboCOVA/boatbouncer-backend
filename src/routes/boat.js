import express from 'express';
import {
  createBoatController,
  deleteBoatController,
  getBoatController,
  getBoatListingController,
  getBoatsController,
  updateBoatController,
} from '../controller/boat';
import {
  createBoatValidator,
  deleteBoatsValidator,
  getBoatListingValidator,
  getBoatsValidator,
  getBoatValidator,
  updateBoatsValidator,
} from '../validators/boat.validators';
import parseValidationResult from '../validators/errors.parser';

const router = express.Router();

router.post(
  '/',
  createBoatValidator(),
  parseValidationResult,
  createBoatController
);

router.get('/', getBoatsValidator(), parseValidationResult, getBoatsController);

router.get(
  '/listing',
  getBoatListingValidator(),
  parseValidationResult,
  getBoatListingController
);

router.get(
  '/:boatId',
  getBoatValidator(),
  parseValidationResult,
  getBoatController
);

router.put(
  '/:boatId',
  updateBoatsValidator(),
  parseValidationResult,
  updateBoatController
);

router.delete(
  '/:boatId',
  deleteBoatsValidator(),
  parseValidationResult,
  deleteBoatController
);

export default router;
