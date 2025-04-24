import express from 'express';
import { authenticateJwt } from '../controller/authenticate';
import {
  addOrRemoveFavoriteController,
  createBoatController,
  deleteBoatController,
  getBoatCategories,
  getBoatController,
  getBoatListingController,
  getBoatsController,
  getFavoritesController,
  updateBoatController,
} from '../controller/boat';
import {
  addToFavoriteValidator,
  createBoatValidator,
  deleteBoatsValidator,
  getBoatListingValidator,
  getBoatsValidator,
  getBoatValidator,
  updateBoatValidator,
} from '../validators/boat.validators';
import parseValidationResult from '../validators/errors.parser';

const router = express.Router();

router.post(
  '/',
  authenticateJwt,
  createBoatValidator(),
  parseValidationResult,
  createBoatController
);

router.get('/categories', getBoatCategories);

router.get('/favorites', authenticateJwt, getFavoritesController);

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
  updateBoatValidator(),
  // updateBoatsValidator(),
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
