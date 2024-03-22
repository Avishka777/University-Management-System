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

export const getnotifications = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const notifications = await Notification.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.notificationId && { _id: req.query.notificationId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalNotifications = await Notification.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthNotifications = await Notification.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      notifications,
      totalNotifications,
      lastMonthNotifications,
    });
  } catch (error) {
    next(error);
  }

};

export const deletenotification = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this notification'));
  }
  try {
    await Notification.findByIdAndDelete(req.params.notificationId);
    res.status(200).json('The notification has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatenotification = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this notification'));
  }
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedNotification);
  } catch (error) {
    next(error);
  }
};