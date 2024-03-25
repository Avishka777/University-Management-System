import Booking from '../models/booking.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to booking'));
    }
    if (!req.body.lectureID || !req.body.date) {
        return next(errorHandler(400, 'Please provide all required fields'));
    }

    const { lectureID, date, startTime, endTime } = req.body; 

    const newBooking = new Booking({
            lectureID,
            date,
            startTime,
            endTime
    });try{
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    }catch (error) {
        next(error)
    }
};