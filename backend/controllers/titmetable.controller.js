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