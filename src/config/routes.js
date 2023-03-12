import express from 'express';
import testRoute from '../routes/test';
// import { authenticateJwt } from '../controllers/middlewares';

const router = express.Router();

router.use('/test', testRoute);

export default router;
