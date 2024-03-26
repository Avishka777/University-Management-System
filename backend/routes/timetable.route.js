import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create } from '../controllers/titmetable.controller.js';
import { create, getAll, getById } from '../controllers/titmetable.controller.js';


const router = express.Router();
router.post('/create', verifyToken, create)
router.get('/gettimetables', verifyToken, getAll)
router.get('/gettimetable/:id', verifyToken, getById)


export default router;