import { Router } from 'express';
import {
  createConversationController,
  getConversationController,
} from '../controller/conversations';
import {
  crearteConversationValidator,
  getConversationValidator,
} from '../validators/conversation.validator';
import parseValidationResult from '../validators/errors.parser';

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
