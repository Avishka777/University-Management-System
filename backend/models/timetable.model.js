import mongoose from 'mongoose';

const timeTableSchema = new mongoose.Schema({
    classSession: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses'
    },
    day: {
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
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    location: {
        type: String,
        required: true
    }
}, 
{ timestamps: true }
);

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

export default TimeTable;