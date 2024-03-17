import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getnotifications } from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getnotifications', getnotifications)

export default router;