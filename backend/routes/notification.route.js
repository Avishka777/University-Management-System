import express from 'express';
import { createNotification} from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/createnotification', createNotification)


export default router;