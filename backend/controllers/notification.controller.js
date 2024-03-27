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