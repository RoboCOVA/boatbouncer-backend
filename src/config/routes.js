import express from 'express';
import testRoute from '../routes/test';
import userRoute from '../routes/user';
import uploadRoute from '../routes/upload';
import boatRoute from '../routes/boat';
import messageRoute from '../routes/message';
import conversationRoute from '../routes/conversaton';
import { authenticateJwt } from '../controller/authenticate';

const router = express.Router();

router.use('/test', testRoute);
router.use('/user', userRoute);
router.use('/upload', authenticateJwt, uploadRoute);
router.use('/boat', authenticateJwt, boatRoute);
router.use('/message', authenticateJwt, messageRoute);
router.use('/conversation', authenticateJwt, conversationRoute);

export default router;
