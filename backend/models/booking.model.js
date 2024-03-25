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

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;