const express = require('express');
const { verifyToken } = require('../utils/verifyUser.js');
const {
  create,
  getAll,
  getById,
  getWeeklyTimetable,
  remove,
  update
} = require('../controllers/timetable.controller.js');

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/gettimetables', verifyToken, getAll)
router.get('/getweektimetables', verifyToken, getWeeklyTimetable)
router.get('/gettimetable/:id', verifyToken, getById)
router.put('/updatetimetable/:id', verifyToken, update)
router.delete('/deletetimetable/:id', verifyToken, remove);

module.exports = router;