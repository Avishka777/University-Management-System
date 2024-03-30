import TimeTable from '../models/timetable.model.js';
import { errorHandler } from '../utils/error.js';
import Notification from '../models/notification.model.js';

// Rote to Create Time Table
export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You Are Not Allowed to Create a Time Table.'));
  }
  try {
    const { classSession, course, day, startTime, endTime, faculty, location } = req.body;

    // Convert start and end times to Date objects
    const startDateTime = new Date(`${day}T${startTime}`);
    const endDateTime = new Date(`${day}T${endTime}`);

    // Check for sessions at the same time with the same location
    const existingSessionsSameLocation = await TimeTable.find({day, startTime, endTime, location });

    // If there are sessions with the same time and location, return an error
    if (existingSessionsSameLocation.length > 0) {
      return next(errorHandler(400, 'A session at the same time with the same location already exists.'));
    }

    // Check for sessions at the same time with different locations
    const existingSessionsDifferentLocation = await TimeTable.find({
      day,
      startTime,
      endTime,
      location: { $ne: location } // Exclude sessions with the same start and end times but different locations
    });

    // If there are sessions with the same time but different locations, return a warning
    if (existingSessionsDifferentLocation.length > 0) {
      console.warn('A session At the Same Time With a Different Location Already Exists.');
    }

    const newTimetable = new TimeTable({classSession, course, day, startTime, endTime, faculty, location });
    const savedTimetable = await newTimetable.save();

    // Create a Notification for the New Time Table Added
    const notification = new Notification({
      notificationTitle: 'New Timetable Added!',
      notificationBody: `A New Timetable Has Been Added.`
    });
    const savedNotification = await notification.save();

    res.status(201).json(savedTimetable);
  } catch (error) {
    next(error);
  }
};


// Route to Get All Time Tables
export const getAll = async (req, res, next) => {
  try {
    const timetables = await TimeTable.find();
    res.status(200).json(timetables);
  } catch (error) {
    next(error);
  }
};

// Route to Get Time Table By ID
export const getById = async (req, res, next) => {
  try {
    const timetableId = req.params.id;
    const timetable = await TimeTable.findById(timetableId);
    if (!timetable) {
      return next(errorHandler(404, 'Timetable Not Found.'));
    }
      res.status(200).json(timetable);
  } catch (error) {
    next(error);
  }
};

// Route to Update Time Table
export const update = async (req, res, next) => {
  try {
    const { classSession, course, day, startTime, endTime, faculty, location } = req.body;
    const timetableId = req.params.id;
    const timetable = await TimeTable.findById(timetableId);
    
    if (!timetable) {
      return next(errorHandler(404, 'Time Table Not Found.'));
    }

    // Convert start and end times to Date objects
    const startDateTime = new Date(`${day}T${startTime}`);
    const endDateTime = new Date(`${day}T${endTime}`);

    // Check if there are sessions at the same time and location (excluding the current session)
    const existingSessionsSameTimeAndLocation = await TimeTable.find({
      day,
      startTime,
      endTime,
      location,
      _id: { $ne: timetableId }
    });

    // If there are sessions with the same time and location, return an error
    if (existingSessionsSameTimeAndLocation.length > 0) {
      return next(errorHandler(400, 'Cannot update: Session at the same time and location already exists.'));
    }

    // Update the timetable fields
    timetable.classSession = classSession;
    timetable.course = course;
    timetable.day = day;
    timetable.startTime = startTime;
    timetable.endTime = endTime;
    timetable.faculty = faculty;
    timetable.location = location;
    
    const updatedTimetable = await timetable.save();

    // Create a Notification For the Updated the Time Table
    const notification = new Notification({
      notificationTitle: 'Timetable Updated!',
      notificationBody: `A New Time Table Has Been Updated.`
    });
    const savedNotification = await notification.save();

    res.status(200).json(updatedTimetable);
  } catch (error) {
    next(error);
  }
};


// Route to Delete Time Table
export const remove = async (req, res, next) => {
  try {
    const timetableId = req.params.id;
    const timetable = await TimeTable.findById(timetableId);
    if (!timetable) {
        return next(errorHandler(404, 'Timetable Not Found.'));
    }
    await TimeTable.deleteOne({ _id: timetableId });
    res.status(200).json({ success: true, message: 'Timetable Deleted Successfully.' });
  } catch (error) {
    next(error);
  }
};

// Route to Get weekly Time Table
export const getWeeklyTimetable = async (req, res, next) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7); // Get date for next week

    const weeklyTimetable = await TimeTable.find({
      day: { $gte: today, $lt: nextWeek } // Get timetables for the upcoming week
    });
    res.status(200).json(weeklyTimetable);
  } catch (error) {
    next(error);
  }
};