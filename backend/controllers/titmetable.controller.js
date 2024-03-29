import TimeTable from '../models/timetable.model.js';
import { errorHandler } from '../utils/error.js';

// Updated create method
export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a timetable'));
    }

    try {
        const { classSession, course, day, startTime, endTime, faculty, location } = req.body;

        // Convert start and end times to Date objects
        const startDateTime = new Date(`${day}T${startTime}`);
        const endDateTime = new Date(`${day}T${endTime}`);

        // Check for overlapping sessions
        const overlappingSessions = await TimeTable.find({
            day,
            $or: [
                { $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }] }, // Case 1: New session starts before existing session ends and ends after existing session starts
                { $and: [{ startTime: { $gte: startTime, $lt: endTime } }] }, // Case 2: New session starts during existing session
                { $and: [{ endTime: { $gt: startTime, $lte: endTime } }] } // Case 3: New session ends during existing session
            ]
        });

        // If there are overlapping sessions, return an error
        if (overlappingSessions.length > 0) {
            return next(errorHandler(400, 'Session overlaps with existing sessions'));
        }

        // Create a new timetable object
        const newTimetable = new TimeTable({
            classSession,
            course,
            day,
            startTime,
            endTime,
            faculty,
            location
        });
        // Save the timetable object to the database
        const savedTimetable = await newTimetable.save();
        res.status(201).json(savedTimetable);
    } catch (error) {
        next(error);
    }
};


// Get all timetables
export const getAll = async (req, res, next) => {
    try {
        const timetables = await TimeTable.find();
        res.status(200).json(timetables);
    } catch (error) {
        next(error);
    }
};
// Get timetable by ID
export const getById = async (req, res, next) => {
    try {
        const timetableId = req.params.id;
        const timetable = await TimeTable.findById(timetableId);
        if (!timetable) {
            return next(errorHandler(404, 'Timetable not found'));
        }
        res.status(200).json(timetable);
    } catch (error) {
        next(error);
    }
};
// Update timetable
export const update = async (req, res, next) => {
    try {
        const { classSession, course, day, startTime, endTime, faculty, location } = req.body;
        const timetableId = req.params.id;

        // Check if timetable exists
        const timetable = await TimeTable.findById(timetableId);
        if (!timetable) {
            return next(errorHandler(404, 'Timetable not found'));
        }

        // Convert start and end times to Date objects
        const startDateTime = new Date(`${day}T${startTime}`);
        const endDateTime = new Date(`${day}T${endTime}`);

        // Check for overlapping sessions excluding the current session being updated
        const overlappingSessions = await TimeTable.find({
            day,
            _id: { $ne: timetableId }, // Exclude the current session being updated
            $or: [
                { $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }] }, // Case 1: New session starts before existing session ends and ends after existing session starts
                { $and: [{ startTime: { $gte: startTime, $lt: endTime } }] }, // Case 2: New session starts during existing session
                { $and: [{ endTime: { $gt: startTime, $lte: endTime } }] } // Case 3: New session ends during existing session
            ]
        });

        // If there are overlapping sessions (excluding the current session being updated), return an error
        if (overlappingSessions.length > 0) {
            return next(errorHandler(400, 'Update results in session overlap with existing sessions'));
        }

        // Update timetable fields
        timetable.classSession = classSession;
        timetable.course = course;
        timetable.day = day;
        timetable.startTime = startTime;
        timetable.endTime = endTime;
        timetable.faculty = faculty;
        timetable.location = location;

        // Save the updated timetable
        const updatedTimetable = await timetable.save();
        res.status(200).json(updatedTimetable);
    } catch (error) {
        next(error);
    }
};



// Delete timetable by ID
export const remove = async (req, res, next) => {
    try {
        const timetableId = req.params.id;
        // Check if timetable exists
        const timetable = await TimeTable.findById(timetableId);
        if (!timetable) {
            return next(errorHandler(404, 'Timetable not found'));
        }
        // Delete the timetable
        await TimeTable.deleteOne({ _id: timetableId });
        res.status(200).json({ success: true, message: 'Timetable deleted successfully' });
    } catch (error) {
        next(error);
    }
};
// Get weekly timetable
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