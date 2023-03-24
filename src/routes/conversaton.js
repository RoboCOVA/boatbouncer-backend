import { Router } from 'express';
import {
  crearteConversationValidator,
  getConversationValidator,
} from '../validators/conversation.validator';
import parseValidationResult from '../validators/errors.parser';
import {
  createConversationController,
  getConversationController,
} from '../controller/conversations';

const router = Router();

router.post(
  '/',
  crearteConversationValidator(),
  parseValidationResult,
  createConversationController
);

router.get(
  '/:userId',
  getConversationValidator(),
  parseValidationResult,
  getConversationController
);

export default router;
