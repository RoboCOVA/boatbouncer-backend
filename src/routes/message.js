import { Router } from 'express';
import {
  crearteMessageValidator,
  getMessagesValidator,
} from '../validators/message.validators';
import parseValidationResult from '../validators/errors.parser';
import {
  createMessageController,
  getMessagesController,
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

export default router;
