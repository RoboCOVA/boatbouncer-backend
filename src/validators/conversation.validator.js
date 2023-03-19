import { body, param } from 'express-validator';

export const crearteConversationValidator = () => [
  body('userOne').isMongoId(),
  body('userTwo').isMongoId(),
];

export const getConversationValidator = () => [
  param('userId').isMongoId().withMessage('Valid user ID is required'),
];
