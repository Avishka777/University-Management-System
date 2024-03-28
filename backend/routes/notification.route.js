import express from 'express';
import { createNotification, getAllNotification,getNotificationById ,updateNotification} from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/createnotification', createNotification)
router.get('/getnotifications', getAllNotification)
router.get('/getnotification/:id', getNotificationById)
router.put('/updatenotification/:id', updateNotification)

export default router;