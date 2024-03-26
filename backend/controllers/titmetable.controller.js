import TimeTable from '../models/timetable.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {

    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create time table'));
    }

    try {
        const { classSession, course, day, time, faculty, location } = req.body;

        // Create a new timetable object
        const newTimetable = new TimeTable({
            classSession,
            course,
            day,
            time,
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
        const { classSession, course, day, time, faculty, location } = req.body;
        const timetableId = req.params.id;

        // Check if timetable exists
        const timetable = await TimeTable.findById(timetableId);
        if (!timetable) {
            return next(errorHandler(404, 'Timetable not found'));
        }

        // Update timetable fields
        timetable.classSession = classSession;
        timetable.course = course;
        timetable.day = day;
        timetable.time = time;
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