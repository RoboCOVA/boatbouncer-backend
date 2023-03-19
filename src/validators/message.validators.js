import { body, param } from 'express-validator';

export const crearteMessageValidator = () => [
  body('conversation')
    .isMongoId()
    .withMessage('Valid Conversation id is required'),
  body('sender').isMongoId().withMessage('Sender is required'),
  body('text').isString().withMessage('Text is required'),
];

export const getMessagesValidator = () => [
  param('conversationId')
    .isMongoId()
    .withMessage('Valid conversation ID is required'),
];
