const Notification = require('../models/notification.model.js');
const { errorHandler } = require('../utils/error.js');


//Create Notification
exports.createNotification = async (req, res, next) => {
    if (!req.user.isAdmin && !req.user.isFaculty) {
        return next(errorHandler(403, 'You Are Not Allowed to Create a Announcement.'));
    }
    try {
        const { notificationTitle, notificationBody } = req.body;
        const newNotification = new Notification({notificationTitle,notificationBody});
        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    } catch (error) {
        next(error);
    }
};

//Get All Notifications
exports.getAllNotification = async (req, res) => {
  try {
      const notifications = await Notification.find();
      res.json(notifications);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error.' });
  }
};

// Route to Get Notification By ID
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification Not Found.' });
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};

// Route to Update Notification
exports.updateNotification = async (req, res) => {
    if (!req.user.isAdmin && !req.user.isFaculty) {
        return next(errorHandler(403, 'You Are Not Allowed to Update a Announcement.'));
    }
    try {
        const { notificationTitle, notificationBody } = req.body;
        const notificationId = req.params.id;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return next(errorHandler(404, 'Notification Not Found.'));
        }

        notification.notificationTitle = notificationTitle;
        notification.notificationBody = notificationBody;
        const updatedNotification = await notification.save();

        res.status(200).json(updatedNotification);
    } catch (error) {
        next(error);
    }
};

// Route to Delete Notification
exports.deleteNotification = async (req, res) => {
    try {
        const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
        if (!deletedNotification) {
            return res.status(404).json({ error: 'Notification Not Found.' });
        }
        res.json({ message: 'Notification Deleted Successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};