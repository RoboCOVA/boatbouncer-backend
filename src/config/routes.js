import express from 'express';
import testRoute from '../routes/test';
import userRoute from '../routes/user';
import uploadRoute from '../routes/upload';
import boatRoute from '../routes/boat';
import stripeRoute from '../routes/stripe';
import messageRoute from '../routes/message';
import conversationRoute from '../routes/conversaton';
import bookingRoute from '../routes/booking';
import offerRoute from '../routes/offer';
import intentRoute from '../routes/intent';
import { authenticateJwt } from '../controller/authenticate';

const router = express.Router();

router.use('/test', testRoute);
router.use('/user', userRoute);
router.use('/payment', stripeRoute);
router.use('/boat', authenticateJwt, boatRoute);
router.use('/offer', authenticateJwt, offerRoute);
router.use('/upload', authenticateJwt, uploadRoute);
router.use('/intent', authenticateJwt, intentRoute);
router.use('/booking', authenticateJwt, bookingRoute);
router.use('/message', authenticateJwt, messageRoute);
router.use('/conversation', authenticateJwt, conversationRoute);

export default router;
