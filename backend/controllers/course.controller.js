import Course from '../models/course.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to create a notification'));
    }
    if (!req.body.courseCode || !req.body.courseName) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }
    const newCourse = new Course({
      ...req.body,
      userId: req.user.id,
    });
    try {
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } catch (error) {
      next(error);
    }
  };


  export const getcourses = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const courses = await Course.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.courseName && { category: req.query.courseName }),
        ...(req.query.courseId && { _id: req.query.courseId }),
        ...(req.query.searchTerm && {
          $or: [
            { courseFaculty: { $regex: req.query.searchTerm, $options: 'i' } },
            { courseCredit: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

      const totalCourses = await Course.countDocuments();

      const now = new Date();

      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

      const lastMonthCourses = await Course.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });

      res.status(200).json({
        courses,
        totalCourses,
        lastMonthCourses,
      });
    } catch (error) {
      next(error);
    }
  };

  export const deletecourse = async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to delete this course'));
    }
    try {
      await Course.findByIdAndDelete(req.params.courseId);
      res.status(200).json('The Course has been deleted');
    } catch (error) {
      next(error);
    }
  };

//   export const updatenotification = async (req, res, next) => {
//     if (!req.user.isAdmin || req.user.id !== req.params.userId) {
//       return next(errorHandler(403, 'You are not allowed to update this notification'));
//     }
//     try {
//       const updatedNotification = await Notification.findByIdAndUpdate(
//         req.params.notificationId,
//         {
//           $set: {
//             title: req.body.title,
//             content: req.body.content,
//             category: req.body.category,
//             image: req.body.image,
//           },
//         },
//         { new: true }
//       );
//       res.status(200).json(updatedNotification);
//     } catch (error) {
//       next(error);
//     }
//   };