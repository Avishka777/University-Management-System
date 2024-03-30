import mongoose from 'mongoose';

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
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
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

export default Classroom;
