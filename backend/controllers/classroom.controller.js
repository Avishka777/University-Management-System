import Classroom from '../models/classroom.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to book classrooms'));
    }

    try {
        // Retrieve data from request body
        const { lectureID, date: dateString, startTime, endTime, roomName, capacity, facilities } = req.body;

        // Parse date string into a Date object
        const date = new Date(dateString);

        // Check if the specified date and time slot is already booked
        const isAvailable = await Classroom.findOne({
            roomName,
            'bookings.date': date,
            $or: [
                {
                    $and: [
                        { 'bookings.startTime': { $lte: startTime } },
                        { 'bookings.endTime': { $gt: startTime } }
                    ]
                },
                {
                    $and: [
                        { 'bookings.startTime': { $lt: endTime } },
                        { 'bookings.endTime': { $gte: endTime } }
                    ]
                },
                {
                    $and: [
                        { 'bookings.startTime': { $gte: startTime } },
                        { 'bookings.endTime': { $lte: endTime } }
                    ]
                }
            ]
        });

        if (isAvailable) {
            return next(errorHandler(400, 'The room is not available at the specified time'));
        }

        // Create a new booking object
        const booking = {
            lectureID,
            date,
            startTime,
            endTime
        };

        // Find or create the classroom
        let classroom = await Classroom.findOne({ roomName });

        if (!classroom) {
            // Create a new Classroom object if it doesn't exist
            classroom = new Classroom({
                roomName,
                capacity,
                facilities,
                bookings: []
            });
        }

        // Push the new booking to the bookings array of the Classroom object
        classroom.bookings.push(booking);

        // Save the Classroom object to the database
        const savedClassroom = await classroom.save();

        res.status(201).json(savedClassroom);
    } catch (error) {

        next(error);

    }

};







export const getAll = async (req, res, next) => {

    try {

        const classrooms = await Classroom.find();

        res.status(200).json(classrooms);

    } catch (error) {

        next(error);

    }

};







export const getByID = async (req, res, next) => {

    const { id } = req.params;

    try {

        const classroom = await Classroom.findById(id);

        if (!classroom) {

            return next(errorHandler(404, 'Classroom not found'));

        }

        res.status(200).json(classroom);

    } catch (error) {

        next(error);

    }

};