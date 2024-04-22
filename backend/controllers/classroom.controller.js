const Classroom = require('../models/classroom.model.js');
const { errorHandler } = require('../utils/error.js');
const Notification = require('../models/notification.model.js');

// Route to Create Class Room
exports.create = async (req, res, next) => {
    if (!req.user.isAdmin && !req.user.isFaculty) {
        return next(errorHandler(403, 'You Are Not Allowed to Book class Rooms.'));
    }
    try {
        const { lectureID, date: dateString, startTime, endTime, roomName, capacity, facilities } = req.body;
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
            return next(errorHandler(400, 'The Room is Not Available At the Specified Time.'));
        }
        const booking = {lectureID,date,startTime,endTime};
        let classroom = await Classroom.findOne({ roomName });
        
        if (!classroom) {
            classroom = new Classroom({
                roomName,
                capacity,
                facilities,
                bookings: []
            });
        }
        classroom.bookings.push(booking);
        const savedClassroom = await classroom.save();
        res.status(201).json(savedClassroom);
    } catch (error) {
        next(error);
    }
};

// Route to Get All Class Rooms
exports.getAll = async (req, res, next) => {
    try {
        const classrooms = await Classroom.find();
        res.status(200).json(classrooms);
    } catch (error) {
        next(error);
    }
};

// Route to Get Class Room By ID
exports.getByID = async (req, res, next) => {
    const { id } = req.params;
    try {
        const classroom = await Classroom.findById(id);
        if (!classroom) {
            return next(errorHandler(404, 'Classroom Not Found.'));
        }
        res.status(200).json(classroom);
    } catch (error) {
        next(error);
    }
};

// Route to Update Class Room
exports.update = async (req, res, next) => {
    if (!req.user.isAdmin && !req.user.isFaculty) {
        return next(errorHandler(403, 'You Are Not Allowed to Update Book class Rooms.'));
    }
    const { id } = req.params;
    const { roomName, capacity, facilities, lectureID, date: dateString, startTime, endTime } = req.body;
    try {
        const classroom = await Classroom.findById(id);
        if (!classroom) {
            return next(errorHandler(403, 'Classroom Not Found.'));
        }
        // Parse date string into a Date object
        const date = new Date(dateString);
        classroom.roomName = roomName;
        classroom.capacity = capacity;
        classroom.facilities = facilities;
        
        classroom.bookings = [];// Remove existing bookings
        const booking = {lectureID,date,startTime,endTime};// Add the new booking
        classroom.bookings.push(booking);
        const updatedClassroom = await classroom.save();

        // Create a Notification For the New Class Room
        const notification = new Notification({
            notificationTitle: 'Class Room Changed!',
            notificationBody: `BookedClass Room "${roomName}" Has Been Changed On ${date.toDateString()}.`
        });
        const savedNotification = await notification.save();

        res.status(200).json(updatedClassroom);
    } catch (error) {
        next(error);
    }
};

// Route to Delete Class Room
exports.remove = async (req, res, next) => {
    if (!req.user.isAdmin && !req.user.isFaculty) {
        return next(errorHandler(403, 'You Are Not Allowed to Delete Book class Rooms.'));
    }
    const { id } = req.params;
    try {
        const classroom = await Classroom.findById(id);
        if (!classroom) {
            return next(errorHandler(404, 'Class Room Not Found.'));
        }
        await classroom.deleteOne();
        res.status(200).json({ message: 'Classroom Deleted Successfully.' });
    } catch (error) {
        next(error);
    }
};