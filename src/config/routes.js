import express from 'express';
import testRoute from '../routes/test';
import userRoute from '../routes/user';
// import { authenticateJwt } from '../controllers/middlewares';

const router = express.Router();

router.use('/test', testRoute);
router.use('/user', userRoute);

export default router;
