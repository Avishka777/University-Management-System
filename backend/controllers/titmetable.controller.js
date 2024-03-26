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