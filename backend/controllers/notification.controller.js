import Notification from '../models/notification.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a notification'));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newNotification = new Notification({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    next(error);
  }
};