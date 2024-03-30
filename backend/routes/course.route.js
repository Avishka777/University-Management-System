import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create,  getcourses, deletecourse, updatecourse} from '../controllers/course.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getcourses', getcourses)
router.delete('/deletecourse/:courseId/:userId', verifyToken, deletecourse)
router.put('/updatecourse/:courseId/:userId', verifyToken, updatecourse)

export default router;