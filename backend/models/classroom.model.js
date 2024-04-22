const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema(
    {
    lectureID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
}
);

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
    bookings: [bookingSchema]
}, 
{ timestamps: true }
);

const Classroom = mongoose.model('Classroom', roomSchema);

module.exports = Classroom;

