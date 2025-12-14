import express from 'express';
import { authenticateJwt } from '../controller/authenticate';
import authRoute from '../routes/auth';
import boatRoute from '../routes/boat';
import bookingRoute from '../routes/booking';
import conversationRoute from '../routes/conversaton';
import intentRoute from '../routes/intent';
import messageRoute from '../routes/message';
import offerRoute from '../routes/offer';
import testRoute from '../routes/test';
import uploadRoute from '../routes/upload';
import userRoute from '../routes/user';
import reviewRoute from '../routes/review';
import spcailPricingRoute from '../routes/specialPricing';

const router = express.Router();

router.use('/test', testRoute);
router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/boat', boatRoute);
router.use('/offer', authenticateJwt, offerRoute);
router.use('/upload', authenticateJwt, uploadRoute);
router.use('/intent', authenticateJwt, intentRoute);
router.use('/booking', authenticateJwt, bookingRoute);
router.use('/message', authenticateJwt, messageRoute);
router.use('/conversation', authenticateJwt, conversationRoute);
router.use('/special-pricing', spcailPricingRoute);
router.use('/reviews', reviewRoute);

export default router;
