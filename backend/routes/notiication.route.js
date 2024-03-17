import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletenotification, getnotifications, updatenotification} from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getnotifications', getnotifications)
router.delete('/deletenotification/:notificationId/:userId', verifyToken, deletenotification)
router.put('/updatenotification/:notificationId/:userId', verifyToken, updatenotification)

export default router;