const express = require('express');
const {
  createNotification,
  getAllNotification,
  getNotificationById,
  updateNotification,
  deleteNotification
} = require('../controllers/notification.controller.js');

const router = express.Router();

router.post('/createnotification', createNotification)
router.get('/getnotifications', getAllNotification)
router.get('/getnotification/:id', getNotificationById)
router.put('/updatenotification/:id', updateNotification)
router.delete('/deletenotification/:id', deleteNotification)

module.exports = router;