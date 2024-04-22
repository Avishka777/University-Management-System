const Announcement = require('../models/announcement.model.js');
const { errorHandler } = require('../utils/error.js');
const Notification = require('../models/notification.model.js');

// Route to Create Announcement
exports.create = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isFaculty) {
    return next(errorHandler(403, 'You Are Not Allowed to Create a Announcement.'));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please Provide All Required Fields.'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newAnnouncement = new Announcement({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedAnnouncement = await newAnnouncement.save();

    // Create a Notification For the New Annuncement Entry
    const notification = new Notification({
      notificationTitle: 'New Announcement Published!',
      notificationBody: `${req.body.title}`
    });
    const savedNotification = await notification.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    next(error);
  }
};

// Route to Get All Announcement
exports.getannouncements = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    
    const announcements = await Announcement.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.announcementId && { _id: req.query.announcementId }),
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

    const totalAnnouncements = await Announcement.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthAnnouncements = await Announcement.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      announcements,
      totalAnnouncements,
      lastMonthAnnouncements,
    });
  } catch (error) {
    next(error);
  }
};

// Route to Delete Announcement
exports.deleteannouncement = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isFaculty) {
    return next(errorHandler(403, 'You Are Not Allowed to Delete a Announcement.'));
  }
  try {
    await Announcement.findByIdAndDelete(req.params.announcementId);
    res.status(200).json('The Announcement Has Been Deleted');
  } catch (error) {
    next(error);
  }
};

// Route to Update Announcement
exports.updateannouncement = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isFaculty) {
    return next(errorHandler(403, 'You Are Not Allowed to Update This Announcement.'));
  }
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.announcementId,
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
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    next(error);
  }
};