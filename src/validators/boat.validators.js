import { body, param, query } from 'express-validator';
import { boatFeaturesEnum, pricingTypeEnum } from '../utils/constants';
import defaultValidators from './default.validator';
import { categoriesEnum } from '../models/constants';

export const createBoatValidator = () => [
  body('boatName').isString().withMessage('Boat Name is required'),
  body('boatType').isString().withMessage('Boat Type is required'),
  body('description').isString().withMessage('Description is required'),
  body('manufacturer').isString().withMessage('Manufacturer is required'),
  body('model').isString().withMessage('Model is required'),
  body('year').isNumeric().withMessage('Year is required'),
  body('length').isNumeric().withMessage('Length is required'),
  body('amenities').isArray().withMessage('Amenities is required'),
  body('amenities.*').isString().withMessage('Amenities is required'),
  body('imageUrls').isArray().withMessage('Image URL is required'),
  body('imageUrls.*').isString().withMessage('Image URL is required'),
  body('location.address').isString().optional(),
  body('location.city').isString().optional(),
  body('location.state').isString().optional(),
  body('location.zipCode').isString().optional(),
  body('latLng.latitude').isNumeric().optional(),
  body('latLng.longitude').isNumeric().optional(),
  body('category').isArray().optional(),
  body('category.*').isString().isIn(categoriesEnum).optional(),
  body('currency').isString().optional(),
  body('subCategory').isArray().optional(),
  body('subCategory.*').isString().optional(),
  body('features').isArray().withMessage('Features is required'),
  body('features.*')
    .isString()
    .isIn(boatFeaturesEnum)
    .withMessage('Features is required'),
  body('securityAllowance')
    .isString()
    .withMessage('SecurityAllowance is required'),
  body('pricing').isArray().withMessage('Pricing is required'),
  body('pricing.*.type')
    .isString()
    .isIn(pricingTypeEnum)
    .withMessage('Pricing type is required'),
  body('pricing.*.min').isNumeric().withMessage('Pricing Min is required'),
  body('pricing.*.value').isNumeric().withMessage('Pricing Value is required'),
  body('captained').isBoolean().withMessage('Captained is required'),
];

export const getBoatValidator = () => [
  param('boatId').isMongoId().withMessage('Valid Boat id is required'),
];

export const getBoatsValidator = () => [
  defaultValidators.pageNo,
  defaultValidators.size,
  query('bbox').isArray().optional(),
];

export const updateBoatsValidator = () => [
  param('boatId').isMongoId().withMessage('Valid Boat id is required'),
  body('boatName').isString().optional(),
  body('boatType').isString().optional(),
  body('description').isString().optional(),
  body('manufacturer').isString().optional(),
  body('model').isString().optional(),
  body('year').isNumeric().optional(),
  body('length').isNumeric().optional(),
  body('amenities').isArray().optional(),
  body('amenities.*').isString().optional(),
  body('imageUrls').isArray().optional(),
  body('imageUrls.*').isString().optional(),
  body('location.address').isString().optional(),
  body('location.city').isString().optional(),
  body('location.state').isString().optional(),
  body('location.zipCode').isString().optional(),
  body('latLng.latitude').isNumeric().optional(),
  body('latLng.longitude').isNumeric().optional(),
  body('category').isArray().optional(),
  body('category.*').isString().isIn(categoriesEnum).optional(),
  body('currency').isString().optional(),
  body('subCategory').isArray().optional(),
  body('subCategory.*').isString().optional(),
  body('features').isString().isIn(boatFeaturesEnum).optional(),
  body('securityAllowance').isString().optional(),
  body('pricing').isArray().optional(),
  body('pricing.*.type').isString().isIn(pricingTypeEnum).optional(),
  body('pricing.*.min').isNumeric().optional(),
];

export const deleteBoatsValidator = () => [
  param('boatId').isMongoId().optional(),
];

export const addToFavoriteValidator = () => [param('boatId').isMongoId()];

export const getBoatListingValidator = () => [
  defaultValidators.pageNo,
  defaultValidators.size,
];
