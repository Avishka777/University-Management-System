import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getAll, getByID, remove, update } from '../controllers/classroom.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getclassrooms', getAll);
router.get('/getclassroom/:id', getByID);
router.put('/updateclassroom/:id', update);
router.delete('/deleteclassroom/:id', remove);

export default router;