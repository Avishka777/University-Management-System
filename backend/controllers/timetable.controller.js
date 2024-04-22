const TimeTable = require('../models/timetable.model.js');
const { errorHandler } = require('../utils/error.js');
const Notification = require('../models/notification.model.js');


// Route to Create Time Table
exports.create = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isFaculty) {
      return next(errorHandler(403, 'You Are Not Allowed to Create a Time Table.'));
  }
  try {
      const { classSession, course, day: dateString, startTime, endTime, faculty, location } = req.body;
      const day = new Date(dateString);

      // Check If There Are Sessions At The Same Time With The Same Location
      const existingSessionsSameLocation = await TimeTable.findOne({
          day,
          location,
          $or: [
              {
                  $and: [
                      { startTime: { $lte: startTime } },
                      { endTime: { $gt: startTime } }
                  ]
              },
              {
                  $and: [
                      { startTime: { $lt: endTime } },
                      { endTime: { $gte: endTime } }
                  ]
              },
              {
                  $and: [
                      { startTime: { $gte: startTime } },
                      { endTime: { $lte: endTime } }
                  ]
              }
          ]
      });

      if (existingSessionsSameLocation) {
          return next(errorHandler(400, 'A session at the same time with the same location already exists.'));
      }

      // Check If There Are Sessions At The Same Time With Different Locations
      const existingSessionsDifferentLocation = await TimeTable.findOne({
          day,
          $or: [
              {
                  location: { $ne: location },
                  $or: [
                      {
                          $and: [
                              { startTime: { $lte: startTime } },
                              { endTime: { $gt: startTime } }
                          ]
                      },
                      {
                          $and: [
                              { startTime: { $lt: endTime } },
                              { endTime: { $gte: endTime } }
                          ]
                      },
                      {
                          $and: [
                              { startTime: { $gte: startTime } },
                              { endTime: { $lte: endTime } }
                          ]
                      }
                  ]
              }
          ]
      });

      if (existingSessionsDifferentLocation) {
          console.warn('A session at the same time with a different location already exists.');
      }

      const newTimetable = new TimeTable({ classSession, course, day, startTime, endTime, faculty, location });
      const savedTimetable = await newTimetable.save();

      // Create A Notification For The New Time Table Added
      const notification = new Notification({
          notificationTitle: 'New Timetable Added!',
          notificationBody: `A Timetable Added For "${classSession}".`
      });
      const savedNotification = await notification.save();

      res.status(201).json(savedTimetable);
  } catch (error) {
      next(error);
  }
};


// Route to Get All Time Tables
exports.getAll = async (req, res, next) => {
  try {
    const timetables = await TimeTable.find();
    res.status(200).json(timetables);
  } catch (error) {
    next(error);
  }
};

// Route to Get Time Table By ID
exports.getById = async (req, res, next) => {
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
exports.update = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isFaculty) {
    return next(errorHandler(403, 'You Are Not Allowed to Update a Time Table.'));
  }
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
      return next(errorHandler(400, 'Cannot Update: Session At The Same Time And Location Already Exists.'));
    }

    // Check If There Are Sessions At The Same Time With The Same Location
    const existingSessionsSameLocation = await TimeTable.findOne({
      day,
      location,
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gt: startTime } }
          ]
        },
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gte: endTime } }
          ]
        },
        {
          $and: [
            { startTime: { $gte: startTime } },
            { endTime: { $lte: endTime } }
          ]
        }
      ],
      _id: { $ne: timetableId } // Exclude the current timetable entry
    });

    if (existingSessionsSameLocation) {
      return next(errorHandler(400, 'Cannot Update: A session at the same time with the same location already exists.'));
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
      notificationBody: `A Timetable Added For "${classSession}".`
    });
    const savedNotification = await notification.save();

    res.status(200).json(updatedTimetable);
  } catch (error) {
    next(error);
  }
};


// Route to Delete Time Table
exports.remove = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isFaculty) {
    return next(errorHandler(403, 'You Are Not Allowed to Delete a Time Table.'));
  }
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
exports.getWeeklyTimetable = async (req, res, next) => {
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
