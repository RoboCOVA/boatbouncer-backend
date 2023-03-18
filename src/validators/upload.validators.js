/* eslint-disable import/prefer-default-export */
import { param } from 'express-validator';
import { publicResourcesEnum } from '../utils/constants';

export const uploadBoatPhotosValidator = () => [
  param('resource').isString().isIn(publicResourcesEnum),
];
