import Classroom from '../models/classroom.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to book classrooms'));
    }

    try {
        // Retrieve data from request body
        const { lectureID, date, startTime, endTime, roomName, capacity, facilities } = req.body;

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