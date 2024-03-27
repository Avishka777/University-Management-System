import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deleteannouncement, getannouncements, updateannouncement} from '../controllers/announcement.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getannouncements', getannouncements)
router.delete('/deleteannouncement/:announcementId/:userId', verifyToken, deleteannouncement)
router.put('/updateannouncement/:announcementId/:userId', verifyToken, updateannouncement)

export default router;