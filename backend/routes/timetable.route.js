import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getAll, getById, getWeeklyTimetable, remove, update } from '../controllers/titmetable.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/gettimetables', verifyToken, getAll)
router.get('/getweektimetables', verifyToken, getWeeklyTimetable)
router.get('/gettimetable/:id', verifyToken, getById)
router.put('/updatetimetable/:id', verifyToken, update)
router.delete('/deletetimetable/:id', remove);

export default router;