import express from 'express';
import {
  deleteNotificationController,
  getNotificationsController,
  markNotificationsSeenController,
} from '../controller/notification';

const router = express.Router();

router.get('/', getNotificationsController);
router.put('/seen', markNotificationsSeenController);
router.delete('/:notificationId', deleteNotificationController);

export default router;
