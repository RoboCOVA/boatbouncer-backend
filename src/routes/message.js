import { Router } from 'express';
import {
  createMessageController,
  deleteMessageController,
  getMessagesController,
  getUnMessgesCountController,
  readMessageController,
} from '../controller/messages';
import parseValidationResult from '../validators/errors.parser';
import {
  createMessageValidator,
  getMessagesValidator,
  readMessagesValidator,
} from '../validators/message.validators';

const router = Router();

router.post(
  '/',
  createMessageValidator(),
  parseValidationResult,
  createMessageController
);

router.get('/new/count', getUnMessgesCountController);

router.get(
  '/:conversationId',
  getMessagesValidator(),
  parseValidationResult,
  getMessagesController
);

router.patch(
  '/:messageId',
  readMessagesValidator(),
  parseValidationResult,
  readMessageController
);

router.delete(
  '/:messageId',
  readMessagesValidator(),
  parseValidationResult,
  deleteMessageController
);

export default router;
