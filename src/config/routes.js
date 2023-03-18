import express from 'express';
import testRoute from '../routes/test';
import userRoute from '../routes/user';
import uploadRoute from '../routes/upload';
import boatRoute from '../routes/boat';
import { authenticateJwt } from '../controller/authenticate';

const router = express.Router();

router.use('/test', testRoute);
router.use('/user', userRoute);
router.use('/upload', authenticateJwt, uploadRoute);
router.use('/boat', authenticateJwt, boatRoute);

export default router;
