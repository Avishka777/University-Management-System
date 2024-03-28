import Notification from '../models/notification.model.js';
import { errorHandler } from '../utils/error.js';

export const createNotification = async (req, res, next) => {

    try {
        const { notificationTitle, notificationBody } = req.body;

        // Create A New Notification Object
        const newNotification = new Notification({
            notificationTitle,
            notificationBody
        });

        // Save the Notification Object to the Database
        const savedNotification = await newNotification.save();

        res.status(201).json(savedNotification);
    } catch (error) {
        next(error);
    }
};


// Route to Get All Notifications
export const getAllNotification = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Route to Get Notification By ID
export const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification Not Found' });
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Route to Update Notification
export const updateNotification = async (req, res) => {
    try {
        const { notificationTitle, notificationBody } = req.body;
        const notificationId = req.params.id;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return next(errorHandler(404, 'Notification Not Found'));
        }

        notification.notificationTitle = notificationTitle;
        notification.notificationBody = notificationBody;
        const updatedNotification = await notification.save();

        res.status(200).json(updatedNotification);
    } catch (error) {
        next(error);
    }
};