import { Router } from 'express';
import {
  crearteMessageValidator,
  getMessagesValidator,
  readMessagesValidator,
} from '../validators/message.validators';
import parseValidationResult from '../validators/errors.parser';
import {
  createMessageController,
  getMessagesController,
  readMessageController,
} from '../controller/messages';

const router = Router();

router.post(
  '/',
  crearteMessageValidator(),
  parseValidationResult,
  createMessageController
);

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

export default router;
