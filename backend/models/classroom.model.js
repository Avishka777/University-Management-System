import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
    lectureID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to Lecture model if needed
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
});

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    facilities: {
        type: [],
        required: true
    },
    bookings: [bookingSchema] // Array of bookings for the room
}, { timestamps: true });

// Define a method to check room availability
roomSchema.methods.checkAvailability = async function (date, startTime, endTime) {
    const overlappingBooking = this.bookings.find(booking => {
        return (date.getTime() === booking.date.getTime() &&
            ((startTime >= booking.startTime && startTime < booking.endTime) ||
                (endTime > booking.startTime && endTime <= booking.endTime) ||
                (startTime <= booking.startTime && endTime >= booking.endTime)));
    });

    return !overlappingBooking;
};

const Classroom = mongoose.model('Classroom', roomSchema);

export default Classroom;