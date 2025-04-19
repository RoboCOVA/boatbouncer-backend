import { body, param } from 'express-validator';

export const createMessageValidator = () => [
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

export const readMessagesValidator = () => [
  param('messageId').isMongoId().withMessage('Valid message ID is required'),
];
