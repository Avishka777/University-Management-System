import Course from '../models/course.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to create a course'));
    }
    if (!req.body.courseCode || !req.body.courseName) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }
    const slug = req.body.courseCode
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
    const newCourse = new Course({
    ...req.body,
    slug,
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
        ...(req.query.slug && { slug: req.query.slug }),
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
  
  export const updatecourse = async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to update this course'));
    }
    try {
      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.courseId,
        {
          $set: {
            courseName: req.body.courseName,
            courseCode: req.body.courseCode,
            courseDescription: req.body.courseDescription,
            courseCredit: req.body.courseCredit,
            courseFaculty: req.body.courseFaculty,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedCourse);
    } catch (error) {
      next(error);
    }
  };