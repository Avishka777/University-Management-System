import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getAll, getByID, update } from '../controllers/classroom.controller.js';


const router = express.Router();
router.post('/create', verifyToken, create)
router.get('/getclassrooms', getAll);
router.get('/getclassroom/:id', getByID);
router.put('/updateclassroom/:id', update);

export default router;