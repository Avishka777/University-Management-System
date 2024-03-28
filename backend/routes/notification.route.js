import express from 'express';
import { createNotification, getAllNotification,getNotificationById ,updateNotification,deleteNotification} from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/createnotification', createNotification)
router.get('/getnotifications', getAllNotification)
router.get('/getnotification/:id', getNotificationById)
router.put('/updatenotification/:id', updateNotification)
router.delete('/deletenotification/:id', deleteNotification)

export default router;