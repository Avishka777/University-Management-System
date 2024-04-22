const express = require('express');
const { verifyToken } = require('../utils/verifyUser.js');
const {
  create,
  deleteannouncement,
  getannouncements,
  updateannouncement
} = require('../controllers/announcement.controller.js');

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getannouncements', getannouncements)
router.delete('/deleteannouncement/:announcementId', verifyToken, deleteannouncement)
router.put('/updateannouncement/:announcementId', verifyToken, updateannouncement)

module.exports = router;