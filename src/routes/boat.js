import express from 'express';
import {
  addOrRemoveFavoriteController,
  createBoatController,
  deleteBoatController,
  getBoatCategories,
  getBoatController,
  getBoatListingController,
  getBoatsController,
  updateBoatController,
} from '../controller/boat';
import {
  addToFavoriteValidator,
  createBoatValidator,
  deleteBoatsValidator,
  getBoatListingValidator,
  getBoatsValidator,
  getBoatValidator,
  updateBoatsValidator,
} from '../validators/boat.validators';
import parseValidationResult from '../validators/errors.parser';
import { authenticateJwt } from '../controller/authenticate';

const router = express.Router();

router.post(
  '/',
  authenticateJwt,
  createBoatValidator(),
  parseValidationResult,
  createBoatController
);

router.get('/categories', getBoatCategories);

router.get('/', getBoatsValidator(), parseValidationResult, getBoatsController);

router.get(
  '/listing',
  authenticateJwt,
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
  authenticateJwt,
  updateBoatsValidator(),
  parseValidationResult,
  updateBoatController
);

router.delete(
  '/:boatId',
  authenticateJwt,
  deleteBoatsValidator(),
  parseValidationResult,
  deleteBoatController
);

router.post(
  '/addFavorite/:boatId',
  authenticateJwt,
  addToFavoriteValidator(),
  parseValidationResult,
  addOrRemoveFavoriteController
);

export default router;
