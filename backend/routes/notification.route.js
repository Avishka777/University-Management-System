import express from 'express';
import { createNotification, getAllNotification,getNotificationById} from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/createnotification', createNotification)
router.get('/getnotifications', getAllNotification)
router.get('/getnotification/:id', getNotificationById)

export default router;