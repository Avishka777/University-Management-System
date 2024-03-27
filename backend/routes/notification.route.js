import express from 'express';
import { createNotification, getAllNotification} from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/createnotification', createNotification)
router.get('/getnotifications', getAllNotification)

export default router;